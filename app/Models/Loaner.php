<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Loaner extends Model
{
    use HasFactory;
    protected $fillable = ['status', 'note'];
    
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }


    public function tasks(): BelongsToMany
    {
        return $this->belongsToMany(Task::class);
    }
}
