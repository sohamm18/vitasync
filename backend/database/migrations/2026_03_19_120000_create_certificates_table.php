<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('certificates')) {
            Schema::create('certificates', function (Blueprint $table) {
                $table->id();
                $table->foreignId('visit_id')->constrained()->onDelete('cascade');
                $table->string('type')->nullable();
                $table->json('content')->nullable();
                $table->integer('version')->default(1);
                $table->string('file_url')->nullable();
                $table->string('file_path')->nullable();
                $table->string('file_type')->nullable();
                $table->string('file_name')->nullable();
                $table->bigInteger('file_size')->nullable();
                $table->timestamps();
            });

            return;
        }

        Schema::table('certificates', function (Blueprint $table) {
            if (!Schema::hasColumn('certificates', 'type')) {
                $table->string('type')->nullable();
            }
            if (!Schema::hasColumn('certificates', 'content')) {
                $table->json('content')->nullable();
            }
            if (!Schema::hasColumn('certificates', 'version')) {
                $table->integer('version')->default(1);
            }
            if (!Schema::hasColumn('certificates', 'file_url')) {
                $table->string('file_url')->nullable();
            }
            if (!Schema::hasColumn('certificates', 'file_path')) {
                $table->string('file_path')->nullable();
            }
            if (!Schema::hasColumn('certificates', 'file_type')) {
                $table->string('file_type')->nullable();
            }
            if (!Schema::hasColumn('certificates', 'file_name')) {
                $table->string('file_name')->nullable();
            }
            if (!Schema::hasColumn('certificates', 'file_size')) {
                $table->bigInteger('file_size')->nullable();
            }
            if (!Schema::hasColumn('certificates', 'created_at') || !Schema::hasColumn('certificates', 'updated_at')) {
                $table->timestamps();
            }
        });
    }

    public function down(): void
    {
        if (Schema::hasTable('certificates')) {
            Schema::dropIfExists('certificates');
        }
    }
};
