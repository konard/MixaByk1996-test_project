<?php

namespace Blog\controllers;

use Blog\helpers\SmartyFactory;
use Blog\models\Category;
use Blog\models\Article;

class CategoryController
{
    private const PER_PAGE = 5;

    public function show(string $slug): void
    {
        $category = Category::findBySlug($slug);

        if (!$category) {
            http_response_code(404);
            $smarty = SmartyFactory::create();
            $smarty->assign('page_title', '404 — Not Found');
            $smarty->display('partials/404.tpl');
            return;
        }

        $page = max(1, (int) ($_GET['page'] ?? 1));
        $sortBy = $_GET['sort'] ?? 'published_at';
        $sortOrder = strtoupper($_GET['order'] ?? 'DESC');

        $allowedSorts = ['published_at', 'views'];
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'published_at';
        }
        if (!in_array($sortOrder, ['ASC', 'DESC'])) {
            $sortOrder = 'DESC';
        }

        $totalArticles = Article::countByCategory($category['id']);
        $totalPages = (int) ceil($totalArticles / self::PER_PAGE);
        $page = min($page, max(1, $totalPages));

        $articles = Article::findByCategoryPaginated(
            $category['id'],
            $page,
            self::PER_PAGE,
            $sortBy,
            $sortOrder
        );

        $smarty = SmartyFactory::create();
        $pageWindowStart = max(1, $page - 2);
        $pageWindowEnd = min($totalPages, $page + 2);

        $smarty->assign('category', $category);
        $smarty->assign('articles', $articles);
        $smarty->assign('current_page', $page);
        $smarty->assign('total_pages', $totalPages);
        $smarty->assign('total_articles', $totalArticles);
        $smarty->assign('sort_by', $sortBy);
        $smarty->assign('sort_order', $sortOrder);
        $smarty->assign('per_page', self::PER_PAGE);
        $smarty->assign('page_window_start', $pageWindowStart);
        $smarty->assign('page_window_end', $pageWindowEnd);
        $smarty->assign('page_title', $category['name'] . ' — Blog');

        $smarty->display('category/show.tpl');
    }
}
