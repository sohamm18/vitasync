import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Syringe, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp,
  Baby,
  Plus,
  Save,
  X,
  Search,
  History,
  Calendar
} from 'lucide-react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Card } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { useAppContext } from './context/AppContext';
// At the top of Dashboard.tsx, BillsContent.tsx, etc.
import { patientService } from '../services/api';

// 👇 1. ADDED INTERFACES TO SOLVE THE TYPE ERROR
interface VaccineShot {
  id: number;
  name: string;
  status: string;
  date: string | null;
  type?: string;        // Optional for single/oral shots
  dose?: string;        // Optional for multi-dose
  totalDoses?: number;  // Optional for multi-dose
  isCustom?: boolean;
}

interface VaccineGroup {
  id: string;
  age: string;
  isExpanded: boolean;
  shots: VaccineShot[];
}

// --- STANDARD VACCINATION SCHEDULE ---
// 👇 2. APPLIED THE INTERFACE TO THE DATA
const INITIAL_VACCINES: VaccineGroup[] = [
  { 
    id: 'birth', 
    age: 'At Birth', 
    isExpanded: true,
    shots: [
      { id: 1, name: 'BCG', type: 'Single', status: 'Completed', date: '2025-10-20' },
      { id: 2, name: 'OPV Zero', type: 'Oral', status: 'Completed', date: '2025-10-20' },
      { id: 3, name: 'Hep B (Birth)', type: 'Inj', status: 'Completed', date: '2025-10-20' },
    ]
  },
  { 
    id: '6weeks', 
    age: '6 Weeks', 
    isExpanded: true,
    shots: [
      { id: 4, name: 'DTwP / DTaP', dose: '1', totalDoses: 3, status: 'Pending', date: null },
      { id: 5, name: 'IPV', dose: '1', totalDoses: 3, status: 'Pending', date: null },
      { id: 6, name: 'Hep B', dose: '2', totalDoses: 3, status: 'Pending', date: null },
      { id: 7, name: 'Hib', dose: '1', totalDoses: 3, status: 'Pending', date: null },
      { id: 8, name: 'Rotavirus', dose: '1', totalDoses: 3, status: 'Pending', date: null },
      { id: 9, name: 'PCV', dose: '1', totalDoses: 3, status: 'Pending', date: null },
    ]
  },
  { 
    id: '10weeks', 
    age: '10 Weeks', 
    isExpanded: false,
    shots: [
      { id: 10, name: 'DTwP / DTaP', dose: '2', totalDoses: 3, status: 'Upcoming', date: null },
      { id: 11, name: 'IPV', dose: '2', totalDoses: 3, status: 'Upcoming', date: null },
      { id: 12, name: 'Hib', dose: '2', totalDoses: 3, status: 'Upcoming', date: null },
      { id: 13, name: 'Rotavirus', dose: '2', totalDoses: 3, status: 'Upcoming', date: null },
      { id: 14, name: 'PCV', dose: '2', totalDoses: 3, status: 'Upcoming', date: null },
    ]
  },
  { 
    id: '14weeks', 
    age: '14 Weeks', 
    isExpanded: false,
    shots: [
      { id: 15, name: 'DTwP / DTaP', dose: '3', totalDoses: 3, status: 'Upcoming', date: null },
      { id: 16, name: 'IPV', dose: '3', totalDoses: 3, status: 'Upcoming', date: null },
      { id: 17, name: 'Hib', dose: '3', totalDoses: 3, status: 'Upcoming', date: null },
      { id: 18, name: 'Rotavirus', dose: '3', totalDoses: 3, status: 'Upcoming', date: null },
      { id: 19, name: 'PCV', dose: '3', totalDoses: 3, status: 'Upcoming', date: null },
    ]
  },
  { 
    id: '6months', 
    age: '6 Months', 
    isExpanded: false,
    shots: [
      { id: 20, name: 'OPV', dose: '1', totalDoses: 2, status: 'Upcoming', date: null },
      { id: 21, name: 'Hep B', dose: '3', totalDoses: 3, status: 'Upcoming', date: null },
    ]
  },
  { 
    id: '9months', 
    age: '9 Months', 
    isExpanded: false,
    shots: [
      { id: 22, name: 'MMR', dose: '1', totalDoses: 2, status: 'Upcoming', date: null },
    ]
  }
];

