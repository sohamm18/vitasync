import { useState, useEffect } from 'react';
import { 
  Plus, 
  X, 
  Printer, 
  ArrowLeft, 
  Search, 
  History, 
  CheckCircle2, 
  Calendar, 
  Loader2, 
  Trash2,
  FileText,
  Activity,
  Stethoscope
} from 'lucide-react';
import { Card, CardContent } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Textarea } from './components/ui/textarea';
import { useAppContext } from './context/AppContext';

// --- Types & Interfaces ---

interface MedicationEntry {
  id: string;
  medicineName: string;
  quantity: string;
  unit: 'unit' | 'ml';
  frequency: string;
  timing: string;
  duration: string;
}

type WorkflowStep = 'patient-selection' | 'consultation' | 'preview';

export default function PrescriptionContent() {
  // 1. Context & Global State
  const { 
    doctorProfile, 
    activePatient, 
    setActivePatient, 
    prescriptionData 
  } = useAppContext();

  // 2. Workflow & UI State
  const [workflowStep, setWorkflowStep] = useState<WorkflowStep>('patient-selection');
  const [isSaving, setIsSaving] = useState(false);

  // 3. Form Data State (Removed causeOfVisit)
  const [diagnosis, setDiagnosis] = useState('');
  const [medications, setMedications] = useState<MedicationEntry[]>([]);

  // 4. Styles - Standard Grey/Black Theme
  const inputStyle = "bg-white border border-gray-300 focus:border-gray-500 focus:ring-0 focus:outline-none placeholder:text-gray-300 transition-colors text-black";
  const labelStyle = "text-black font-bold text-sm mb-1 block";

  // --- Side Effects ---

  useEffect(() => {
    if (activePatient) {
      setWorkflowStep('consultation');
    } else {
      setWorkflowStep('patient-selection');
    }
  }, [activePatient]);

  // --- Logic Handlers ---

  const handleSaveToDatabase = async () => {
    setIsSaving(true);
    
    // Prepare the payload for your PHP backend (Removed cause)
    const prescriptionSaveData = {
      patient_id: activePatient?.id,
      doctor_id: doctorProfile.employeeId,
      diagnosis: diagnosis,
      meds: medications,
      date: new Date().toISOString().split('T')[0]
    };

    try {
      // Endpoint for your vitasync application
      const response = await fetch('http://localhost/vitasync/api/save_prescription.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prescriptionSaveData)
      });

      if (response.ok) {
        window.print();
        alert("Prescription saved and sent to printer.");
      } else {
        throw new Error("Server responded with an error.");
      }
    } catch (error) {
      console.error("Save failed:", error);
      alert("Database connection failed. Printing local copy only.");
      window.print();
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddMedication = () => {
    setMedications([
      ...medications, 
      { 
        id: Date.now().toString(), 
        medicineName: '', 
        quantity: '1', 
        unit: 'unit', 
        frequency: '1-0-1', 
        timing: 'After Food', 
        duration: '5 Days' 
      }
    ]);
  };

  const updateMedication = (id: string, updates: Partial<MedicationEntry>) => {
    setMedications(
      medications.map(med => med.id === id ? { ...med, ...updates } : med)
    );
  };

  // --- Render Sections ---

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      
      {/* SECTION 1: SELECTION SCREEN */}
      {workflowStep === 'patient-selection' && (
        <div className="flex flex-col items-center justify-center p-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
           <Search size={64} className="text-gray-200 mb-6" />
           <h3 className="text-2xl font-bold text-gray-900">Patient Search Required</h3>
           <p className="text-gray-400 mt-2 mb-8">Please select a patient from the top search bar to begin the consultation.</p>
           <Button 
            variant="outline" 
            className="border-gray-300 h-12 px-8 font-bold"
            onClick={() => document.getElementById('global-search-input')?.focus()}
           >
             Focus Search Bar
           </Button>
        </div>
      )}

      {/* SECTION 2: CONSULTATION FORM */}
      {workflowStep === 'consultation' && activePatient && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Patient Quick Info Header */}
          <div className="bg-gray-100 border border-gray-200 rounded-2xl p-6 flex items-center justify-between no-print shadow-sm">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-black">{activePatient.name}</h2>
                <span className="bg-white border border-gray-300 text-gray-600 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                  ID: {activePatient.id}
                </span>
              </div>
              <p className="text-gray-500 font-medium mt-1">
                {activePatient.age} Yrs • {activePatient.gender} • {activePatient.phone}
              </p>
            </div>
            <Button 
              variant="ghost" 
              className="text-gray-400 hover:text-red-600 hover:bg-white border border-transparent hover:border-gray-200"
              onClick={() => setActivePatient(null)}
            >
              <X className="mr-2 h-4 w-4" /> Change Patient
            </Button>
          </div>

          <Card className="border-gray-200 shadow-sm overflow-hidden">
            <CardContent className="p-8 space-y-8">
              
              {/* Diagnosis Row (Expanded to full width since Cause of Visit is gone) */}
              <div className="space-y-3">
                <Label className={labelStyle}>
                  <Stethoscope size={16} className="inline mr-2 text-[#3eb489]" />
                  Provisional Diagnosis
                </Label>
                <Textarea 
                  value={diagnosis} 
                  onChange={e => setDiagnosis(e.target.value)} 
                  placeholder="Enter diagnosis..." 
                  className={`min-h-[100px] ${inputStyle}`} 
                />
              </div>

              {/* Medication Management Section */}
              <div className="space-y-6 pt-6 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-black">Medications (Rx)</h3>
                    <p className="text-sm text-gray-400">Add medicines, dosages, and duration</p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="border-gray-300 hover:bg-gray-50" 
                    onClick={handleAddMedication}
                  >
                    <Plus size={18} className="mr-2" /> Add Medicine
                  </Button>
                </div>

                <div className="space-y-4">
                  {medications.length === 0 ? (
                    <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                      <p className="text-gray-400">No medications added yet.</p>
                    </div>
                  ) : (
                    medications.map((med) => (
                      <div 
                        key={med.id} 
                        className="grid grid-cols-12 gap-3 items-end bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative transition-all hover:shadow-md"
                      >
                        <div className="col-span-12 md:col-span-4">
                          <Label className="text-[10px] uppercase text-gray-400 mb-1">Medicine Name</Label>
                          <Input 
                            value={med.medicineName} 
                            onChange={e => updateMedication(med.id, {medicineName: e.target.value})} 
                            className={inputStyle} 
                          />
                        </div>
                        <div className="col-span-4 md:col-span-3">
                          <Label className="text-[10px] uppercase text-gray-400 mb-1">Dosage</Label>
                          <Input 
                            value={med.frequency} 
                            onChange={e => updateMedication(med.id, {frequency: e.target.value})} 
                            className={inputStyle} 
                          />
                        </div>
                        <div className="col-span-4 md:col-span-2">
                          <Label className="text-[10px] uppercase text-gray-400 mb-1">Duration</Label>
                          <Input 
                            value={med.duration} 
                            onChange={e => updateMedication(med.id, {duration: e.target.value})} 
                            className={inputStyle} 
                          />
                        </div>
                        <div className="col-span-3 md:col-span-2">
                          <Label className="text-[10px] uppercase text-gray-400 mb-1">Timing</Label>
                          <Input 
                            value={med.timing} 
                            onChange={e => updateMedication(med.id, {timing: e.target.value})} 
                            className={inputStyle} 
                          />
                        </div>
                        <div className="col-span-1 flex justify-center mb-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => setMedications(medications.filter(m => m.id !== med.id))} 
                            className="text-gray-300 hover:text-red-500"
                          >
                            <Trash2 size={20} />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-8">
                <Button 
                  onClick={() => setWorkflowStep('preview')} 
                  className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-xl font-bold shadow-lg shadow-blue-200"
                >
                  <FileText className="mr-2" /> Generate Prescription Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* SECTION 3: PROFESSIONAL A5 PREVIEW */}
      {workflowStep === 'preview' && activePatient && (
        <div className="space-y-10 animate-in fade-in duration-700">
          
          {/* Action Toolbar */}
          <div className="flex gap-4 no-print justify-center bg-white p-6 rounded-2xl border border-gray-100 shadow-xl">
            <Button 
              onClick={handleSaveToDatabase} 
              disabled={isSaving} 
              className="bg-black text-white px-10 h-14 text-lg hover:bg-gray-800 shadow-xl"
            >
              {isSaving ? <Loader2 className="mr-2 animate-spin" /> : <Printer className="mr-2" />}
              Save & Print Prescription
            </Button>
            <Button 
              variant="outline" 
              className="h-14 px-10 border-gray-300 text-lg" 
              onClick={() => setWorkflowStep('consultation')}
            >
              <ArrowLeft className="mr-2" /> Back to Editor
            </Button>
          </div>
          
          {/* --- A5 PRESCRIPTION CONTAINER --- */}
          <div className="prescription-page bg-white mx-auto relative shadow-2xl">
              
             {/* HEADER: Clinic, Doctor, Reg */}
             <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-6">
                <div className="w-1/4">
                   <img 
                    src="/saisamarth.png" 
                    alt="Clinic Logo" 
                    className="w-24 h-auto object-contain" 
                   />
                </div>
                <div className="w-1/2 text-center">
                   <h1 className="text-3xl font-black text-black tracking-tighter leading-none uppercase">
                    Sai Samarth Clinic
                   </h1>
                   <p className="text-[10px] text-gray-500 font-bold mt-2">Healthcare Management System</p>
                </div>
                <div className="w-1/4 text-right text-[10px] leading-tight font-medium">
                   <p className="font-black text-black text-sm">Dr. Ajit Vispute</p>
                   <p className="text-gray-700">B.A.M.S (MUHS, NASHIK)</p>
                   <p className="text-gray-700 italic">RegdNo. I-50338-A</p>
                </div>
             </div>

             {/* PATIENT DETAILS BAR */}
             <div className="grid grid-cols-3 border-y border-gray-400 py-3 px-3 text-[12px] mb-8 bg-gray-50">
                <div className="font-bold">ID: <span className="font-medium">{activePatient.id}</span></div>
                <div className="text-center font-bold">PATIENT: <span className="font-black uppercase">{activePatient.name}</span></div>
                <div className="text-right font-bold">DATE: <span className="font-medium">{new Date().toLocaleDateString('en-GB')}</span></div>
             </div>

             {/* MAIN BODY: 40% CLINICAL | 60% RX */}
             <div className="flex gap-10 min-h-[130mm]">
                
                {/* LEFT 40% - Clinical Profile */}
                <div className="w-[40%] border-r border-gray-100 pr-6 space-y-6">
                   
                   {/* Vitals Grid */}
                   <div className="space-y-3">
                      <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest border-b border-gray-100 pb-1">Vitals</h4>
                      <div className="grid grid-cols-2 gap-y-2 text-[11px]">
                          <p className="font-bold">BP: <span className="font-medium text-gray-800">{prescriptionData?.bp || "--"}</span></p>
                          <p className="font-bold">HR: <span className="font-medium text-gray-800">{prescriptionData?.hr || "--"}</span></p>
                          <p className="font-bold">Wt: <span className="font-medium text-gray-800">{activePatient.weight || "--"}</span></p>
                          <p className="font-bold">Temp: <span className="font-medium text-gray-800">{prescriptionData?.temp || "--"}</span></p>
                          <p className="font-bold">SpO2: <span className="font-medium text-gray-800">{prescriptionData?.spo2 || "--"}</span></p>
                          <p className="font-bold">BSL: <span className="font-medium text-gray-800">{prescriptionData?.bsl || "--"}</span></p>
                      </div>
                   </div>

                   {/* Diagnosis */}
                   <div className="space-y-2">
                      <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest border-b border-gray-100 pb-1">Diagnosis</h4>
                      <p className="text-[13px] font-black text-black leading-tight">
                        {diagnosis || "Provisional diagnosis pending."}
                      </p>
                   </div>
                </div>

                {/* RIGHT 60% - Medications List */}
                <div className="w-[60%] relative">
                   <div className="text-4xl font-serif italic mb-6 text-gray-200">Rx</div>
                   
                   <div className="space-y-6">
                      {medications.length > 0 ? medications.map((m, i) => (
                        <div key={i} className="border-b border-gray-50 pb-3 last:border-0">
                           <div className="flex justify-between items-baseline mb-1">
                              <p className="text-[15px] font-black text-black">
                                {i + 1}. {m.medicineName.toUpperCase()}
                              </p>
                              <p className="text-[10px] font-black text-gray-400 uppercase">Qty: {m.quantity}</p>
                           </div>
                           <div className="flex gap-4 text-[12px] text-gray-600 ml-5 font-bold italic">
                              <span className="bg-gray-100 px-2 py-0.5 rounded">{m.frequency}</span>
                              <span className="bg-gray-100 px-2 py-0.5 rounded">{m.duration}</span>
                              <span className="text-black not-italic font-black ml-auto">({m.timing})</span>
                           </div>
                        </div>
                      )) : (
                        <p className="text-gray-300 italic">No medications prescribed.</p>
                      )}
                   </div>

                   {/* Signature Section - Bottom Right */}
                   <div className="absolute bottom-10 right-0 text-right">
                      <div className="h-20 w-40 border-b-2 border-dotted border-gray-300 ml-auto mb-2 opacity-30"></div>
                      <p className="text-[12px] font-black text-black uppercase tracking-tight underline underline-offset-4 decoration-gray-200">
                        Dr. Ajit Vispute
                      </p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">Authorized Medical Officer</p>
                   </div>
                </div>
             </div>

             {/* FOOTER SECTION */}
             <div className="absolute bottom-6 left-6 right-6 pt-3 border-t-2 border-black flex justify-between items-center text-[10px] text-gray-700 font-bold">
                <div className="flex gap-6">
                   <p className="uppercase">
                    <span className="text-gray-400">Add:</span> Shop No.8, Praide Monarch Park, Nashik
                   </p>
                   <p>
                    <span className="text-gray-400 font-bold">Phone:</span> 0253-2454646
                   </p>
                </div>
                <div className="text-right text-[8px] opacity-20 uppercase tracking-widest font-black">
                   System v2.6.0
                </div>
             </div>

          </div>
        </div>
      )}

      {/* --- A5 PRINT ENGINE STYLES --- */}
      <style>{`
        @media screen {
          .prescription-page {
            width: 148mm;
            min-height: 210mm;
            padding: 15mm;
            border: 1px solid #f3f4f6;
            background-color: #ffffff;
            border-radius: 8px;
          }
        }

        @media print {
          /* Force A5 orientation and clear margins */
          @page { 
            size: A5 portrait; 
            margin: 0; 
          }
          
          /* Hide everything except the prescription container */
          body * { 
            visibility: hidden; 
            overflow: hidden;
          }
          
          .prescription-page, .prescription-page * { 
            visibility: visible; 
          }
          
          .prescription-page { 
            position: fixed;
            left: 0;
            top: 0;
            width: 148mm;
            height: 210mm;
            padding: 10mm !important;
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          /* Hide UI elements like buttons and search bars */
          .no-print { 
            display: none !important; 
          }

          /* Ensure high contrast for medical reading */
          h1, h2, h3, p, span {
            color: black !important;
          }
        }
      `}</style>

    </div>
  );
}