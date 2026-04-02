<?php

namespace Tests\Feature\Api;

use App\Models\Customer;
use App\Models\Ticket;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class TicketApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_ticket(): void
    {
        $response = $this->postJson('/api/tickets', [
            'name' => 'John Doe',
            'phone' => '+79991234567',
            'email' => 'john@example.com',
            'subject' => 'Test Subject',
            'body' => 'Test body content',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'data' => [
                    'id',
                    'subject',
                    'body',
                    'status',
                    'customer' => ['id', 'name', 'phone', 'email'],
                    'created_at',
                ],
            ]);

        $this->assertDatabaseHas('customers', [
            'phone' => '+79991234567',
            'email' => 'john@example.com',
        ]);

        $this->assertDatabaseHas('tickets', [
            'subject' => 'Test Subject',
            'status' => 'new',
        ]);
    }

    public function test_create_ticket_validates_required_fields(): void
    {
        $response = $this->postJson('/api/tickets', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'phone', 'email', 'subject', 'body']);
    }

    public function test_create_ticket_validates_phone_e164_format(): void
    {
        $response = $this->postJson('/api/tickets', [
            'name' => 'John Doe',
            'phone' => '12345',
            'email' => 'john@example.com',
            'subject' => 'Test',
            'body' => 'Test body',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['phone']);
    }

    public function test_rate_limit_one_ticket_per_day(): void
    {
        $payload = [
            'name' => 'John Doe',
            'phone' => '+79991234567',
            'email' => 'john@example.com',
            'subject' => 'First ticket',
            'body' => 'First body',
        ];

        $this->postJson('/api/tickets', $payload)->assertStatus(201);

        $response = $this->postJson('/api/tickets', array_merge($payload, [
            'subject' => 'Second ticket',
            'body' => 'Second body',
        ]));

        $response->assertStatus(429);
    }

    public function test_can_create_ticket_with_files(): void
    {
        Storage::fake('local');

        $response = $this->postJson('/api/tickets', [
            'name' => 'John Doe',
            'phone' => '+79991234567',
            'email' => 'john@example.com',
            'subject' => 'With files',
            'body' => 'Body with files',
            'files' => [
                UploadedFile::fake()->create('document.pdf', 100),
            ],
        ]);

        $response->assertStatus(201);

        $ticket = Ticket::first();
        $this->assertCount(1, $ticket->getMedia('attachments'));
    }

    public function test_statistics_endpoint(): void
    {
        $customer = Customer::factory()->create();
        Ticket::factory(3)->create([
            'customer_id' => $customer->id,
            'status' => 'new',
        ]);

        $response = $this->getJson('/api/tickets/statistics');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'today' => ['total', 'new', 'in_progress', 'processed'],
                    'week' => ['total', 'new', 'in_progress', 'processed'],
                    'month' => ['total', 'new', 'in_progress', 'processed'],
                ],
            ]);
    }
}
