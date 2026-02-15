import React, { useState, useEffect } from 'react';
import { Search, User, Phone, X } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useAppContext, Patient } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

// --- MOCK DATABASE ---
const MOCK_DB: Patient[] = [
  { id: '1', name: 'Dr. Ajit Sharma', phone: '9000000001', age: '45 Yrs', gender: 'Male', weight: '75 kg', bloodGroup: 'A+' },
  { id: '10', name: 'Master Aarav Patil', phone: '9876543210', age: '8 Yrs', gender: 'Male', weight: '25 kg', bloodGroup: 'O+' },
  { id: '101', name: 'Rohan Sharma', phone: '9876543210', age: '45 Yrs', gender: 'Male', weight: '72 kg', bloodGroup: 'O+' },
  { id: '102', name: 'Ananya Gupta', phone: '9988776655', age: '28 Yrs', gender: 'Female', weight: '55 kg', bloodGroup: 'B+' },
  { id: '103', name: 'Baby Aarav', phone: '9123456789', age: '9 Months', gender: 'Male', weight: '8.1 kg', bloodGroup: 'A+' },
];

export default function GlobalPatientSearch() {
  const { activePatient, setActivePatient } = useAppContext();
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  
  // State for incremental search results
  const [filteredResults, setFilteredResults] = useState<Patient[]>([]);

  // Filter logic as the user types
  useEffect(() => {
    if (query.length > 0) {
      const results = MOCK_DB.filter(p => 
        p.id.startsWith(query) || p.phone.startsWith(query) || p.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredResults(results);
    } else {
      setFilteredResults([]);
    }
  }, [query]);

  const handleSearch = () => {
    if (!query) return;
    const found = MOCK_DB.find(p => p.id === query || p.phone === query);
    if (found) {
      selectPatient(found);
    } else {
      setError('Patient not found. Try a different ID or Phone.');
    }
  };

  // Helper to select a patient from dropdown or search
  const selectPatient = (patient: Patient) => {
    setActivePatient(patient);
    setQuery('');
    setFilteredResults([]);
    setError('');
  };

  const clearPatient = () => {
    setActivePatient(null);
    setQuery('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-6 relative">
      <AnimatePresence mode='wait'>
        {!activePatient ? (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              
              <Input 
                id="global-search-input" // 👈 ADDED: Critical for the 'Existing' button to work
                placeholder="Search Patient ID (e.g. 1) or Phone..." 
                className="pl-10 h-12 text-lg shadow-sm border-blue-100 focus:border-blue-400"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />

              {/* Incremental Search Dropdown */}
              <AnimatePresence>
                {filteredResults.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
                  >
                    {filteredResults.map((patient) => (
                      <div 
                        key={patient.id}
                        onClick={() => selectPatient(patient)}
                        className="p-4 hover:bg-blue-50 cursor-pointer flex items-center justify-between border-b last:border-0 border-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{patient.name}</p>
                            <p className="text-xs text-gray-500">#{patient.id} • {patient.phone}</p>
                          </div>
                        </div>
                        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">{patient.age}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Button onClick={handleSearch} className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-lg shadow-blue-200 shadow-lg">
              Search
            </Button>
          </motion.div>
        ) : (
          /* STATE 2: ACTIVE PATIENT BANNER - UPDATED STYLE */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            {/* 👇 CHANGED: bg-blue-600 -> bg-gray-200, text-white -> text-gray-900 */}
            <Card className="bg-gray-200 text-gray-900 border border-gray-300 shadow-sm p-4 flex items-center justify-between relative overflow-hidden">
              
              <div className="flex items-center gap-6 relative z-10">
                {/* 👇 REMOVED: The User Icon Circle div was here */}
                
                <div>
                  <h3 className="text-2xl font-bold flex items-center gap-3 text-black">
                    {activePatient.name} 
                    {/* 👇 CHANGED: badge style to match grey theme */}
                    <span className="text-sm font-semibold bg-white border border-gray-300 text-gray-600 px-3 py-0.5 rounded-full">
                      ID: {activePatient.id}
                    </span>
                  </h3>
                  
                  {/* 👇 CHANGED: text-blue-100 -> text-gray-600 */}
                  <div className="flex gap-6 text-gray-600 text-base mt-1 font-medium">
                    <span className="flex items-center gap-1"><Phone size={14} /> {activePatient.phone}</span>
                    <span className="text-gray-400">•</span>
                    <span>{activePatient.gender}, {activePatient.age}</span>
                    <span className="text-gray-400">•</span>
                    <span>{activePatient.weight}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 relative z-10">
                <Button 
                  onClick={clearPatient}
                  variant="ghost" 
                  // 👇 CHANGED: Button hover styles for light theme
                  className="text-gray-600 hover:bg-white hover:text-red-600 hover:shadow-sm border border-gray-300 transition-all font-semibold"
                >
                  Change Patient <X className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {error && !activePatient && (
        <p className="text-red-500 text-sm mt-2 ml-1 animate-pulse">{error}</p>
      )}
    </div>
  );
}