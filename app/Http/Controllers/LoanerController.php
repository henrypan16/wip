<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class LoanerController extends Controller
{
    public function show()
    {
        return Inertia::render('Loaner/LoanerTable');
    }
}
