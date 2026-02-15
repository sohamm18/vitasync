<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Visit;

class VisitController extends Controller
{
    // POST /api/visits
    public function store(Request $request)
    {
        // Validate to ensure Dr. Ajit doesn't save a visit without a patient
        $validated = $request->validate([
            'patient_id'    => 'required|exists:patients,id',
            'visit_date'    => 'required|date',
            'vitals'        => 'nullable|array',
            'diagnosis'     => 'nullable|string',
            'notes'         => 'nullable|string',
            'followup_date' => 'nullable|date',
        ]);

        $visit = Visit::create([
            'patient_id'    => $validated['patient_id'],
            'visit_date'    => $validated['visit_date'],
            'vitals'        => $validated['vitals'], // Laravel casts this to JSON for PostgreSQL
            'diagnosis'     => $validated['diagnosis'],
            'notes'         => $validated['notes'],
            'followup_date' => $validated['followup_date'],
            'version'       => 1
        ]);

        return response()->json($visit, 201);
    }

    // GET /api/visits/{patient_id}
    public function patientVisits($patient_id)
    {
        // Eager loading reports and prescriptions so they show up in the history tab
        return Visit::where('patient_id', $patient_id)
            ->with(['prescriptions', 'reportImages']) 
            ->orderBy('visit_date', 'desc')
            ->get();
    }
}