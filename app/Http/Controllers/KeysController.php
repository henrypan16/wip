<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\Loaner;
use App\Models\Device;
use App\Models\Category;

class KeysController extends Controller
{
    public function show()
    {
        $loaners = Loaner::select()
        ->addSelect([
            'category' => Category::select('name')->whereColumn('category_id', 'categories.id')
        ])
        ->get();

        return Inertia::render('Loaner/LoanerTable', [
            'loaners' => $loaners
        ]);
    }
    //
}
