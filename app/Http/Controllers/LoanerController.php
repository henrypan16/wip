<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\Loaner;
use App\Models\Category;

class LoanerController extends Controller
{
    public function index()
    {
        $loaners = Loaner::select()
                    ->addSelect([
                        'category' => Category::select('name')->whereColumn('category_id', 'categories.id'),
                    ])
                    ->get();

        return Inertia::render('Loaner/LoanerTable', [
            'loaners' => $loaners
        ]);
    }

    public function update(Request $request, string $id)
    {  
        Loaner::where('id', $id)->update(
            ['note' => $request->note]
        );

        echo('Loaner' . $id . 'updated');
    }
}
