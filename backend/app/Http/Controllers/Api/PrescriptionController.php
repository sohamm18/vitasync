<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Prescription;

class PrescriptionController extends Controller
{
    // POST /api/prescriptions
    public function store(Request $request)
    {
        // 🛡️ Validate that the visit exists before saving
        $validated = $request->validate([
            'visit_id' => 'required|exists:visits,id',
            'medicines' => 'required|array', // Matches our React state
            'instructions' => 'nullable|string',
            'language' => 'nullable|string',
            'version' => 'nullable|integer'
        ]);

        $rx = Prescription::create([
            'visit_id'     => $validated['visit_id'],
            'medicines'    => $validated['medicines'], // Laravel casts this to JSON for PostgreSQL
            'instructions' => $validated['instructions'],
            'language'     => $validated['language'] ?? 'en',
            'version'      => $validated['version'] ?? 1
        ]);

        return response()->json($rx, 201);
    }

    // GET /api/prescriptions/{visit_id}
    public function visitPrescriptions($visit_id)
    {
        // Sort by latest version first for the demo
        return Prescription::where('visit_id', $visit_id)
                           ->orderBy('version', 'desc')
                           ->get();
    }
}