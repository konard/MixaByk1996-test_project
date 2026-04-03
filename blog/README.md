# PHP Blog

A simple blog built with pure PHP 8.1+, MySQL, and Smarty templating engine — no frameworks.

## Features

- **Home page** — lists all categories that have articles, showing 3 latest posts per category with an "All articles" button
- **Category page** — shows category name, description, and a paginated list of articles with sorting (by date, by views)
- **Article page** — full article view with all details and a block of 3 similar articles
- **Seeder** — SQL seed data with 5 categories and 10 articles

## Tech Stack

- PHP 8.1+
- MySQL 8.0
- Smarty 5 (templating)
- SCSS (styles, pre-compiled CSS included)
- Docker + Nginx

## Quick Start

### With Docker (recommended)

```bash
docker-compose up -d
```

Then open [http://localhost:8080](http://localhost:8080).

The database schema and seed data are automatically applied on first start.

### Without Docker

1. Set up a PHP 8.1+ + MySQL environment
2. Create a database and import `database/schema.sql` then `database/seed.sql`
3. Install dependencies: `composer install`
4. Set environment variables (or update `src/helpers/Database.php`):
   - `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`
5. Point your web server document root to the `public/` directory

## Project Structure

```
blog/
├── assets/
│   ├── css/main.css          # Compiled CSS
│   └── scss/main.scss        # SCSS source
├── database/
│   ├── schema.sql            # Database schema
│   └── seed.sql              # Seed data
├── docker/
│   ├── Dockerfile
│   └── nginx/default.conf
├── public/
│   └── index.php             # Entry point / router
├── src/
│   ├── controllers/
│   │   ├── HomeController.php
│   │   ├── CategoryController.php
│   │   └── ArticleController.php
│   ├── helpers/
│   │   ├── Database.php      # PDO singleton
│   │   └── SmartyFactory.php
│   └── models/
│       ├── Article.php
│       └── Category.php
├── templates/
│   ├── cache/                # Smarty compiled templates (auto-generated)
│   └── templates/
│       ├── article/show.tpl
│       ├── category/show.tpl
│       ├── home/index.tpl
│       └── partials/
├── composer.json
└── docker-compose.yml
```

## URL Structure

| URL | Description |
|-----|-------------|
| `/` | Home page |
| `/category/{slug}` | Category page with articles |
| `/category/{slug}?sort=views&order=DESC` | Sort by views descending |
| `/category/{slug}?sort=published_at&order=ASC&page=2` | Sort by date, page 2 |
| `/article/{slug}` | Article detail page |
