<?php


namespace App\Http\Controllers;

use App\Models\Loaner;
use App\Models\Status;
use Inertia\Inertia;
use App\Models\Task;
use App\Models\User;

class DashboardController extends Controller
{
    //
    public function show()
    {
        $tasks = Task::select('id', 'title', 'date', 'problem', 'service_order', 'note', 'customer_id', 'customer_name')
                    ->addSelect([
                        'user' => User::select('name')->whereColumn('user_id', 'users.id'),
                        'status_id' => Status::select('id')->whereColumn('status_id', 'status.id'),
                        'status' => Status::select('name')->whereColumn('status_id', 'status.id')
                    ])
                    ->where('status_id', '!=', 6)
                    ->orderBy('created_at')
                    ->get();
        
        $loaners = Loaner::where('status', '>=', 0)
                        ->get();

        return Inertia::render('Dashboard', [
            'tasks' => $tasks,
            'loaners' => $loaners
        ]);
    }

    public function complete(string $task)
    {
        Task::where('id', $task)
            ->update([
                'status_id' => 6
            ]);
        
        return to_route('dashboard');
    }

    public function ready(string $task)
    {
        Task::where('id', $task)
            ->update([
                'status_id' => 5
            ]);
        
        return to_route('dashboard');
    }
}
