<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\Task;

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
        return Inertia::render('Task/CreateTask', []);
        //
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
            'equipment' => 'required',
            'problem' => 'required']);

        Task::create([
            'user_id' => $request->user_id,
            'customer_id' => $request->customer_id,
            'date' => $request->date,
            'equipment' => $request->equipment,
            'problem' => $request->problem,
            'note' => $request->note,
            'status_id' => $request->status_id
        ]);
        
        return to_route('tasks.index');
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
