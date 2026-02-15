<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Patient;
use App\Models\Prescription;
use App\Models\ReportImage;

class Visit extends Model
{
    protected $table = 'visits';

    protected $fillable = [
        'patient_id',
        'visit_date',
        'vitals',
        'diagnosis',
        'notes',
        'followup_date',
        'version',
        'is_active'
    ];

    protected $casts = [
        'vitals' => 'array', // Crucial for PostgreSQL JSONB
        'visit_date' => 'date',
        'followup_date' => 'date'
    ];

    public $timestamps = true;

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function prescriptions()
    {
        return $this->hasMany(Prescription::class);
    }

    // Connects to the local storage reports we built
    public function reportImages()
    {
        return $this->hasMany(ReportImage::class);
    }
}