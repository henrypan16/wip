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
        $loaners = Loaner::select('id','name','status')
            ->addSelect([
                'category' => Category::select('name')->whereColumn('category_id', 'categories.id')])
            ->where('status', '0')
            ->get();
        $users = User::all();
                
        return Inertia::render('Task/CreateTask', [
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
            'customer_name' => $request->customer_name,
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
        $task = Task::select('id', 'title', 'date', 'problem', 'service_order', 'note', 'equipment', 'customer_id', 'customer_name')
                    ->addSelect([
                        'user' => User::select('name')->whereColumn('user_id', 'users.id'),
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
        // $request->validate([
        //     'title' => 'required',
        //     'equipment' => 'required',
        //     'problem' => 'required']);
        $task = Task::where('id', $id)->first();
        $loaners = Loaner::where('status', $task->customer_id)->get();

        $task->update([
                'title' => $request->title == null ? $task->title : $request->title,
                'equipment' => $request->equipment == null ? $task->equipment : $request->equipment,
                'problem' => $request->problem == null ? $task->problem : $request->problem,
                'note' => $request->note == null ? $task->note : $request->note,
                'status_id' => $request->status_id == null ? $task->status_id : $request->status_id,
            ]);

        if($task->status_id == 6)
        {
            foreach($loaners as $loaner) {
                $loaner->update([
                    'status' => 0
                ]);
            }
        }
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
