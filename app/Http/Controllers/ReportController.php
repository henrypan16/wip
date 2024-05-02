<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\Task;
use App\Models\Customer;
use App\Models\Loaner;
use App\Models\Category;
use App\Models\Status;
use App\Models\User;

class ReportController extends Controller
{
    public function ready()
    {
        $tasks = Task::where('status_id', 5)
        ->select('id', 'customer_id', 'customer_name', 'service_order', 'problem', 'note')
        ->addSelect([
            'loaner' => Loaner::select('name')->whereColumn('id', 'tasks.id')
        ])
        ->get();
    
    return Inertia::render('Report', [
        'tasks' => $tasks
    ]);
        
        return Inertia::render('Report', [
            'tasks' => $tasks
        ]);
        //
    }

    public function action()
    {
        $tasks = Task::where('status_id', 4)
            ->select('id', 'customer_id', 'customer_name', 'service_order', 'problem', 'note')
            ->addSelect([
                'loaner' => Loaner::select('name')->whereColumn('id', 'tasks.id')
            ])
            ->get();
        
        return Inertia::render('Report', [
            'tasks' => $tasks
        ]);
        //
    }

    public function repair()
    {
        $tasks = Task::where('status_id', 2)
            ->select('id', 'customer_id', 'customer_name', 'service_order', 'problem', 'note')
            ->addSelect([
                'loaner' => Loaner::select('name')->whereColumn('id', 'tasks.id')
            ])
            ->get();
        
        return Inertia::render('Report', [
            'tasks' => $tasks
        ]);
        //
    }
}
