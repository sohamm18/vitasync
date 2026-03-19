<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Visit;

class Certificate extends Model
{
    protected $table = 'certificates';

    protected $fillable = [
        'visit_id',
        'type',
        'content',
        'version',
        'file_url',
        'file_path',
        'file_type',
        'file_name',
        'file_size'
    ];

    // Keep the array cast if you are sending structured JSON content from React
    protected $casts = [
        'content' => 'array'
    ];

    public $timestamps = true;

    /**
     * Relationship back to the Visit
     */
    public function visit()
    {
        return $this->belongsTo(Visit::class);
    }
}
