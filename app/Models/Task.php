<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
class Task extends Model
{
    use HasFactory;
    protected $fillable = ['user_id', 'customer_id', 'title','date','equipment', 'problem', 'note', 'status_id'];

    public function status(): BelongsTo {
        return $this->belongsTo(Status::class);
    }

    public function type(): BelongsTo {
        return $this->belongsTo(Type::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function loaners(): BelongsToMany
    {
        return $this->belongsToMany(Loaner::class);
    }
}
