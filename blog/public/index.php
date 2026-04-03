<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/vendor/autoload.php';

use Blog\controllers\HomeController;
use Blog\controllers\CategoryController;
use Blog\controllers\ArticleController;

// Parse the request URI
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$requestUri = rtrim($requestUri, '/') ?: '/';

// Simple router
try {
    if ($requestUri === '/') {
        (new HomeController())->index();
    } elseif (preg_match('#^/category/([a-z0-9\-]+)$#', $requestUri, $matches)) {
        (new CategoryController())->show($matches[1]);
    } elseif (preg_match('#^/article/([a-z0-9\-]+)$#', $requestUri, $matches)) {
        (new ArticleController())->show($matches[1]);
    } else {
        http_response_code(404);
        require_once dirname(__DIR__) . '/src/helpers/SmartyFactory.php';
        $smarty = \Blog\helpers\SmartyFactory::create();
        $smarty->assign('page_title', '404 — Not Found');
        $smarty->display('partials/404.tpl');
    }
} catch (\Exception $e) {
    error_log($e->getMessage());
    http_response_code(500);
    echo '<h1>500 — Internal Server Error</h1>';
    echo '<p>Something went wrong. Please try again later.</p>';
}
