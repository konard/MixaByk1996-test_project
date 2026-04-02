<?php

namespace App\Http\Controllers;

use Illuminate\View\View;

class WidgetController extends Controller
{
    public function __invoke(): View
    {
        return view('widget');
    }
}
