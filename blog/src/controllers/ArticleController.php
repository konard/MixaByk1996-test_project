<?php

namespace Blog\controllers;

use Blog\helpers\SmartyFactory;
use Blog\models\Article;

class ArticleController
{
    public function show(string $slug): void
    {
        $article = Article::findBySlug($slug);

        if (!$article) {
            http_response_code(404);
            $smarty = SmartyFactory::create();
            $smarty->assign('page_title', '404 — Not Found');
            $smarty->display('partials/404.tpl');
            return;
        }

        Article::incrementViews($article['id']);
        $article['views'] = $article['views'] + 1;

        $categories = Article::getCategories($article['id']);
        $categoryIds = array_column($categories, 'id');
        $similarArticles = Article::getSimilar($article['id'], $categoryIds, 3);

        $smarty = SmartyFactory::create();
        $smarty->assign('article', $article);
        $smarty->assign('categories', $categories);
        $smarty->assign('similar_articles', $similarArticles);
        $smarty->assign('page_title', $article['title'] . ' — Blog');

        $smarty->display('article/show.tpl');
    }
}
