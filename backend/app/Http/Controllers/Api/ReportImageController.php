<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ReportImage;
use App\Models\Visit;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ReportImageController extends Controller
{
    /**
     * Store file in local folder: PatientID_Name/Date/
     */
    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'visit_id' => 'required|exists:visits,id'
        ]);

        try {
            // 1. Get Visit and Patient info for folder naming
            $visit = Visit::with('patient')->findOrFail($request->visit_id);
            $patient = $visit->patient;

            // 2. Define the path: PatientID_Name/YYYY-MM-DD
            $folderName = "{$patient->id}_" . Str::slug($patient->name);
            $dateFolder = now()->format('Y-m-d');
            $storagePath = "reports/{$folderName}/{$dateFolder}";

            // 3. Save file locally
            $file = $request->file('file');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs($storagePath, $fileName, 'public');

            // 4. Save record to PostgreSQL
            $image = ReportImage::create([
                'visit_id'  => $request->visit_id,
                'file_url'  => Storage::url($path),
                'file_type' => $file->getClientMimeType(),
                'file_path' => $path // Storing path for easier local deletion
            ]);

            return response()->json([
                'message' => 'File saved locally successfully',
                'data' => $image
            ], 201);

        } catch (\Throwable $e) {
            return response()->json(['error' => 'Local storage failed: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Delete file from Local Storage + DB
     */
    public function destroy($id)
    {
        $image = ReportImage::findOrFail($id);

        // Delete from local disk
        if (Storage::disk('public')->exists($image->file_path)) {
            Storage::disk('public')->delete($image->file_path);
        }

        $image->delete();

        return response()->json(['message' => 'File deleted from local storage']);
    }
}