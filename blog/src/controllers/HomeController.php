<?php

namespace Blog\controllers;

use Blog\helpers\SmartyFactory;
use Blog\models\Category;

class HomeController
{
    public function index(): void
    {
        $smarty = SmartyFactory::create();

        $categories = Category::findWithRecentArticles(3);

        $smarty->assign('categories', $categories);
        $smarty->assign('page_title', 'Blog — Home');

        $smarty->display('home/index.tpl');
    }
}
