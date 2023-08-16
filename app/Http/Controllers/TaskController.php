<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\Task;
use App\Models\Customer;
use App\Models\Loaner;
use App\Models\Device;
use App\Models\Category;

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
                'device' => Device::select('name')
                    ->whereColumn('device_id', 'devices.id'),
                'category' => Category::select('name')
                    ->whereColumn('category_id', 'categories.id')
            ])->get();

        return Inertia::render('Task/CreateTask', [
            'customers' => $customers,
            'allLoaners' => $loaners
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
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
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
