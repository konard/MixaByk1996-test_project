<?php

namespace Blog\models;

use Blog\helpers\Database;
use PDO;

class Category
{
    public static function findAll(): array
    {
        $db = Database::getInstance();
        $stmt = $db->query('SELECT * FROM categories ORDER BY name ASC');
        return $stmt->fetchAll();
    }

    public static function findBySlug(string $slug): ?array
    {
        $db = Database::getInstance();
        $stmt = $db->prepare('SELECT * FROM categories WHERE slug = :slug LIMIT 1');
        $stmt->execute([':slug' => $slug]);
        $result = $stmt->fetch();
        return $result ?: null;
    }

    public static function findWithRecentArticles(int $limit = 3): array
    {
        $db = Database::getInstance();

        // Get all categories that have articles
        $stmt = $db->query('
            SELECT DISTINCT c.*
            FROM categories c
            INNER JOIN article_category ac ON c.id = ac.category_id
            INNER JOIN articles a ON ac.article_id = a.id
            ORDER BY c.name ASC
        ');
        $categories = $stmt->fetchAll();

        foreach ($categories as &$category) {
            $category['articles'] = self::getRecentArticlesForCategory($category['id'], $limit);
        }

        return $categories;
    }

    private static function getRecentArticlesForCategory(int $categoryId, int $limit): array
    {
        $db = Database::getInstance();
        $stmt = $db->prepare('
            SELECT a.*
            FROM articles a
            INNER JOIN article_category ac ON a.id = ac.article_id
            WHERE ac.category_id = :category_id
            ORDER BY a.published_at DESC
            LIMIT :limit
        ');
        $stmt->bindValue(':category_id', $categoryId, PDO::PARAM_INT);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public static function getArticleCount(int $categoryId): int
    {
        $db = Database::getInstance();
        $stmt = $db->prepare('
            SELECT COUNT(*) as count
            FROM article_category
            WHERE category_id = :category_id
        ');
        $stmt->execute([':category_id' => $categoryId]);
        $result = $stmt->fetch();
        return (int) $result['count'];
    }
}
