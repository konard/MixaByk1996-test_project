<?php

namespace Blog\models;

use Blog\helpers\Database;
use PDO;

class Article
{
    public static function findBySlug(string $slug): ?array
    {
        $db = Database::getInstance();
        $stmt = $db->prepare('SELECT * FROM articles WHERE slug = :slug LIMIT 1');
        $stmt->execute([':slug' => $slug]);
        $result = $stmt->fetch();
        return $result ?: null;
    }

    public static function incrementViews(int $id): void
    {
        $db = Database::getInstance();
        $stmt = $db->prepare('UPDATE articles SET views = views + 1 WHERE id = :id');
        $stmt->execute([':id' => $id]);
    }

    public static function getCategories(int $articleId): array
    {
        $db = Database::getInstance();
        $stmt = $db->prepare('
            SELECT c.*
            FROM categories c
            INNER JOIN article_category ac ON c.id = ac.category_id
            WHERE ac.article_id = :article_id
            ORDER BY c.name ASC
        ');
        $stmt->execute([':article_id' => $articleId]);
        return $stmt->fetchAll();
    }

    public static function getSimilar(int $articleId, array $categoryIds, int $limit = 3): array
    {
        if (empty($categoryIds)) {
            return [];
        }

        $db = Database::getInstance();
        $placeholders = implode(',', array_fill(0, count($categoryIds), '?'));

        $params = array_values($categoryIds);
        $params[] = $articleId;

        $stmt = $db->prepare("
            SELECT DISTINCT a.*, COUNT(ac.category_id) as shared_categories
            FROM articles a
            INNER JOIN article_category ac ON a.id = ac.article_id
            WHERE ac.category_id IN ({$placeholders})
            AND a.id != ?
            GROUP BY a.id
            ORDER BY shared_categories DESC, a.published_at DESC
            LIMIT {$limit}
        ");
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public static function findByCategoryPaginated(
        int $categoryId,
        int $page,
        int $perPage,
        string $sortBy = 'published_at',
        string $sortOrder = 'DESC'
    ): array {
        $db = Database::getInstance();

        $allowedSortFields = ['published_at', 'views', 'title'];
        $allowedSortOrders = ['ASC', 'DESC'];

        if (!in_array($sortBy, $allowedSortFields)) {
            $sortBy = 'published_at';
        }
        if (!in_array(strtoupper($sortOrder), $allowedSortOrders)) {
            $sortOrder = 'DESC';
        }

        $offset = ($page - 1) * $perPage;

        $stmt = $db->prepare("
            SELECT a.*
            FROM articles a
            INNER JOIN article_category ac ON a.id = ac.article_id
            WHERE ac.category_id = :category_id
            ORDER BY a.{$sortBy} {$sortOrder}
            LIMIT :limit OFFSET :offset
        ");
        $stmt->bindValue(':category_id', $categoryId, PDO::PARAM_INT);
        $stmt->bindValue(':limit', $perPage, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll();
    }

    public static function countByCategory(int $categoryId): int
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
