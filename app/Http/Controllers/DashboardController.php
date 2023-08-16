<?php


namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Status;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Task;
use App\Models\Type;
use App\Models\User;

class DashboardController extends Controller
{
    //
    public function show()
    {
        $tasks = Task::select('id', 'title', 'date', 'problem', 'service_order', 'note')
                    ->addSelect([
                        'user' => User::select('name')->whereColumn('user_id', 'users.id'),
                        'customer_id' => Customer::select('id')->whereColumn('customer_id', 'customers.id'),
                        'customer' => Customer::select('name')->whereColumn('customer_id', 'customers.id'),
                        'status' => Status::select('name')->whereColumn('status_id', 'status.id'),
                        'type' => Type::select('name')->whereColumn('type_id', 'types.id')
                    ])
                    ->where('status_id', 1)
                    ->orderBy('created_at')
                    ->get();

        return Inertia::render('Dashboard', [
            'tasks' => $tasks
        ]);
    } 
}
