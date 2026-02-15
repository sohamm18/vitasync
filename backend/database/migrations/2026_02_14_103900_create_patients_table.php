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
        // Add your detailed schema here inside the up() method
        Schema::create('patients', function (Blueprint $table) {
            $table->id(); 
            $table->string('name'); // Stores names like "Master Aarav Patil"
            $table->string('phone')->unique(); // Used for search in Dashboard.tsx
            $table->string('age');
            $table->string('gender');
            $table->string('weight')->nullable();
            $table->string('bloodGroup')->nullable();
            $table->date('lastVisit')->nullable();
            $table->text('address')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};