export default function VaccineContent() {
  const { activePatient } = useAppContext();
  // 👇 3. EXPLICITLY TYPED THE STATE HOOK
  const [schedule, setSchedule] = useState<VaccineGroup[]>(INITIAL_VACCINES);

  const [addingToGroup, setAddingToGroup] = useState<string | null>(null);
  const [newVacName, setNewVacName] = useState('');
  const [newVacType, setNewVacType] = useState('');

  const toggleGroupExpand = (groupId: string) => {
    setSchedule(prev => prev.map(group => 
      group.id === groupId ? { ...group, isExpanded: !group.isExpanded } : group
    ));
  };

  const markAsDone = (groupId: string, shotId: number) => {
    const today = new Date().toISOString().split('T')[0];
    setSchedule(prev => prev.map(group => {
      if (group.id !== groupId) return group;
      return {
        ...group,
        shots: group.shots.map(shot => 
          shot.id === shotId ? { ...shot, status: 'Completed', date: today } : shot
        )
      };
    }));
  };

  const markAsPending = (groupId: string, shotId: number) => {
    setSchedule(prev => prev.map(group => {
      if (group.id !== groupId) return group;
      return {
        ...group,
        shots: group.shots.map(shot => 
          shot.id === shotId ? { ...shot, status: 'Pending', date: null } : shot
        )
      };
    }));
  };

  const saveCustomVaccine = (groupId: string) => {
    if (!newVacName.trim()) return;

    setSchedule(prev => prev.map(group => {
      if (group.id !== groupId) return group;

      const newShot: VaccineShot = {
        id: Date.now(),
        name: newVacName,
        type: newVacType || 'Custom',
        status: 'Pending',
        date: null,
        isCustom: true
      };

      return {
        ...group,
        shots: [...group.shots, newShot]
      };
    }));

    setAddingToGroup(null);
    setNewVacName('');
    setNewVacType('');
  };

  const getGroupProgress = (shots: VaccineShot[]) => {
    if (shots.length === 0) return 0;
    const completed = shots.filter(s => s.status === 'Completed').length;
    return Math.round((completed / shots.length) * 100);
  };

  if (!activePatient) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border-2 border-dashed border-gray-200 max-w-4xl mx-auto mt-10">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
          <Search className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">No Patient Selected</h3>
        <p className="text-gray-500 mb-6 text-center">Please search for a patient at the top to view their immunization schedule.</p>
        <Button variant="outline" onClick={() => document.getElementById('global-search-input')?.focus()}>
          Go to Search
        </Button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-2xl">
            <Baby className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Vaccination Schedule</h2>
            <p className="text-gray-500">Tracking records for <span className="font-bold text-blue-600">{activePatient.name}</span></p>
          </div>
        </div>

        <div className="flex gap-3">
          <Card className="p-3 flex items-center gap-3 bg-white border-none shadow-sm">
            <div className={`p-2 rounded-lg ${activePatient.lastVisit ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
              {activePatient.lastVisit ? <History size={16} /> : <CheckCircle2 size={16} />}
            </div>
            <div className="text-left">
              <p className="text-[10px] font-bold text-gray-400 uppercase">Visit</p>
              <p className="text-xs font-bold">{activePatient.lastVisit ? 'Follow-up' : 'First Visit'}</p>
            </div>
          </Card>
          <Card className="p-3 flex items-center gap-3 bg-white border-none shadow-sm">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Calendar size={16} /></div>
            <div className="text-left">
              <p className="text-[10px] font-bold text-gray-400 uppercase">Last Visited</p>
              <p className="text-xs font-bold">{activePatient.lastVisit?.toString() || 'No History'}</p>
            </div>
          </Card>
        </div>
      </div>

      <div className="relative border-l-2 border-blue-100 ml-4 space-y-8">
        {schedule.map((group, index) => {
          const progress = getGroupProgress(group.shots);
          const isFullyComplete = progress === 100 && group.shots.length > 0;
          const isNextDue = !isFullyComplete && progress < 100 && (index === 0 || getGroupProgress(schedule[index-1].shots) === 100);

          return (
            <div key={group.id} className="relative pl-8">
              <div 
                className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 transition-colors duration-300 z-10 
                  ${isFullyComplete ? 'bg-green-500 border-green-500' : 
                    isNextDue ? 'bg-white border-blue-500 animate-pulse' : 'bg-gray-100 border-gray-300'}`}
              />

              <Card className={`overflow-hidden transition-all duration-300 border-none shadow-sm 
                ${isNextDue ? 'ring-2 ring-blue-500/20 shadow-lg' : 'hover:shadow-md'}`}>
                
                <div 
                  onClick={() => toggleGroupExpand(group.id)}
                  className="bg-white p-4 flex items-center justify-between cursor-pointer border-b border-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <h3 className={`font-bold text-lg ${isFullyComplete ? 'text-green-700' : 'text-gray-900'}`}>
                      {group.age}
                    </h3>
                    {!group.isExpanded && (
                      <div className="flex gap-1">
                        {isFullyComplete ? (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                            All Done <CheckCircle2 className="w-3 h-3 ml-1" />
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-500 font-normal">
                            {progress}% Complete
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {!group.isExpanded && (
                       <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                         <div className="h-full bg-green-500" style={{ width: `${progress}%` }} />
                       </div>
                    )}
                    {group.isExpanded ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                  </div>
                </div>

                <AnimatePresence>
                  {group.isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-gray-50/50"
                    >
                      <div className="p-4 space-y-3">
                        {group.shots.map((shot) => (
                          <div 
                            key={shot.id} 
                            className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100 shadow-sm"
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                                ${shot.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-blue-500'}`}>
                                <Syringe className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{shot.name}</p>
                                <p className="text-xs text-gray-500">
                                  {shot.dose ? `Dose ${shot.dose} of ${shot.totalDoses}` : shot.type}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              {shot.status === 'Completed' ? (
                                <div className="text-right">
                                  <div className="flex items-center text-green-600 font-medium text-sm gap-1">
                                    <CheckCircle2 className="w-4 h-4" /> Given
                                  </div>
                                  <p className="text-xs text-gray-400">{shot.date}</p>
                                </div>
                              ) : (
                                <Button 
                                  size="sm" 
                                  onClick={(e) => { e.stopPropagation(); markAsDone(group.id, shot.id); }}
                                  className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-semibold h-9"
                                >
                                  Mark Done
                                </Button>
                              )}
                              {shot.status === 'Completed' && (
                                <button 
                                  onClick={(e) => { e.stopPropagation(); markAsPending(group.id, shot.id); }}
                                  className="text-xs text-gray-400 hover:text-red-500 underline"
                                >
                                  Undo
                                </button>
                              )}
                            </div>
                          </div>
                        ))}

                        {addingToGroup === group.id ? (
                          <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 mt-2"
                          >
                            <h4 className="text-sm font-semibold text-blue-800 mb-3">Add Custom Vaccine</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                              <Input 
                                placeholder="Vaccine Name (e.g. Flu Shot)" 
                                value={newVacName}
                                onChange={(e) => setNewVacName(e.target.value)}
                                className="bg-white"
                                autoFocus
                              />
                              <Input 
                                placeholder="Dose/Type (e.g. Annual)" 
                                value={newVacType}
                                onChange={(e) => setNewVacType(e.target.value)}
                                className="bg-white"
                              />
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="ghost" onClick={() => setAddingToGroup(null)}>Cancel</Button>
                              <Button size="sm" onClick={() => saveCustomVaccine(group.id)} className="bg-blue-600"><Save className="w-4 h-4 mr-1" /> Save Vaccine</Button>
                            </div>
                          </motion.div>
                        ) : (
                          <button
                            onClick={(e) => { e.stopPropagation(); setAddingToGroup(group.id); setNewVacName(''); setNewVacType(''); }}
                            className="w-full py-2 mt-2 flex items-center justify-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg border border-dashed border-gray-300 transition-all"
                          >
                            <Plus className="w-4 h-4" /> Add Other Vaccine
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}