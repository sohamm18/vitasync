import React, { useState, useEffect } from 'react';
import { 
  Receipt, 
  Plus, 
  Trash2, 
  Printer, 
  Save, 
  Loader2, 
  DollarSign,
  CreditCard,
  User
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { useAppContext } from './context/AppContext';
// At the top of Dashboard.tsx, BillsContent.tsx, etc.
import { patientService } from '../services/api';


// Inside BillsContent.tsx, set these as initial items for the demo
const [items, setItems] = useState<BillItem[]>([
  { id: '1', description: 'Consultation Fee', amount: 500 },
  { id: '2', description: 'CBC & Blood Report', amount: 350 },
  { id: '3', description: 'Nebulization Charges', amount: 200 }
]);

interface BillItem {
  id: string;
  description: string;
  amount: number;
}

export default function BillsContent() {
  const { activePatient, doctorProfile } = useAppContext();
  const [items, setItems] = useState<BillItem[]>([
    { id: '1', description: 'Consultation Fee', amount: 500 }
  ]);
  const [isSaving, setIsSaving] = useState(false);
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'UPI' | 'Card'>('UPI');

  // Calculate Totals
  const subtotal = items.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);
  const tax = 0; // Set GST/Tax if applicable
  const total = subtotal + tax;

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), description: '', amount: 0 }]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof BillItem, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  // --- API Call to PHP ---
  const handleSaveAndPrint = async () => {
    setIsSaving(true);
    const invoiceData = {
      patient_id: activePatient?.id,
      doctor_id: doctorProfile.employeeId,
      items: items,
      total_amount: total,
      payment_mode: paymentMode,
      date: new Date().toISOString().split('T')[0]
    };

    try {
      // Replace with your actual PHP endpoint
      const response = await fetch('http://localhost/vitasync/api/save_bill.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoiceData)
      });

      if (response.ok) {
        window.print();
      }
    } catch (error) {
      console.error("Billing save failed", error);
      window.print(); // Print anyway if Dr. Ajit is in a hurry
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="no-print flex justify-between items-end mb-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Billing & Invoices</h2>
          <p className="text-gray-500">Manage payments for {activePatient?.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Invoice Editor */}
        <div className="lg:col-span-2 space-y-6 no-print">
          <Card className="border-none shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <Receipt className="w-5 h-5 text-blue-600" /> Service Items
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={item.id} className="flex gap-4 items-end animate-in fade-in slide-in-from-top-2">
                    <div className="flex-1 space-y-2">
                      {index === 0 && <Label className="text-xs text-gray-400">Description</Label>}
                      <Input 
                        placeholder="e.g. Procedure, Blood Test" 
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        className="h-11"
                      />
                    </div>
                    <div className="w-32 space-y-2">
                      {index === 0 && <Label className="text-xs text-gray-400">Amount (₹)</Label>}
                      <Input 
                        type="number" 
                        placeholder="0" 
                        value={item.amount}
                        onChange={(e) => updateItem(item.id, 'amount', parseFloat(e.target.value))}
                        className="h-11"
                      />
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-400 hover:text-red-600 h-11"
                      onClick={() => removeItem(item.id)}
                      disabled={items.length === 1}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                ))}
                
                <Button variant="outline" onClick={addItem} className="w-full border-dashed border-2 py-6 text-gray-500 hover:text-blue-600 hover:border-blue-200 transition-all">
                  <Plus className="mr-2 h-4 w-4" /> Add Another Service
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Summary & Payment */}
        <div className="lg:col-span-1 space-y-6 no-print">
          <Card className="border-none shadow-xl bg-blue-600 text-white rounded-2xl">
            <CardContent className="p-8 space-y-6">
              <div>
                <p className="text-blue-100 text-sm">Total Amount</p>
                <h3 className="text-5xl font-black mt-1">₹{total}</h3>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/20">
                <Label className="text-blue-100 uppercase text-[10px] font-bold tracking-widest">Payment Mode</Label>
                <div className="grid grid-cols-3 gap-2">
                  {['Cash', 'UPI', 'Card'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setPaymentMode(mode as any)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        paymentMode === mode ? 'bg-white text-blue-600 shadow-lg' : 'bg-blue-500 text-white hover:bg-blue-400'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <Button 
                onClick={handleSaveAndPrint} 
                disabled={isSaving}
                className="w-full h-14 bg-white text-blue-600 hover:bg-blue-50 rounded-xl font-bold text-lg shadow-2xl"
              >
                {isSaving ? <Loader2 className="animate-spin" /> : <><Printer className="mr-2 h-5 w-5" /> Print & Save Bill</>}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* --- PRINTABLE SECTION (Hidden on Screen) --- */}
      <div className="hidden print:block prescription-container">
        <div className="bg-white p-12 w-full max-w-[210mm] mx-auto min-h-[297mm]">
           {/* Header */}
           <div className="text-center border-b-2 border-gray-900 pb-6 mb-8">
              <h1 className="text-2xl font-bold uppercase tracking-tight">{doctorProfile.clinicName}</h1>
              <p className="font-bold">{doctorProfile.firstName} {doctorProfile.lastName}</p>
              <p className="text-xs text-gray-500">{doctorProfile.designation} | Reg: {doctorProfile.registrationNumber}</p>
              <p className="text-[10px] text-gray-400 uppercase mt-1">{doctorProfile.clinicAddress}</p>
           </div>

           <div className="flex justify-between items-start mb-10 text-sm">
              <div>
                <p className="text-gray-400 uppercase text-[10px] font-bold">Bill To:</p>
                <p className="text-lg font-bold text-gray-900">{activePatient?.name}</p>
                <p className="text-gray-500">ID: {activePatient?.id} | {activePatient?.phone}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 uppercase text-[10px] font-bold">Invoice Details:</p>
                <p className="font-bold">Date: {new Date().toLocaleDateString('en-IN')}</p>
                <p className="text-gray-500 uppercase">Mode: {paymentMode}</p>
              </div>
           </div>

           {/* Bill Table */}
           <table className="w-full text-left border-collapse mb-10">
              <thead>
                <tr className="border-b-2 border-gray-100">
                  <th className="py-3 font-bold text-sm">Description</th>
                  <th className="py-3 font-bold text-sm text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50">
                    <td className="py-4 text-sm">{item.description}</td>
                    <td className="py-4 text-sm text-right font-medium">₹{item.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
           </table>

           <div className="flex justify-end pr-0">
              <div className="w-64 space-y-3 bg-gray-50 p-6 rounded-2xl">
                 <div className="flex justify-between text-sm">
                   <span className="text-gray-500">Subtotal</span>
                   <span className="font-bold">₹{subtotal.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between text-lg border-t pt-3 border-gray-200">
                   <span className="font-black text-gray-900 uppercase">Total</span>
                   <span className="font-black text-blue-700">₹{total.toFixed(2)}</span>
                 </div>
              </div>
           </div>

           <div className="mt-20 flex justify-between items-end border-t pt-10">
              <div className="text-[10px] text-gray-400 max-w-[200px]">
                * This is a computer-generated invoice. No physical signature is required unless requested.
              </div>
              <div className="text-center">
                <div className="w-48 border-b border-gray-300 mb-2"></div>
                <p className="text-sm font-bold">{doctorProfile.firstName} {doctorProfile.lastName}</p>
                <p className="text-[10px] text-gray-500">Authorized Signature</p>
              </div>
           </div>
        </div>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          .prescription-container, .prescription-container * { visibility: visible; }
          .prescription-container { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
}