<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Certificate;
use App\Models\Visit;

class CertificateController extends Controller
{
    // POST /api/certificates
    public function store(Request $request)
    {
        // Validate incoming data
        $validated = $request->validate([
            'visit_id' => 'required|exists:visits,id',
            'type'     => 'required|string',
            'content'  => 'required', // Can be string or array based on your Model cast
            'version'  => 'nullable|integer'
        ]);

        $cert = Certificate::create([
            'visit_id' => $validated['visit_id'],
            'type'     => $validated['type'],
            'content'  => $validated['content'],
            'version'  => $validated['version'] ?? 1
        ]);

        // Logic for local folder structure (PatientID_Name/Date)
        // This uses the Storage facade for the local disk instead of Cloudinary
        // $visit = Visit::with('patient')->find($request->visit_id);
        // $folderPath = "certificates/{$visit->patient->id}_{$visit->patient->name}/" . now()->format('Y-m-d');

        return response()->json($cert, 201);
    }

    // GET /api/certificates/visit/{id}
    public function visitCertificates($id)
    {
        return Certificate::where('visit_id', $id)
            ->orderBy('created_at', 'desc')
            ->get();
    }
}