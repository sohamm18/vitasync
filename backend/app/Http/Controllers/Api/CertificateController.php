<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Certificate;
use App\Models\Visit;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

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

    // POST /api/certificates/upload-pdf
    public function uploadPdf(Request $request)
    {
        $validated = $request->validate([
            'file' => 'required|file|mimes:pdf|max:10240',
            'visit_id' => 'required|exists:visits,id',
            'certificate_id' => 'nullable|exists:certificates,id',
            'type' => 'nullable|string',
            'content' => 'nullable',
            'version' => 'nullable|integer'
        ]);

        $visit = Visit::with('patient')->findOrFail($validated['visit_id']);
        $patient = $visit->patient;

        $folderName = "{$patient->id}_" . Str::slug($patient->name);
        $dateFolder = now()->format('Y-m-d');
        $storagePath = "certificates/{$folderName}/{$dateFolder}";

        $file = $request->file('file');
        $fileName = time() . '_' . $file->getClientOriginalName();
        $path = $file->storeAs($storagePath, $fileName, 'public');

        $payload = [
            'visit_id' => $validated['visit_id'],
            'type' => $validated['type'] ?? 'pdf',
            'content' => $validated['content'] ?? null,
            'version' => $validated['version'] ?? 1,
            'file_url' => Storage::url($path),
            'file_path' => $path,
            'file_type' => $file->getClientMimeType(),
            'file_name' => $file->getClientOriginalName(),
            'file_size' => $file->getSize()
        ];

        if (!empty($validated['certificate_id'])) {
            $cert = Certificate::findOrFail($validated['certificate_id']);
            $cert->update($payload);
        } else {
            $cert = Certificate::create($payload);
        }

        return response()->json([
            'message' => 'Certificate PDF saved locally successfully',
            'data' => $cert
        ], 201);
    }

    // GET /api/certificates/visit/{id}
    public function visitCertificates($id)
    {
        return Certificate::where('visit_id', $id)
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
