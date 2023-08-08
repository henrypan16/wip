<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tightenco\Ziggy\Ziggy;
use Illuminate\Support\Facades\DB;
use App\Models\Category;
use App\Models\Customer;
use App\Models\Device;
use App\Models\Loaner;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user(),
            ],
            'ziggy' => function () use ($request) {
                return array_merge((new Ziggy)->toArray(), [
                    'location' => $request->url(),
                ]);
            },
            'customers' => fn() => Customer::all(),
            'categories' => fn() => Category::all(),
            'allLoaners' => fn() => Loaner::select('id','name','status')
            ->addSelect([
                'device' => Device::select('name')
                    ->whereColumn('device_id', 'devices.id'),
                'category' => Category::select('name')
                    ->whereColumn('category_id', 'categories.id')
            ])->get(),
        ]);
    }
}
