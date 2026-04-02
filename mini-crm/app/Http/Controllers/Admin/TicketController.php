<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateTicketStatusRequest;
use App\Models\Ticket;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class TicketController extends Controller
{
    public function index(Request $request): View
    {
        $query = Ticket::with('customer')->latest();

        if ($request->filled('status')) {
            $query->byStatus($request->input('status'));
        }

        if ($request->filled('email')) {
            $query->byEmail($request->input('email'));
        }

        if ($request->filled('phone')) {
            $query->byPhone($request->input('phone'));
        }

        if ($request->filled('date_from') && $request->filled('date_to')) {
            $query->byDateRange($request->input('date_from'), $request->input('date_to'));
        }

        $tickets = $query->paginate(15)->withQueryString();

        return view('admin.tickets.index', compact('tickets'));
    }

    public function show(Ticket $ticket): View
    {
        $ticket->load(['customer', 'media']);

        return view('admin.tickets.show', compact('ticket'));
    }

    public function updateStatus(UpdateTicketStatusRequest $request, Ticket $ticket): RedirectResponse
    {
        $ticket->update([
            'status' => $request->validated('status'),
            'manager_responded_at' => now(),
        ]);

        return redirect()
            ->route('admin.tickets.show', $ticket)
            ->with('success', 'Статус заявки обновлён.');
    }
}
