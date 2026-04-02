<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTicketRequest;
use App\Http\Resources\TicketResource;
use App\Http\Resources\TicketStatisticsResource;
use App\Models\Customer;
use App\Models\Ticket;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;

class TicketController extends Controller
{
    public function store(StoreTicketRequest $request): JsonResponse
    {
        $validated = $request->validated();

        // Rate limiting: 1 ticket per day per phone or email
        $existingCustomer = Customer::where('phone', $validated['phone'])
            ->orWhere('email', $validated['email'])
            ->first();

        if ($existingCustomer) {
            $recentTicket = $existingCustomer->tickets()
                ->where('created_at', '>=', Carbon::now()->subDay())
                ->exists();

            if ($recentTicket) {
                return response()->json([
                    'message' => 'Вы уже отправляли заявку в течение последних 24 часов. Попробуйте позже.',
                ], 429);
            }
        }

        $customer = Customer::firstOrCreate(
            ['phone' => $validated['phone']],
            [
                'name' => $validated['name'],
                'email' => $validated['email'],
            ]
        );

        // Update name/email if customer exists but data changed
        $customer->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
        ]);

        $ticket = Ticket::create([
            'customer_id' => $customer->id,
            'subject' => $validated['subject'],
            'body' => $validated['body'],
        ]);

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $ticket->addMedia($file)->toMediaCollection('attachments');
            }
        }

        $ticket->load(['customer', 'media']);

        return response()->json([
            'message' => 'Заявка успешно создана.',
            'data' => new TicketResource($ticket),
        ], 201);
    }

    public function statistics(): JsonResponse
    {
        $stats = [
            'today' => [
                'total' => Ticket::createdToday()->count(),
                'new' => Ticket::createdToday()->byStatus('new')->count(),
                'in_progress' => Ticket::createdToday()->byStatus('in_progress')->count(),
                'processed' => Ticket::createdToday()->byStatus('processed')->count(),
            ],
            'week' => [
                'total' => Ticket::createdThisWeek()->count(),
                'new' => Ticket::createdThisWeek()->byStatus('new')->count(),
                'in_progress' => Ticket::createdThisWeek()->byStatus('in_progress')->count(),
                'processed' => Ticket::createdThisWeek()->byStatus('processed')->count(),
            ],
            'month' => [
                'total' => Ticket::createdThisMonth()->count(),
                'new' => Ticket::createdThisMonth()->byStatus('new')->count(),
                'in_progress' => Ticket::createdThisMonth()->byStatus('in_progress')->count(),
                'processed' => Ticket::createdThisMonth()->byStatus('processed')->count(),
            ],
        ];

        return response()->json([
            'data' => new TicketStatisticsResource($stats),
        ]);
    }
}
