import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, 
  Building2, 
  Award, 
  Receipt, 
  Syringe, 
  DollarSign,
  Search,
  User,       
  Settings,
  Info,
  LogOut,
  ChevronDown,
  UserCircle,
  X 
} from 'lucide-react';

// 👇 Relative imports
import { Card, CardContent } from './components/ui/card';
import PrescriptionContent from './PrescriptionContent';
import PharmacyContent from './PharmacyContent';
import CertificatesContent from './CertificatesContent';
import { useAppContext } from './context/AppContext';
import RegisterPatientModal from './RegisterPatientModal';

import FinanceContent from './FinanceContent';
import VaccineContent from './VaccineContent'; 
import GlobalPatientSearch from './components/GlobalPatientSearch';
import BillsContent from './BillsContent';

// Settings Modal and Patient Content
import SettingsModal from './SettingsModal';
import PatientDetailsContent from './PatientDetailsContent';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

// 1. Correct Tab Ordering: Patients (1st), Prescription (2nd)
const navigationItems: NavItem[] = [
  { id: 'patients', label: 'Patients', icon: UserCircle }, 
  { id: 'prescription', label: 'Prescription', icon: FileText },
  // { id: 'pharmacy', label: 'Pharmacy', icon: Building2 }, // Commented out
  { id: 'certificates', label: 'Certificates', icon: Award },
  { id: 'bills', label: 'Bills', icon: Receipt },
  { id: 'vaccine', label: 'Vaccine Info', icon: Syringe },
  { id: 'finance', label: 'Account(Finance)', icon: DollarSign },
];

