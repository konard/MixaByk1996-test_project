# Mini-CRM — Система сбора и обработки заявок

Мини-CRM для сбора и обработки заявок с сайта через универсальный виджет обратной связи.

## Функциональность

- **Виджет обратной связи** (`/widget`) — Blade-страница с AJAX-формой, готовая для встраивания через iframe
- **REST API** — Создание заявок (`POST /api/tickets`) и статистика (`GET /api/tickets/statistics`)
- **Админ-панель** — Просмотр, фильтрация заявок по статусу/дате/email/телефону, смена статуса
- **Файлы** — Загрузка файлов к заявкам через spatie/laravel-medialibrary
- **Роли** — Управление ролями через spatie/laravel-permission
- **Ограничение** — Не более 1 заявки в сутки с одного номера/email

## Требования

- PHP 8.4+
- Composer
- MySQL 8.0 / SQLite (для разработки)
- Node.js 18+ (для сборки фронтенда)

## Быстрый старт (Docker)

```bash
cd mini-crm
cp .env.example .env

# Настроить переменные БД в .env:
# DB_CONNECTION=mysql
# DB_HOST=db
# DB_DATABASE=mini_crm
# DB_USERNAME=mini_crm
# DB_PASSWORD=secret

docker compose up -d --build
docker compose exec app php artisan key:generate
docker compose exec app php artisan migrate --seed
docker compose exec app php artisan storage:link
```

Приложение будет доступно по адресу: http://localhost:8080

## Локальный запуск (без Docker)

```bash
cd mini-crm
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
npm install && npm run build
php artisan serve
```

Приложение будет доступно по адресу: http://localhost:8000

## Тестовые данные

После запуска `php artisan migrate --seed` будут созданы:

| Сущность | Данные |
|----------|--------|
| Менеджер | `manager@example.com` / `password` |
| Клиенты | 5 тестовых клиентов |
| Заявки | ~20 заявок с разными статусами |
| Роли | `manager`, `admin` |

## Встраивание виджета (iframe)

```html
<iframe
    src="https://your-domain.com/widget"
    width="100%"
    height="700"
    frameborder="0"
    style="border: none; max-width: 550px;"
></iframe>
```

## API

### POST /api/tickets — Создание заявки

**Запрос (multipart/form-data):**

| Поле | Тип | Обязательно | Описание |
|------|-----|-------------|----------|
| name | string | да | Имя клиента |
| phone | string | да | Телефон в формате E.164 (+79991234567) |
| email | string | да | Email клиента |
| subject | string | да | Тема заявки |
| body | string | да | Текст заявки |
| files[] | file | нет | Файлы (макс. 5 файлов, до 10 МБ каждый) |

**Успешный ответ (201):**
```json
{
    "message": "Заявка успешно создана.",
    "data": {
        "id": 1,
        "subject": "Тема",
        "body": "Текст",
        "status": "new",
        "customer": {
            "id": 1,
            "name": "Имя",
            "phone": "+79991234567",
            "email": "email@example.com"
        },
        "files": [],
        "created_at": "2026-04-02T10:00:00.000000Z",
        "updated_at": "2026-04-02T10:00:00.000000Z"
    }
}
```

**Ограничение (429):**
```json
{
    "message": "Вы уже отправляли заявку в течение последних 24 часов. Попробуйте позже."
}
```

### GET /api/tickets/statistics — Статистика заявок

**Ответ (200):**
```json
{
    "data": {
        "today": { "total": 5, "new": 3, "in_progress": 1, "processed": 1 },
        "week": { "total": 20, "new": 10, "in_progress": 5, "processed": 5 },
        "month": { "total": 50, "new": 20, "in_progress": 15, "processed": 15 }
    }
}
```

## Тесты

```bash
php artisan test
```

## Структура проекта

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Api/TicketController.php     # API контроллер для заявок
│   │   ├── Admin/TicketController.php   # Админ-панель
│   │   └── WidgetController.php         # Виджет обратной связи
│   ├── Requests/
│   │   ├── StoreTicketRequest.php       # Валидация создания заявки
│   │   └── UpdateTicketStatusRequest.php # Валидация смены статуса
│   └── Resources/
│       ├── TicketResource.php           # API Resource для заявки
│       ├── CustomerResource.php         # API Resource для клиента
│       ├── MediaResource.php            # API Resource для файлов
│       └── TicketStatisticsResource.php # API Resource для статистики
├── Models/
│   ├── User.php                         # Менеджер/Админ
│   ├── Customer.php                     # Клиент
│   └── Ticket.php                       # Заявка (с Eloquent scopes)
database/
├── factories/                           # Фабрики для тестовых данных
├── migrations/                          # Миграции БД
└── seeders/                             # Сидеры с тестовыми данными
resources/views/
├── admin/tickets/                       # Админ-панель (Blade)
├── layouts/admin.blade.php              # Layout админки
└── widget.blade.php                     # Виджет обратной связи
```

## Архитектурные решения

Подробное описание архитектурных и технических решений доступно в файле [ARCHITECTURE.md](ARCHITECTURE.md).
