<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LoanerController;
use App\Http\Controllers\KeysController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

Route::resource('/task', TaskController::class);
Route::resource('/loaner', LoanerController::class);

Route::get('/', [DashboardController::class, 'show']);
Route::get('/dashboard', [DashboardController::class, 'show'])->name('dashboard')->middleware('auth');
Route::patch('/dashboard/complete/{task}', [DashboardController::class, 'complete'])->name('complete');
Route::patch('/dashboard/ready', [DashboardController::class, 'ready'])->name('ready');

Route::get('/receive', function() {
    return Inertia::render('Task/ReceiveForm');});
// ->middleware(['auth', 'verified'])->name('dashboard');
Route::get('/keys',[KeysController::class, 'show'])->name('keys');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


require __DIR__.'/auth.php';
