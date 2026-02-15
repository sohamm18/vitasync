<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReportImage extends Model
{
    protected $table = 'report_images';

    protected $fillable = [
        'visit_id',
        'file_url',  // For frontend display
        'file_path', // For backend management (deleting/moving)
        'file_type'
    ];

    public $timestamps = true;

    public function visit()
    {
        return $this->belongsTo(Visit::class);
    }
}