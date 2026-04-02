@extends('layouts.admin')

@section('title', 'Заявки')

@section('content')
<h2 class="mb-4">Заявки</h2>

<form method="GET" action="{{ route('admin.tickets.index') }}" class="card mb-4">
    <div class="card-body">
        <h5 class="card-title">Фильтры</h5>
        <div class="row g-3">
            <div class="col-md-2">
                <label class="form-label">Статус</label>
                <select name="status" class="form-select">
                    <option value="">Все</option>
                    <option value="new" @selected(request('status') === 'new')>Новая</option>
                    <option value="in_progress" @selected(request('status') === 'in_progress')>В работе</option>
                    <option value="processed" @selected(request('status') === 'processed')>Обработана</option>
                </select>
            </div>
            <div class="col-md-3">
                <label class="form-label">Email</label>
                <input type="text" name="email" class="form-control" value="{{ request('email') }}" placeholder="email@example.com">
            </div>
            <div class="col-md-3">
                <label class="form-label">Телефон</label>
                <input type="text" name="phone" class="form-control" value="{{ request('phone') }}" placeholder="+7...">
            </div>
            <div class="col-md-2">
                <label class="form-label">Дата от</label>
                <input type="date" name="date_from" class="form-control" value="{{ request('date_from') }}">
            </div>
            <div class="col-md-2">
                <label class="form-label">Дата до</label>
                <input type="date" name="date_to" class="form-control" value="{{ request('date_to') }}">
            </div>
        </div>
        <div class="mt-3">
            <button type="submit" class="btn btn-primary">Применить</button>
            <a href="{{ route('admin.tickets.index') }}" class="btn btn-secondary">Сбросить</a>
        </div>
    </div>
</form>

<div class="table-responsive">
    <table class="table table-striped table-hover">
        <thead class="table-dark">
            <tr>
                <th>#</th>
                <th>Тема</th>
                <th>Клиент</th>
                <th>Email</th>
                <th>Телефон</th>
                <th>Статус</th>
                <th>Дата создания</th>
                <th>Действия</th>
            </tr>
        </thead>
        <tbody>
            @forelse($tickets as $ticket)
                <tr>
                    <td>{{ $ticket->id }}</td>
                    <td>{{ Str::limit($ticket->subject, 40) }}</td>
                    <td>{{ $ticket->customer->name }}</td>
                    <td>{{ $ticket->customer->email }}</td>
                    <td>{{ $ticket->customer->phone }}</td>
                    <td>
                        @switch($ticket->status)
                            @case('new')
                                <span class="badge bg-primary">Новая</span>
                                @break
                            @case('in_progress')
                                <span class="badge bg-warning text-dark">В работе</span>
                                @break
                            @case('processed')
                                <span class="badge bg-success">Обработана</span>
                                @break
                        @endswitch
                    </td>
                    <td>{{ $ticket->created_at->format('d.m.Y H:i') }}</td>
                    <td>
                        <a href="{{ route('admin.tickets.show', $ticket) }}" class="btn btn-sm btn-outline-primary">Просмотр</a>
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="8" class="text-center text-muted">Заявки не найдены</td>
                </tr>
            @endforelse
        </tbody>
    </table>
</div>

{{ $tickets->links() }}
@endsection
