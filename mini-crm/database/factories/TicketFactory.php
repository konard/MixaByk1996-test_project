<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\Ticket;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Ticket> */
class TicketFactory extends Factory
{
    protected $model = Ticket::class;

    public function definition(): array
    {
        return [
            'customer_id' => Customer::factory(),
            'subject' => fake()->sentence(4),
            'body' => fake()->paragraphs(2, true),
            'status' => fake()->randomElement(['new', 'in_progress', 'processed']),
            'manager_responded_at' => fake()->optional(0.3)->dateTimeBetween('-1 month', 'now'),
        ];
    }

    public function newStatus(): static
    {
        return $this->state(fn () => ['status' => 'new']);
    }

    public function inProgress(): static
    {
        return $this->state(fn () => ['status' => 'in_progress']);
    }

    public function processed(): static
    {
        return $this->state(fn () => [
            'status' => 'processed',
            'manager_responded_at' => now(),
        ]);
    }
}
