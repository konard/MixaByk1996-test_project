<?php

namespace Tests\Feature\Admin;

use App\Models\Customer;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class TicketAdminTest extends TestCase
{
    use RefreshDatabase;

    private User $manager;

    protected function setUp(): void
    {
        parent::setUp();

        Role::firstOrCreate(['name' => 'manager']);
        $this->manager = User::factory()->create();
        $this->manager->assignRole('manager');
    }

    public function test_guest_cannot_access_admin_tickets(): void
    {
        $response = $this->get('/admin/tickets');

        $response->assertRedirect('/login');
    }

    public function test_manager_can_view_ticket_list(): void
    {
        $customer = Customer::factory()->create();
        Ticket::factory(5)->create(['customer_id' => $customer->id]);

        $response = $this->actingAs($this->manager)->get('/admin/tickets');

        $response->assertStatus(200);
        $response->assertViewIs('admin.tickets.index');
        $response->assertViewHas('tickets');
    }

    public function test_manager_can_filter_tickets_by_status(): void
    {
        $customer = Customer::factory()->create();
        Ticket::factory(3)->create(['customer_id' => $customer->id, 'status' => 'new']);
        Ticket::factory(2)->create(['customer_id' => $customer->id, 'status' => 'processed']);

        $response = $this->actingAs($this->manager)->get('/admin/tickets?status=new');

        $response->assertStatus(200);
        $tickets = $response->viewData('tickets');
        $this->assertEquals(3, $tickets->total());
    }

    public function test_manager_can_view_ticket_details(): void
    {
        $customer = Customer::factory()->create();
        $ticket = Ticket::factory()->create(['customer_id' => $customer->id]);

        $response = $this->actingAs($this->manager)->get("/admin/tickets/{$ticket->id}");

        $response->assertStatus(200);
        $response->assertViewIs('admin.tickets.show');
        $response->assertViewHas('ticket');
    }

    public function test_manager_can_update_ticket_status(): void
    {
        $customer = Customer::factory()->create();
        $ticket = Ticket::factory()->create([
            'customer_id' => $customer->id,
            'status' => 'new',
        ]);

        $response = $this->actingAs($this->manager)
            ->patch("/admin/tickets/{$ticket->id}/status", [
                'status' => 'in_progress',
            ]);

        $response->assertRedirect(route('admin.tickets.show', $ticket));
        $this->assertDatabaseHas('tickets', [
            'id' => $ticket->id,
            'status' => 'in_progress',
        ]);
    }

    public function test_update_status_validates_input(): void
    {
        $customer = Customer::factory()->create();
        $ticket = Ticket::factory()->create(['customer_id' => $customer->id]);

        $response = $this->actingAs($this->manager)
            ->patch("/admin/tickets/{$ticket->id}/status", [
                'status' => 'invalid_status',
            ]);

        $response->assertSessionHasErrors(['status']);
    }
}
