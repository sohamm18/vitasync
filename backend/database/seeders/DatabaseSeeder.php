<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Patient;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Dr. Ajit's Login
        User::create([
            'id' => 1,
            'name' => 'Ajit V',
            'email' => 'ajit@vitasync.com',
            'password' => Hash::make('saisamarth@123'),
        ]);

        // 2. Create Mock Patients with specific IDs for the demo
        Patient::create([
            'id' => 1, // 👈 Explicit ID for Master Aarav
            'name' => 'Master Aarav Patil',
            'phone' => '9822012345',
            'age' => '6 Weeks',
            'gender' => 'male',
            'weight' => '4.5 kg',
            'bloodGroup' => 'O+',
            'lastVisit' => now()->subDays(10),
            'address' => 'Nashik, Maharashtra',
        ]);

        Patient::create([
            'id' => 2, // 👈 Explicit ID for Mrs. Sunita
            'name' => 'Mrs. Sunita Deshmukh',
            'phone' => '9422055667',
            'age' => '45 Yrs',
            'gender' => 'female',
            'weight' => '62 kg',
            'bloodGroup' => 'B+',
            'lastVisit' => now()->subMonths(1),
            'address' => 'Nashik, Maharashtra',
        ]);

        Patient::create([
            'id' => 3, // 👈 Explicit ID for Mr. Ramesh
            'name' => 'Mr. Ramesh Vispute',
            'phone' => '9623288990',
            'age' => '68 Yrs',
            'gender' => 'male',
            'weight' => '70 kg',
            'bloodGroup' => 'A+',
            'lastVisit' => now()->subDays(4),
            'address' => 'Nashik, Maharashtra',
        ]);
    }
}