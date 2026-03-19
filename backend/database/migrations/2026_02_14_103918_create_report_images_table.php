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
        Schema::create('report_images', function (Blueprint $table) {
            $table->id();
            // Links the image to a specific clinical visit
            $table->foreignId('visit_id')->constrained()->onDelete('cascade');
            // The public URL for React to display the image
            $table->string('file_url');
            // Relative path within storage/app/public for internal management
            $table->string('file_path'); 
            $table->string('file_type')->nullable(); // e.g., 'pdf', 'jpg'
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('report_images');
    }
};
