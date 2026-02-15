<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Visit;

class Patient extends Model
{
    protected $table = 'patients';

    protected $fillable = [
        'name',
        'age',
        'gender',
        'phone',
        'address',
        'weight',      // 👈 Added for medical records
        'bloodGroup',  // 👈 Added for medical records
        'lastVisit',   // 👈 Added to track follow-ups
        'is_active'
    ];

    public $timestamps = true;

    /**
     * Relationship with Visits
     */
    public function visits()
    {
        return $this->hasMany(Visit::class);
    }
}