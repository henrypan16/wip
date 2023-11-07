<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\Task;
use App\Models\Customer;
use App\Models\Loaner;
use App\Models\Device;
use App\Models\Category;
use App\Models\Status;
use App\Models\User;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('TestPage');
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $customers = Customer::all();
        $loaners = Loaner::select('id','name','status')
            ->addSelect([
                'device' => Device::select('name')->whereColumn('device_id', 'devices.id'),
                'category' => Category::select('name')->whereColumn('category_id', 'categories.id')])
            ->where('status', 'Available')
            ->get();
        $users = User::all();
                
        return Inertia::render('Task/CreateTask', [
            'customers' => $customers,
            'allLoaners' => $loaners,
            'users' => $users
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'customer_id' => 'required',
            'user_id' => 'required',
            'service_order' => 'required',
            'date' => 'required',
            'title' => 'required',
            'equipment' => 'required',
            'problem' => 'required']);

        $task = Task::create([
            'user_id' => $request->user_id,
            'customer_id' => $request->customer_id,
            'date' => $request->date,
            'title' => $request->title,
            'service_order' => $request->service_order,
            'equipment' => $request->equipment,
            'problem' => $request->problem,
            'note' => $request->note,
            'status_id' => $request->status_id
        ]);
        
        foreach($request->loaners as $l) {
            echo(1);
            $loaner = Loaner::find($l['id']);
            $loaner->status = $request->customer_id;
            $loaner->save();
            $task->loaners()->attach($loaner);
        }

        return to_route('dashboard');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {

        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {   
        $status = Status::all();
        $task = Task::select('id', 'title', 'date', 'problem', 'service_order', 'note', 'equipment')
                    ->addSelect([
                        'user' => User::select('name')->whereColumn('user_id', 'users.id'),
                        'customer_id' => Customer::select('id')->whereColumn('customer_id', 'customers.id'),
                        'customer' => Customer::select('name')->whereColumn('customer_id', 'customers.id'),
                        'status_id' => Status::select('id')->whereColumn('status_id', 'status.id')
                    ])
                    ->where('id', $id)
                    ->first();

        return Inertia::render('Task/UpdateTask', [
            'task' => $task,
            'status' => $status
        ]);
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'title' => 'required',
            'equipment' => 'required',
            'problem' => 'required']);

        $task = Task::where('id', $id)
            ->update([
                'title' => $request->title,
                'equipment' => $request->equipment,
                'problem' => $request->problem,
                'note' => $request->note,
                'status_id' => $request->status_id
            ]);

        return to_route('dashboard');   
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
