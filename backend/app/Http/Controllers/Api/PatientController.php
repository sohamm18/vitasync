<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Patient;

class PatientController extends Controller
{
    /**
     * GET /api/patients
     * Handles the Global Search bar logic for ID or Phone.
     */
    public function index(Request $request)
    {
        $search = $request->query('query');
        
        $patients = Patient::query();

        if ($search) {
            // PostgreSQL specific: cast ID to text for partial matching with ILIKE
            $patients->whereRaw("id::text ILIKE ?", ["%$search%"])
                     ->orWhere('phone', 'ILIKE', "%$search%");
        }

        return $patients->with('visits')
                        ->orderBy('id', 'desc')
                        ->get();
    }

    /**
     * POST /api/patients
     * Saves new patients with full medical details.
     */
    public function store(Request $request)
    {
        // Validating the fields used in our React Frontend
        $validatedData = $request->validate([
            'name'       => 'required|string|max:255',
            'age'        => 'required|string',
            'gender'     => 'required|string',
            'phone'      => 'required|string|unique:patients,phone',
            'address'    => 'nullable|string',
            'weight'     => 'nullable|string',
            'bloodGroup' => 'nullable|string',
        ]);

        $patient = Patient::create($validatedData);

        return response()->json($patient, 201);
    }

    /**
     * GET /api/patients/{id}
     * Retrieves full history including prescriptions and reports.
     */
    public function show($id)
    {
        // Eager load everything needed for the Prescription and Vaccine tabs
        return Patient::with(['visits.prescriptions', 'visits.reportImages'])
                      ->findOrFail($id);
    }
}