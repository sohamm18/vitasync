import { useState, useEffect } from 'react';
import { Printer, Save, Plus, Trash2, Calculator } from 'lucide-react';
import { Card, CardContent } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { useAppContext } from './context/AppContext';

interface CustomItem {
  id: string;
  name: string;
  charge: string;
}

export default function BillsContent() {
  const { doctorProfile, activePatient } = useAppContext();

  // --- Billing States ---
  const [billDate, setBillDate] = useState(new Date().toISOString().split('T')[0]);
  const [consultationType, setConsultationType] = useState('New');
  const [certificateType, setCertificateType] = useState('None');
  
  // Fixed Charges
  const [charges, setCharges] = useState({
    consultation: '',
    sutures: '',
    dressing: '',
    iv: '',
    certificate: ''
  });

  // Dynamic Custom Items
  const [customItems, setCustomItems] = useState<CustomItem[]>([
    { id: '1', name: '', charge: '' }
  ]);

  // Total Calculation
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    // Calculate total whenever charges change
    let total = 0;
    Object.values(charges).forEach(val => {
      total += parseFloat(val) || 0;
    });
    customItems.forEach(item => {
      total += parseFloat(item.charge) || 0;
    });
    setTotalAmount(total);
  }, [charges, customItems]);

  const handleChargeChange = (field: keyof typeof charges, value: string) => {
    setCharges(prev => ({ ...prev, [field]: value }));
  };

  const handleCustomItemChange = (id: string, field: 'name' | 'charge', value: string) => {
    setCustomItems(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const addCustomItem = () => {
    setCustomItems([...customItems, { id: Date.now().toString(), name: '', charge: '' }]);
  };

  const removeCustomItem = (id: string) => {
    setCustomItems(customItems.filter(item => item.id !== id));
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper to determine if a row should be hidden during print
  const isRowEmpty = (amount: string) => {
    return !amount || parseFloat(amount) === 0;
  };

  // --- Shared Styles (White BG, Grey Text, Green Border) ---
  const inputStyle = "bg-white border border-green-600 text-gray-600 focus-visible:ring-1 focus-visible:ring-green-600 focus-visible:ring-offset-0 focus:outline-none placeholder:text-gray-400";
  const rowStyle = "grid grid-cols-12 gap-4 items-center py-2 border-b border-gray-100 last:border-0 printable-row";
  const btnStyle = "bg-white border border-green-600 text-gray-600 hover:bg-green-50 font-bold transition-all";

  if (!activePatient) return null; 

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      
      <div className="mb-6 no-print">
        <h2 className="text-3xl font-semibold text-gray-600">Billing & Invoices</h2>
        <p className="text-gray-500 mt-1">Generate and print patient bills</p>
      </div>

      <Card className="border border-green-600 shadow-sm bg-white bill-container">
        
        {/* --- A5 BILLING CONTAINER --- */}
        <div className="prescription-page bg-white mx-auto relative">
            
           {/* HEADER: Clinic, Doctor, Reg */}
           <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-6 pt-4 px-4">
              <div className="w-1/4">
                 <img 
                  src="/saisamarth.png" 
                  alt="Clinic Logo" 
                  className="w-24 h-auto object-contain" 
                 />
              </div>
              <div className="w-1/2 text-center mt-2">
                 <h1 className="text-xl text-black tracking-normal leading-none uppercase font-normal">
                  Sai Samarth Clinic
                 </h1>
              </div>
              <div className="w-1/4 text-right text-[10px] leading-tight font-medium">
                 <p className="font-black text-black text-sm">Dr. Ajit Vispute</p>
                 <p className="text-gray-700">B.A.M.S (MUHS, NASHIK)</p>
                 <p className="text-gray-700 italic">RegdNo. I-50338-A</p>
              </div>
           </div>

           {/* PATIENT DETAILS BAR */}
           <div className="grid grid-cols-3 border-y border-gray-400 py-3 px-4 mx-4 text-[12px] mb-6 bg-gray-50 items-center">
              <div className="font-bold">ID: <span className="font-medium">{activePatient.id}</span></div>
              <div className="text-center font-bold">PATIENT: <span className="font-black uppercase">{activePatient.name}</span></div>
              <div className="text-right font-bold flex items-center justify-end gap-2">
                DATE: 
                <Input 
                  type="date" 
                  value={billDate} 
                  onChange={(e) => setBillDate(e.target.value)}
                  className="h-7 w-32 px-2 py-0 text-xs border-green-600 text-gray-700 font-medium" 
                />
              </div>
           </div>

           {/* INVOICE TITLE */}
           <div className="text-center mb-4">
              <h2 className="text-lg font-bold text-gray-800 uppercase underline underline-offset-4">Tax Invoice</h2>
              <p className="text-xs text-gray-500 mt-1">Invoice #: INV-{new Date().getTime().toString().slice(-6)}</p>
           </div>

           {/* BILLING ITEMS SECTION */}
           <div className="px-4 min-h-[100mm]">
            
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 items-center pb-2 border-b-2 border-gray-200 mb-4">
              <div className="col-span-1 font-bold text-gray-400 text-xs uppercase text-center">No.</div>
              <div className="col-span-8 font-bold text-gray-400 text-xs uppercase">Particulars / Description</div>
              <div className="col-span-3 font-bold text-gray-400 text-xs uppercase text-right pr-2">Amount (₹)</div>
            </div>

            <div className="space-y-2 print-row-container">
              {/* 1. Consultation */}
              <div className={`${rowStyle} ${isRowEmpty(charges.consultation) ? 'print-hidden' : ''}`}>
                <div className="col-span-1 text-center font-bold text-gray-500">1.</div>
                <div className="col-span-8 flex items-center gap-3">
                  <Label className="text-gray-600 font-bold whitespace-nowrap min-w-[100px]">Consultation</Label>
                  <select 
                    className={`h-9 px-3 rounded-md text-sm w-40 ${inputStyle}`}
                    value={consultationType}
                    onChange={(e) => setConsultationType(e.target.value)}
                  >
                    <option value="New">New</option>
                    <option value="Follow-up">Follow-up</option>
                  </select>
                </div>
                <div className="col-span-3 relative flex items-center justify-end pr-2">
                  <span className="absolute left-3 text-gray-500 font-bold">- ₹</span>
                  <Input 
                    type="number" 
                    placeholder="0.00" 
                    className={`pl-10 text-right font-bold ${inputStyle}`}
                    value={charges.consultation}
                    onChange={(e) => handleChargeChange('consultation', e.target.value)}
                  />
                </div>
              </div>

              {/* 2. Sutures */}
              <div className={`${rowStyle} ${isRowEmpty(charges.sutures) ? 'print-hidden' : ''}`}>
                <div className="col-span-1 text-center font-bold text-gray-500">2.</div>
                <div className="col-span-8 flex items-center">
                  <Label className="text-gray-600 font-bold">Sutures</Label>
                </div>
                <div className="col-span-3 relative flex items-center justify-end pr-2">
                  <span className="absolute left-3 text-gray-500 font-bold">- ₹</span>
                  <Input 
                    type="number" 
                    placeholder="0.00" 
                    className={`pl-10 text-right font-bold ${inputStyle}`}
                    value={charges.sutures}
                    onChange={(e) => handleChargeChange('sutures', e.target.value)}
                  />
                </div>
              </div>

              {/* 3. Dressing */}
              <div className={`${rowStyle} ${isRowEmpty(charges.dressing) ? 'print-hidden' : ''}`}>
                <div className="col-span-1 text-center font-bold text-gray-500">3.</div>
                <div className="col-span-8 flex items-center">
                  <Label className="text-gray-600 font-bold">Dressing</Label>
                </div>
                <div className="col-span-3 relative flex items-center justify-end pr-2">
                  <span className="absolute left-3 text-gray-500 font-bold">- ₹</span>
                  <Input 
                    type="number" 
                    placeholder="0.00" 
                    className={`pl-10 text-right font-bold ${inputStyle}`}
                    value={charges.dressing}
                    onChange={(e) => handleChargeChange('dressing', e.target.value)}
                  />
                </div>
              </div>

              {/* 4. IV */}
              <div className={`${rowStyle} ${isRowEmpty(charges.iv) ? 'print-hidden' : ''}`}>
                <div className="col-span-1 text-center font-bold text-gray-500">4.</div>
                <div className="col-span-8 flex items-center">
                  <Label className="text-gray-600 font-bold">IV Fluids / Injection</Label>
                </div>
                <div className="col-span-3 relative flex items-center justify-end pr-2">
                  <span className="absolute left-3 text-gray-500 font-bold">- ₹</span>
                  <Input 
                    type="number" 
                    placeholder="0.00" 
                    className={`pl-10 text-right font-bold ${inputStyle}`}
                    value={charges.iv}
                    onChange={(e) => handleChargeChange('iv', e.target.value)}
                  />
                </div>
              </div>

              {/* 5. Certificates */}
              <div className={`${rowStyle} ${isRowEmpty(charges.certificate) ? 'print-hidden' : ''}`}>
                <div className="col-span-1 text-center font-bold text-gray-500">5.</div>
                <div className="col-span-8 flex items-center gap-3">
                  <Label className="text-gray-600 font-bold whitespace-nowrap min-w-[100px]">Certificate</Label>
                  <select 
                    className={`h-9 px-3 rounded-md text-sm w-40 ${inputStyle}`}
                    value={certificateType}
                    onChange={(e) => setCertificateType(e.target.value)}
                  >
                    <option value="None">-- Select --</option>
                    <option value="Fitness">Fitness</option>
                    <option value="Unfitness">Unfitness</option>
                    <option value="Vaccine">Vaccine</option>
                  </select>
                </div>
                <div className="col-span-3 relative flex items-center justify-end pr-2">
                  <span className="absolute left-3 text-gray-500 font-bold">- ₹</span>
                  <Input 
                    type="number" 
                    placeholder="0.00" 
                    className={`pl-10 text-right font-bold ${inputStyle}`}
                    value={charges.certificate}
                    onChange={(e) => handleChargeChange('certificate', e.target.value)}
                    disabled={certificateType === 'None'}
                  />
                </div>
              </div>

              {/* 6. Editable Custom Fields */}
              {customItems.map((item, index) => (
                <div key={item.id} className={`${rowStyle} ${isRowEmpty(item.charge) ? 'print-hidden' : ''}`}>
                  <div className="col-span-1 text-center font-bold text-gray-500">{6 + index}.</div>
                  <div className="col-span-8 flex items-center gap-2">
                    <Input 
                      type="text" 
                      placeholder="Enter additional procedure or item..." 
                      className={inputStyle}
                      value={item.name}
                      onChange={(e) => handleCustomItemChange(item.id, 'name', e.target.value)}
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-gray-400 hover:text-red-600 no-print"
                      onClick={() => removeCustomItem(item.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                  <div className="col-span-3 relative flex items-center justify-end pr-2">
                    <span className="absolute left-3 text-gray-500 font-bold">- ₹</span>
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      className={`pl-10 text-right font-bold ${inputStyle}`}
                      value={item.charge}
                      onChange={(e) => handleCustomItemChange(item.id, 'charge', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 mb-8 no-print">
              <Button 
                className={`h-8 text-xs px-3 ${btnStyle}`}
                onClick={addCustomItem}
              >
                <Plus size={14} className="mr-1" /> Add Another Item
              </Button>
            </div>

            {/* TOTAL SECTION */}
            <div className="pt-4 border-t-2 border-black flex justify-end">
              <div className="w-1/2 flex justify-between items-center pr-2">
                <h3 className="text-lg font-bold text-gray-800 uppercase">Total Amount:</h3>
                {/* 👇 Changed from font-black to font-normal 👇 */}
                <h2 className="text-2xl font-normal text-black">₹ {totalAmount.toFixed(2)}</h2>
              </div>
            </div>
            
            {/* Signature Section - Bottom Right */}
             <div className="absolute bottom-16 right-6 text-right">
                <div className="h-16 w-40 border-b-2 border-dotted border-gray-300 ml-auto mb-2 opacity-30"></div>
                <p className="text-[12px] font-black text-black uppercase tracking-tight underline underline-offset-4 decoration-gray-200">
                  Dr. Ajit Vispute
                </p>
                <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">Authorized Signature</p>
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
      </Card>

      {/* FOOTER ACTIONS */}
      <div className="flex justify-end gap-4 no-print pt-4">
        <Button className={`h-14 px-8 text-lg ${btnStyle}`}>
          <Save className="mr-2" size={20} /> Save Bill
        </Button>
        <Button 
          onClick={handlePrint}
          className={`h-14 px-8 text-lg ${btnStyle}`}
        >
          <Printer className="mr-2" size={20} /> Print Invoice
        </Button>
      </div>

      {/* PRINT STYLES SPECIFIC TO BILLING */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .bill-container, .bill-container * {
            visibility: visible;
          }
          .bill-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 148mm !important; 
            min-height: 210mm !important; 
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .no-print {
            display: none !important;
          }

          /* Hide rows with no charges */
          .print-hidden {
            display: none !important;
          }
          
          @page {
            size: A5 portrait;
            margin: 0;
          }
          
          /* Clean up inputs for print view */
          .bill-container input, .bill-container select {
            border: none !important;
            background: transparent !important;
            padding: 0 !important;
            margin: 0 !important;
            appearance: none;
            -moz-appearance: none;
            -webkit-appearance: none;
            color: black !important;
          }
          
          /* Format the date input for print */
          input[type="date"]::-webkit-calendar-picker-indicator {
             display: none;
          }
        }
      `}</style>

    </div>
  );
}