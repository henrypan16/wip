<?php


namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Customer;
use App\Models\Device;
use App\Models\Loaner;
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
        
        $loaners = Loaner::select('id', 'name', 'status')
                        ->addSelect([
                            'category' => Category::select('name')->whereColumn('category_id', 'categories.id'),
                            'device' => Device::select('name')->whereColumn('device_id', 'devices.id')])
                        ->where('status', '!=', 'Available')
                        ->get();

        return Inertia::render('Dashboard', [
            'tasks' => $tasks,
            'loaners' => $loaners
        ]);
    } 
}
