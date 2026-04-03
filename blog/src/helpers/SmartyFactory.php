<?php

namespace Blog\helpers;

use Smarty\Smarty;

class SmartyFactory
{
    public static function create(): Smarty
    {
        $smarty = new Smarty();

        $baseDir = dirname(__DIR__, 2);

        $smarty->setTemplateDir($baseDir . '/templates/templates');
        $smarty->setCompileDir($baseDir . '/templates/cache');
        $smarty->setConfigDir($baseDir . '/templates/configs');
        $smarty->setPluginsDir($baseDir . '/templates/plugins');

        $smarty->caching = false;
        $smarty->debugging = false;

        return $smarty;
    }
}
