<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Visit;

class Prescription extends Model
{
    protected $table = 'prescriptions';

    protected $fillable = [
        'visit_id',
        'medicines',
        'instructions',
        'language',
        'version'
    ];

    // This handles the conversion between JSON in DB and Array in PHP
    protected $casts = [
        'medicines' => 'array'
    ];

    public $timestamps = true;

    public function visit()
    {
        return $this->belongsTo(Visit::class);
    }
}