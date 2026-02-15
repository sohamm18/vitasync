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
        Schema::create('prescriptions', function (Blueprint $table) {
            $table->id();
            // Connects the prescription to a specific medical visit
            $table->foreignId('visit_id')->constrained()->onDelete('cascade');
            // Stores the array of medicines (Name, Dosage, Timing) as JSONB
            $table->jsonb('medicines'); 
            $table->text('instructions')->nullable();
            $table->integer('version')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prescriptions');
    }
};