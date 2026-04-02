<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create roles
        $managerRole = Role::firstOrCreate(['name' => 'manager']);
        Role::firstOrCreate(['name' => 'admin']);

        // Create manager user
        $manager = User::factory()->create([
            'name' => 'Manager',
            'email' => 'manager@example.com',
            'password' => bcrypt('password'),
        ]);
        $manager->assignRole($managerRole);

        // Create customers
        $customers = Customer::factory(5)->create();

        // Create tickets for each customer
        $customers->each(function (Customer $customer) {
            Ticket::factory(3)->create(['customer_id' => $customer->id]);
        });

        // Create a few tickets with specific statuses for testing
        Ticket::factory(2)->newStatus()->create(['customer_id' => $customers->first()->id]);
        Ticket::factory(2)->inProgress()->create(['customer_id' => $customers->last()->id]);
        Ticket::factory(1)->processed()->create(['customer_id' => $customers->random()->id]);
    }
}
