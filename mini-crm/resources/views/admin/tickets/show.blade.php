@extends('layouts.admin')

@section('title', 'Заявка #' . $ticket->id)

@section('content')
<div class="d-flex justify-content-between align-items-center mb-4">
    <h2>Заявка #{{ $ticket->id }}</h2>
    <a href="{{ route('admin.tickets.index') }}" class="btn btn-outline-secondary">Назад к списку</a>
</div>

<div class="row">
    <div class="col-md-8">
        <div class="card mb-4">
            <div class="card-header">
                <h5 class="mb-0">{{ $ticket->subject }}</h5>
            </div>
            <div class="card-body">
                <p>{!! nl2br(e($ticket->body)) !!}</p>
            </div>
            <div class="card-footer text-muted">
                Создана: {{ $ticket->created_at->format('d.m.Y H:i') }}
                @if($ticket->manager_responded_at)
                    | Ответ менеджера: {{ $ticket->manager_responded_at->format('d.m.Y H:i') }}
                @endif
            </div>
        </div>

        @if($ticket->media->count())
            <div class="card mb-4">
                <div class="card-header">
                    <h5 class="mb-0">Файлы ({{ $ticket->media->count() }})</h5>
                </div>
                <ul class="list-group list-group-flush">
                    @foreach($ticket->media as $media)
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <span>{{ $media->file_name }} ({{ number_format($media->size / 1024, 1) }} KB)</span>
                            <a href="{{ $media->getUrl() }}" class="btn btn-sm btn-outline-primary" download>Скачать</a>
                        </li>
                    @endforeach
                </ul>
            </div>
        @endif
    </div>

    <div class="col-md-4">
        <div class="card mb-4">
            <div class="card-header">
                <h5 class="mb-0">Клиент</h5>
            </div>
            <div class="card-body">
                <p><strong>Имя:</strong> {{ $ticket->customer->name }}</p>
                <p><strong>Email:</strong> {{ $ticket->customer->email }}</p>
                <p><strong>Телефон:</strong> {{ $ticket->customer->phone }}</p>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h5 class="mb-0">Статус</h5>
            </div>
            <div class="card-body">
                <p>Текущий:
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
                </p>

                <form method="POST" action="{{ route('admin.tickets.update-status', $ticket) }}">
                    @csrf
                    @method('PATCH')
                    <div class="mb-3">
                        <label class="form-label">Изменить статус</label>
                        <select name="status" class="form-select">
                            <option value="new" @selected($ticket->status === 'new')>Новая</option>
                            <option value="in_progress" @selected($ticket->status === 'in_progress')>В работе</option>
                            <option value="processed" @selected($ticket->status === 'processed')>Обработана</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary w-100">Обновить статус</button>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection
