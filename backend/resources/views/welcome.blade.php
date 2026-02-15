<body class="bg-gray-50 flex items-center justify-center min-h-screen">
    <div class="text-center">
        <h1 class="text-4xl font-bold text-blue-600 mb-4">Vitasync</h1>
        <p class="text-gray-600 mb-8">Clinical Management System for Dr. Ajit</p>
        
        @if (Route::has('login'))
            <div class="space-x-4">
                @auth
                    <a href="{{ url('/dashboard') }}" class="bg-blue-600 text-white px-6 py-2 rounded-lg shadow">Go to Dashboard</a>
                @else
                    <a href="{{ route('login') }}" class="bg-blue-600 text-white px-6 py-2 rounded-lg shadow">Log in to Clinic</a>
                @endauth
            </div>
        @endif
    </div>
</body>