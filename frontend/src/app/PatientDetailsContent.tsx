import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent 
} from './components/ui/card';
import { 
  Input 
} from './components/ui/input';
import { 
  Label 
} from './components/ui/label';
import { 
  Textarea 
} from './components/ui/textarea';
import { 
  UserPlus, 
  RefreshCcw, 
  Activity, 
  ChevronDown, 
  ChevronUp, 
  Save,
  CheckCircle2
} from 'lucide-react';
import { useAppContext } from './context/AppContext';

// --- Interfaces for Type Safety ---

interface VisitStats {
  weight: string;
  bpSys: string;
  bpDia: string;
}

export default function PatientDetailsContent() {
  // 1. Consumption of Global App Context for persistence
  const { 
    activePatient, 
    setPrescriptionData, 
    clinicalFormData, 
    setClinicalFormData, 
    setActiveTab 
  } = useAppContext();

  // 2. State Management
  const [visitType, setVisitType] = useState<'new' | 'followup'>('new');

  // 3. Persistent Form Initialization
  const initialFormData = clinicalFormData || {
    complaints: '',
    gender: 'Male',
    age: '',
    weight: '',
    height: '',
    bpSys: '',
    bpDia: '',
    spo2: '',
    hr: '',
    temp: '',
    rr: '',
    lmp: '',
    bsl: '',
    cns: '-',
    rs: '-',
    pa: '-'
  };

  const [formData, setFormData] = useState(initialFormData);

  // 4. Ranked Accordion Logic State Management
  const [openSections, setOpenSections] = useState({
    stats: visitType === 'new' || !!clinicalFormData,
    vitals: !!clinicalFormData,
    complaints: !!clinicalFormData,
    systemic: !!clinicalFormData
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleVisitToggle = (type: 'new' | 'followup') => {
    setVisitType(type);
    
    if (type === 'new') {
      const freshData = { 
        complaints: '', gender: 'Male', age: '', weight: '', 
        height: '', bpSys: '', bpDia: '', spo2: '', hr: '', temp: '', 
        rr: '', lmp: '', bsl: '', cns: '-', rs: '-', pa: '-' 
      };
      setFormData(freshData);
      setClinicalFormData(freshData);
      setOpenSections({ stats: true, vitals: false, complaints: false, systemic: false });
    } else if (type === 'followup' && activePatient?.lastVisit && typeof activePatient.lastVisit === 'object') {
      const mergedHistory = { ...formData, ...activePatient.lastVisit };
      setFormData(mergedHistory);
      setClinicalFormData(mergedHistory);
      setOpenSections({ stats: false, vitals: false, complaints: false, systemic: false });
    }
  };

  const handleChange = (field: string, value: string) => {
    const updatedForm = { ...formData, [field]: value };
    setFormData(updatedForm);
    if (setClinicalFormData) {
      setClinicalFormData(updatedForm);
    }
  };

  const handleSaveAndProceed = () => {
    const printableData = getPrintableData(formData);
    
    setPrescriptionData(printableData);
    setActiveTab('prescription'); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPrevData = (): VisitStats => {
    const lastVisit = activePatient?.lastVisit;
    if (lastVisit && typeof lastVisit === 'object' && 'weight' in lastVisit) {
      return lastVisit as unknown as VisitStats;
    }
    return { weight: "-", bpSys: "-", bpDia: "-" };
  };

  const prevData = getPrevData();

  // --- Theme Configurations ---
  const inputStyle = "bg-white border border-green-600 focus-visible:ring-1 focus-visible:ring-green-600 focus-visible:ring-offset-0 focus:outline-none placeholder:text-gray-300 text-gray-600 transition-all duration-200";
  const labelStyle = "text-gray-600 font-bold text-sm mb-1 block";
  const headerStyle = "text-gray-600 font-bold text-sm uppercase tracking-wider select-none";
  const sectionHeader = "flex items-center justify-between w-full p-5 bg-white border-b border-gray-200 cursor-pointer hover:bg-green-50 transition-colors select-none";

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-10">
      
      {/* 1. COMPONENT HEADER & VISIT TOGGLE */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-600 italic leading-tight">Clinical Parameters</h2>
          <p className="text-sm text-gray-400 font-medium mt-1"> Findings for the Patient</p>
        </div>

        <div className="flex bg-white p-1 rounded-xl border border-green-600 shadow-sm overflow-hidden">
          <button 
            onClick={() => handleVisitToggle('new')} 
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
              visitType === 'new' ? 'bg-[#3eb489] text-white shadow-md' : 'text-gray-500 hover:bg-green-50'
            }`}
          >
            <UserPlus size={16} /> New Visit
          </button>
          <button 
            onClick={() => handleVisitToggle('followup')} 
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
              visitType === 'followup' ? 'bg-[#3eb489] text-white shadow-md' : 'text-gray-500 hover:bg-green-50'
            }`}
          >
            <RefreshCcw size={16} /> Follow-up
          </button>
        </div>
      </div>

      {/* 2. RANKED ACCORDION FORM CONTAINER */}
      <Card className="border-green-600 shadow-sm overflow-hidden bg-white border-t-0">
        <CardContent className="p-0">
          
          {/* RANK 1: PATIENT BASIC STATS (Auto-open for new patient) */}
          <div onClick={() => toggleSection('stats')} className={sectionHeader}>
            <h3 className={headerStyle}>1. Patient Basic Stats</h3>
            {openSections.stats ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
          </div>
          {openSections.stats && (
            <div className="p-8 grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-gray-100 animate-in slide-in-from-top-2 duration-300">
              <div className="space-y-1">
                <Label className={labelStyle}>Gender</Label>
                <select 
                  value={formData.gender} 
                  onChange={e => handleChange('gender', e.target.value)} 
                  className={`flex h-10 w-full rounded-md px-3 py-1 text-sm shadow-sm ${inputStyle}`}
                >
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label className={labelStyle}>Age (Years)</Label>
                <Input type="number" value={formData.age} onChange={e => handleChange('age', e.target.value)} placeholder="-" className={inputStyle} />
              </div>
              <div className="space-y-1">
                <Label className={labelStyle}>Weight (kg)</Label>
                <div className="flex items-center gap-2">
                  {visitType === 'followup' && (
                    <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded border border-green-200">
                      <span className="text-[9px] font-black text-gray-400 uppercase">Past</span>
                      <span className="text-xs font-bold text-gray-600">{prevData.weight}</span>
                    </div>
                  )}
                  <Input type="number" value={formData.weight} onChange={e => handleChange('weight', e.target.value)} placeholder="-" className={inputStyle} />
                </div>
              </div>
              <div className="space-y-1">
                <Label className={labelStyle}>Height (cm)</Label>
                <Input type="number" value={formData.height} onChange={e => handleChange('height', e.target.value)} placeholder="-" className={inputStyle} />
              </div>
            </div>
          )}

          {/* RANK 2: VITALS & DIAGNOSTIC TESTS */}
          <div onClick={() => toggleSection('vitals')} className={sectionHeader}>
            <h3 className={headerStyle}>2. Vitals & Diagnostic Tests</h3>
            {openSections.vitals ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
          </div>
          {openSections.vitals && (
            <div className="p-8 grid grid-cols-2 md:grid-cols-5 gap-6 border-b border-gray-100 animate-in slide-in-from-top-2 duration-300">
              <div className="col-span-1">
                <Label className={labelStyle}>Blood Pressure (mmHg)</Label>
                <div className="flex gap-2">
                  <Input placeholder="Sys" value={formData.bpSys} onChange={e => handleChange('bpSys', e.target.value)} className={inputStyle} />
                  <Input placeholder="Dia" value={formData.bpDia} onChange={e => handleChange('bpDia', e.target.value)} className={inputStyle} />
                </div>
              </div>
              <div className="space-y-1"><Label className={labelStyle}>SpO2 (%)</Label><Input type="number" value={formData.spo2} onChange={e => handleChange('spo2', e.target.value)} placeholder="-" className={inputStyle} /></div>
              <div className="space-y-1"><Label className={labelStyle}>HR (/min)</Label><Input type="number" value={formData.hr} onChange={e => handleChange('hr', e.target.value)} placeholder="-" className={inputStyle} /></div>
              <div className="space-y-1"><Label className={labelStyle}>Temp (°F)</Label><Input type="number" value={formData.temp} onChange={e => handleChange('temp', e.target.value)} placeholder="-" className={inputStyle} /></div>
              <div className="space-y-1"><Label className={labelStyle}>BSL (mg/dl)</Label><Input type="number" value={formData.bsl} onChange={e => handleChange('bsl', e.target.value)} placeholder="-" className={inputStyle} /></div>
            </div>
          )}

          {/* RANK 3: SYSTEMIC EXAMINATION (Provisional Diagnosis Removed) */}
          <div onClick={() => toggleSection('systemic')} className={sectionHeader}>
            <h3 className={headerStyle}>3. Examination (CNS, RS, P/A)</h3>
            {openSections.systemic ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
          </div>
          {openSections.systemic && (
            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-gray-100 animate-in slide-in-from-top-2 duration-300">
              <div className="space-y-2"><Label className={labelStyle}>CNS Findings</Label><Textarea value={formData.cns} onChange={e => handleChange('cns', e.target.value)} className={`min-h-[100px] ${inputStyle}`} /></div>
              <div className="space-y-2"><Label className={labelStyle}>RS Findings</Label><Textarea value={formData.rs} onChange={e => handleChange('rs', e.target.value)} className={`min-h-[100px] ${inputStyle}`} /></div>
              <div className="space-y-2"><Label className={labelStyle}>P/A Findings</Label><Textarea value={formData.pa} onChange={e => handleChange('pa', e.target.value)} className={`min-h-[100px] ${inputStyle}`} /></div>
            </div>
          )}

          {/* RANK 4: CAUSE OF VISIT / COMPLAINTS */}
          <div onClick={() => toggleSection('complaints')} className={sectionHeader}>
            <h3 className={headerStyle}>4. Cause of Visit / Complaints</h3>
            <div className="flex items-center gap-4">
              {formData.complaints && <CheckCircle2 size={16} className="text-[#3eb489]" />}
              {openSections.complaints ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
            </div>
          </div>
          {openSections.complaints && (
            <div className="p-8 border-b border-gray-100 animate-in slide-in-from-top-2 duration-300">
              <Textarea 
                value={formData.complaints} 
                onChange={e => handleChange('complaints', e.target.value)} 
                placeholder="Describe symptoms..." 
                className={`min-h-[120px] text-base ${inputStyle}`} 
              />
            </div>
          )}

        </CardContent>
      </Card>

      {/* 3. FINAL ACTION BUTTON: SAVE & PROCEED TO NEXT TAB */}
      <div className="flex justify-end pt-6">
        <button 
          onClick={handleSaveAndProceed} 
          className="flex items-center bg-white border border-green-600 text-gray-600 hover:bg-green-50 px-6 py-2 rounded-lg text-sm font-bold shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          <Save size={18} className="mr-2" /> 
          Save Clinical Parameters & Proceed to Medication (Rx)
        </button>
      </div>

    </div>
  );
}

function getPrintableData(data: any) {
  const printable: any = {};
  
  Object.keys(data).forEach(key => {
    const value = data[key];
    if (value && value !== '' && value !== '-' && value !== '--') {
      printable[key] = value;
    }
  });

  if (printable.bpSys && printable.bpDia) {
    printable.bp = `${printable.bpSys}/${printable.bpDia} mmHg`;
    delete printable.bpSys;
    delete printable.bpDia;
  }

  return printable;
}