<?php

namespace Blog\helpers;

use PDO;
use PDOException;

class Database
{
    private static ?PDO $instance = null;

    public static function getInstance(): PDO
    {
        if (self::$instance === null) {
            $host = $_ENV['DB_HOST'] ?? getenv('DB_HOST') ?: 'mysql';
            $port = $_ENV['DB_PORT'] ?? getenv('DB_PORT') ?: '3306';
            $dbname = $_ENV['DB_DATABASE'] ?? getenv('DB_DATABASE') ?: 'blog';
            $username = $_ENV['DB_USERNAME'] ?? getenv('DB_USERNAME') ?: 'blog_user';
            $password = $_ENV['DB_PASSWORD'] ?? getenv('DB_PASSWORD') ?: 'blog_password';

            try {
                self::$instance = new PDO(
                    "mysql:host={$host};port={$port};dbname={$dbname};charset=utf8mb4",
                    $username,
                    $password,
                    [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                        PDO::ATTR_EMULATE_PREPARES => false,
                    ]
                );
            } catch (PDOException $e) {
                error_log('Database connection failed: ' . $e->getMessage());
                throw new \RuntimeException('Database connection failed.');
            }
        }

        return self::$instance;
    }
}