export default function Dashboard() {
  const { doctorProfile, activePatient, setActivePatient } = useAppContext();
  
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const { activeTab, setActiveTab } = useAppContext();
  
  // --- State for Dropdown & Settings Modal ---
  const [showMenu, setShowMenu] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState('clinic');
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Helper to open specific settings tabs from the dropdown
  const openSettings = (tabName: string) => {
    setSettingsTab(tabName); 
    setIsSettingsOpen(true); 
    setShowMenu(false);      
  };

  const renderContent = () => {
    // 🛡️ SAFETY GUARD: If no patient is selected, show warning with working Registration logic
    const patientTabs = ['patients', 'prescription', 'vaccine', 'certificates', 'bills'];
    
    if (!activePatient && patientTabs.includes(activeTab)) {
      return (
        <div className="flex flex-col items-center justify-center p-20 bg-white rounded-3xl border border-green-600 mt-4">
           <Search size={48} className="text-gray-400 mb-4" />
           <h3 className="text-xl font-bold text-gray-600">No Patient Selected</h3>
           <p className="text-gray-500 mb-8 text-center max-w-sm">
             Please use the search bar above to find a patient by ID or Mobile Number before accessing this tab.
           </p>
           <div className="flex gap-4">
             <button 
               onClick={() => setIsRegModalOpen(true)} 
               className="px-8 py-3 bg-white border border-green-600 text-gray-600 rounded-xl font-bold hover:bg-green-50 transition-all"
             >
               Register New
             </button>
             <button 
               className="px-8 py-3 bg-white border border-green-600 text-gray-600 rounded-xl font-bold hover:bg-green-50 transition-all"
               onClick={() => document.getElementById('global-search-input')?.focus()}
             >
               Existing
             </button>
           </div>
        </div>
      );
    }

    // Main Switch Logic for Tabs
    switch (activeTab) {
      case 'patients':
        return <PatientDetailsContent />;
      case 'prescription':
        return <PrescriptionContent />;
      case 'pharmacy':
        return <PharmacyContent />;
      case 'certificates':
        return <CertificatesContent />;
      case 'bills':
        return <BillsContent />;
      case 'vaccine':
        return <VaccineContent />; 
      case 'finance':
        return <FinanceContent />;
      default:
        return <PatientDetailsContent />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#f8fafc]">
      {/* --- Top Navigation Bar --- */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
        <div className="px-8 py-4">
          
          <div className="flex items-center justify-between mb-6">
            {/* Left: Branding */}
            <div className="flex items-center gap-4">
              <div className="w-[72px] h-[72px] flex items-center justify-center">
                <img src="/gpt vita 1.png" alt="Vitasync Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight italic">Vitasync</h1>
                <p className="text-xs text-gray-600 font-medium">Healthcare Management System</p>
              </div>
            </div>

            {/* Right: User Menu Profile Dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-gray-100 hover:border-[#3eb489] transition-all cursor-pointer shadow-sm active:scale-95"
              >
                <div className="w-8 h-8 bg-[#eaf7f4] rounded-full flex items-center justify-center border border-[#3eb489]">
                  <User className="w-4 h-4 text-[#3eb489]" />
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-sm font-bold text-gray-900 leading-none">
                    {doctorProfile?.firstName} {doctorProfile?.lastName}
                  </p>
                  <p className="text-[10px] text-gray-500 font-bold tracking-wide mt-0.5">
                    {doctorProfile?.designation || 'BAMS'}
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {/* Dropdown Content */}
              {showMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-200">
                   <div className="px-4 py-3 bg-[#eaf7f4] border-b border-[#3eb489]/10">
                      <p className="text-xs font-bold text-[#3eb489] uppercase">Signed in as</p>
                      <p className="text-xs text-gray-600 truncate">{doctorProfile?.email}</p>
                   </div>
                   
                   <button onClick={() => openSettings('profile')} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3eb489] flex items-center gap-2">
                      <User size={16} /> My Profile
                   </button>
                   <button onClick={() => openSettings('clinic')} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3eb489] flex items-center gap-2">
                      <Settings size={16} /> Settings
                   </button>
                   <button onClick={() => openSettings('about')} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3eb489] flex items-center gap-2">
                      <Info size={16} /> About
                   </button>
                   
                   <div className="border-t border-gray-100 my-1"></div>
                   
                   <button onClick={() => window.location.reload()} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium">
                      <LogOut size={16} /> Logout
                   </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Main Navigation Tabs */}
          <nav className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 whitespace-nowrap text-sm font-medium border ${
                    isActive
                      ? 'bg-white text-gray-900 border-[#31906E] shadow-md'
                      : 'bg-white text-gray-600 border-transparent hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#31906E]' : 'text-gray-500'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* --- Main Content Section --- */}
      <main className="flex-1 overflow-auto bg-[#f8fafc]">
        <div className="p-8 max-w-[1600px] mx-auto">
          
          {/* 👇 Global Patient Card (Fixed Styling) 👇 */}
          {!activePatient ? (
            <GlobalPatientSearch /> 
          ) : (
            <div className="bg-white border border-green-600 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm relative">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-gray-600">{activePatient.name}</h2>
                <span className="bg-white border border-green-600 text-gray-600 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                  ID: {activePatient.id}
                </span>
              </div>
              <p className="text-gray-500 font-medium mt-2 flex items-center justify-center gap-3">
                <span>{activePatient.phone || 'N/A'}</span>
                <span className="text-gray-300">•</span>
                <span>{activePatient.gender || 'Male'}, {activePatient.age || '--'}</span>
                <span className="text-gray-300">•</span>
                <span>{activePatient.weight || '--'}</span>
              </p>
              <button 
                className="mt-4 px-4 py-2 bg-white border border-green-600 text-gray-600 rounded-lg hover:bg-green-50 font-bold flex items-center transition-all active:scale-[0.99]"
                onClick={() => setActivePatient(null)}
              >
                Change Patient <X className="ml-2 h-4 w-4" />
              </button>
            </div>
          )}

          <div className="mt-8">
            {renderContent()}
          </div>
        </div>
      </main>

      {/* --- Global Modals --- */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        defaultTab={settingsTab} 
      />

      <RegisterPatientModal 
        isOpen={isRegModalOpen} 
        onClose={() => setIsRegModalOpen(false)} 
        onRegister={(newPatient) => {
          setActivePatient(newPatient); // Logic to select newly created patient
        }}
      />
    </div>
  );
}