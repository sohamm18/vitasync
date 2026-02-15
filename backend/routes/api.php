<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PatientController;
use App\Http\Controllers\Api\VisitController;
use App\Http\Controllers\Api\PrescriptionController;
use App\Http\Controllers\Api\CertificateController;
use App\Http\Controllers\Api\ReportImageController;

// ✅ Reports (Images)
// Standard RESTful naming: POST to create, DELETE to remove
Route::post('/report-images', [ReportImageController::class, 'store']);
Route::delete('/report-images/{id}', [ReportImageController::class, 'destroy']);

// ✅ Certificates
Route::post('/certificates', [CertificateController::class, 'store']);
Route::get('/certificates/visit/{id}', [CertificateController::class, 'visitCertificates']);

// ✅ Prescriptions
Route::post('/prescriptions', [PrescriptionController::class, 'store']);
Route::get('/prescriptions/visit/{id}', [PrescriptionController::class, 'visitPrescriptions']);

// ✅ Visits
Route::post('/visits', [VisitController::class, 'store']);
Route::get('/visits/patient/{id}', [VisitController::class, 'patientVisits']);

// ✅ Patients
Route::get('/patients', [PatientController::class, 'index']);
Route::post('/patients', [PatientController::class, 'store']);
Route::get('/patients/{id}', [PatientController::class, 'show']);

