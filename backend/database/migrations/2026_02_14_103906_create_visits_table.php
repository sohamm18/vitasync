<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Replace the placeholder here inside the up() method
        Schema::create('visits', function (Blueprint $table) {
            $table->id();
            // Connects this visit to a specific patient
            $table->foreignId('patient_id')->constrained()->onDelete('cascade');
            $table->date('visit_date');
            // Stores BP, Pulse, etc., as a flexible JSON object for pgAdmin 4
            $table->jsonb('vitals')->nullable(); 
            $table->text('diagnosis')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('visits');
    }
};