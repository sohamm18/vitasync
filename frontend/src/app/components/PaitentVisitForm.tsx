import React, { useState, useEffect } from 'react';
import { Calendar, Save, Plus, Trash2, Calculator } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

// Medicine Interface for the Calculator
interface Medicine {
  id: number;
  name: string;
  type: 'Tablet' | 'Syrup' | 'Injection' | 'Other';
  doseAmount: string; // e.g., "15" (ml) or "1" (tab)
  frequency: string;  // e.g., "2" (times a day)
  days: string;       // e.g., "3" (days)
  total: number;      // Calculated result
  instruction: string; // e.g., "After food"
}

export default function PatientVisitForm() {
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]);

  // --- Medicine State & Logic ---
  const [medicines, setMedicines] = useState<Medicine[]>([]);

  const addMedicine = () => {
    setMedicines([
      ...medicines,
      {
        id: Date.now(),
        name: '',
        type: 'Tablet',
        doseAmount: '',
        frequency: '',
        days: '',
        total: 0,
        instruction: ''
      }
    ]);
  };

  const removeMedicine = (id: number) => {
    setMedicines(medicines.filter(m => m.id !== id));
  };

  const updateMedicine = (id: number, field: keyof Medicine, value: string) => {
    setMedicines(prev => prev.map(med => {
      if (med.id !== id) return med;

      const updatedMed = { ...med, [field]: value };

      // Auto-Calculate Total when Dose, Frequency, or Days change
      if (field === 'doseAmount' || field === 'frequency' || field === 'days') {
        const dose = parseFloat(updatedMed.doseAmount) || 0;
        const freq = parseFloat(updatedMed.frequency) || 0;
        const duration = parseFloat(updatedMed.days) || 0;
        
        // Logic: Dose * Freq * Days = Total
        updatedMed.total = dose * freq * duration;
      }

      return updatedMed;
    }));
  };

  return (
    <div className="space-y-6 p-4">
      
      {/* --- SECTION 1: HORIZONTAL PATIENT RECORD --- */}
      <Card className="border-blue-100 shadow-sm">
        <CardHeader className="pb-2 bg-blue-50/50">
          <CardTitle className="text-lg text-blue-900 flex items-center gap-2">
            Patient Record
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
            {/* Name */}
            <div className="md:col-span-1">
              <Label className="text-xs font-bold text-gray-500 uppercase">Patient Name *</Label>
              <Input placeholder="Enter name" className="mt-1 h-9" />
            </div>

            {/* ID */}
            <div className="md:col-span-1">
              <Label className="text-xs font-bold text-gray-500 uppercase">Patient ID *</Label>
              <Input placeholder="ID-1001" className="mt-1 h-9 bg-gray-50" readOnly />
            </div>

            {/* Gender */}
            <div className="md:col-span-1">
              <Label className="text-xs font-bold text-gray-500 uppercase">Gender *</Label>
              <Select>
                <SelectTrigger className="mt-1 h-9">
                  <SelectValue placeholder="M / F" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Age */}
            <div className="md:col-span-1 relative">
              <Label className="text-xs font-bold text-gray-500 uppercase">Age</Label>
              <div className="relative mt-1">
                <Input placeholder="0" className="h-9 pr-8" type="number" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">yrs</span>
              </div>
            </div>

            {/* Weight */}
            <div className="md:col-span-1 relative">
              <Label className="text-xs font-bold text-gray-500 uppercase">Weight</Label>
              <div className="relative mt-1">
                <Input placeholder="0" className="h-9 pr-8" type="number" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">kg</span>
              </div>
            </div>

            {/* Date */}
            <div className="md:col-span-1">
              <Label className="text-xs font-bold text-gray-500 uppercase">Date</Label>
              <div className="relative mt-1">
                <Input 
                  type="date" 
                  className="h-9" 
                  value={visitDate} 
                  onChange={(e) => setVisitDate(e.target.value)} 
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* --- SECTION 2: VITALS (Grid Layout) --- */}
        <Card className="lg:col-span-1 border-gray-200 shadow-sm h-fit">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-base font-semibold">Vitals & Measurements</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 grid grid-cols-2 gap-x-3 gap-y-4">
            
            {/* BP */}
            <div className="col-span-2">
               <Label className="text-xs text-gray-500">BP (mm of Hg)</Label>
               <div className="flex items-center gap-2 mt-1">
                 <Input placeholder="120" className="h-8" />
                 <span className="text-gray-400">/</span>
                 <Input placeholder="80" className="h-8" />
               </div>
            </div>

            {/* SpO2 */}
            <div>
               <Label className="text-xs text-gray-500">SpO2 (%)</Label>
               <Input placeholder="98" className="mt-1 h-8" />
            </div>

            {/* HR */}
            <div>
               <Label className="text-xs text-gray-500">HR (/min)</Label>
               <Input placeholder="72" className="mt-1 h-8" />
            </div>

            {/* Temp */}
            <div>
               <Label className="text-xs text-gray-500">Temp (°F)</Label>
               <Input placeholder="98.6" className="mt-1 h-8" />
            </div>

            {/* RR */}
            <div>
               <Label className="text-xs text-gray-500">RR (/min)</Label>
               <Input placeholder="18" className="mt-1 h-8" />
            </div>

             {/* BSL */}
            <div>
               <Label className="text-xs text-gray-500">BSL (mg/dl)</Label>
               <Input placeholder="Random" className="mt-1 h-8" />
            </div>

             {/* Height */}
            <div>
               <Label className="text-xs text-gray-500">Height (cm)</Label>
               <Input placeholder="170" className="mt-1 h-8" />
            </div>

             {/* HB */}
             <div>
               <Label className="text-xs text-gray-500">HB (g/dl)</Label>
               <Input placeholder="12.5" className="mt-1 h-8" />
            </div>

             {/* Mobile */}
             <div>
               <Label className="text-xs text-gray-500">Mobile No.</Label>
               <Input placeholder="987..." className="mt-1 h-8" />
            </div>

             {/* LMP */}
            <div className="col-span-2">
               <Label className="text-xs text-gray-500">LMP (Date)</Label>
               <Input type="date" className="mt-1 h-8" />
            </div>

          </CardContent>
        </Card>

        {/* --- SECTION 3: SYSTEM EXAMINATION & PRESCRIPTION --- */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* System Exam */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base font-semibold">System Examination (In Words)</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* CNS */}
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-gray-700">CNS (Central Nervous Sys)</Label>
                  <Textarea 
                    placeholder="e.g. Well oriented, conscious, drowsy, disoriented..." 
                    className="h-24 resize-none text-sm bg-gray-50/50" 
                  />
                </div>

                {/* RS */}
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-gray-700">RS (Respiratory Sys)</Label>
                  <Textarea 
                    placeholder="e.g. AEBE clear, Rh @right hilar, bilateral wheezing..." 
                    className="h-24 resize-none text-sm bg-gray-50/50" 
                  />
                </div>

                {/* P/A */}
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-gray-700">P/A (Per Abdomen)</Label>
                  <Textarea 
                    placeholder="e.g. Soft, tender, lump at epigastric, L0, S1..." 
                    className="h-24 resize-none text-sm bg-gray-50/50" 
                  />
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Medicine Calculator */}
          <Card className="border-blue-200 shadow-md">
            <CardHeader className="pb-3 border-b bg-blue-50/30 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Calculator className="w-4 h-4 text-blue-600" />
                Prescription & Auto-Calculator
              </CardTitle>
              <Button size="sm" onClick={addMedicine} className="h-8 bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-1" /> Add Med
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-100 text-gray-600 font-medium">
                    <tr>
                      <th className="px-4 py-3 w-[25%]">Medicine Name</th>
                      <th className="px-2 py-3 w-[12%]">Type</th>
                      <th className="px-2 py-3 w-[12%]">Dose <span className="text-[10px] text-gray-400 block">(ml/tab)</span></th>
                      <th className="px-2 py-3 w-[12%]">Freq <span className="text-[10px] text-gray-400 block">(times/day)</span></th>
                      <th className="px-2 py-3 w-[12%]">Days</th>
                      <th className="px-4 py-3 w-[15%] bg-blue-50 text-blue-800">Total Qty</th>
                      <th className="px-2 py-3 w-[5%]"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {medicines.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-gray-400 italic">
                          No medicines added. Click "+ Add Med" to prescribe.
                        </td>
                      </tr>
                    ) : (
                      medicines.map((med) => (
                        <tr key={med.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2">
                            <Input 
                              placeholder="Med Name" 
                              value={med.name} 
                              onChange={(e) => updateMedicine(med.id, 'name', e.target.value)} 
                              className="h-8"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <Select 
                              value={med.type} 
                              onValueChange={(val) => updateMedicine(med.id, 'type', val as any)}
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Tablet">Tab</SelectItem>
                                <SelectItem value="Syrup">Syp</SelectItem>
                                <SelectItem value="Injection">Inj</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="px-2 py-2">
                            <Input 
                              type="number" 
                              placeholder="0" 
                              value={med.doseAmount} 
                              onChange={(e) => updateMedicine(med.id, 'doseAmount', e.target.value)} 
                              className="h-8 text-center"
                            />
                          </td>
                          <td className="px-2 py-2">
                             <Input 
                              type="number" 
                              placeholder="0" 
                              value={med.frequency} 
                              onChange={(e) => updateMedicine(med.id, 'frequency', e.target.value)} 
                              className="h-8 text-center"
                            />
                          </td>
                          <td className="px-2 py-2">
                             <Input 
                              type="number" 
                              placeholder="0" 
                              value={med.days} 
                              onChange={(e) => updateMedicine(med.id, 'days', e.target.value)} 
                              className="h-8 text-center"
                            />
                          </td>
                          <td className="px-4 py-2 bg-blue-50/50">
                            <div className="font-bold text-blue-700 text-center">
                              {med.total > 0 ? med.total : '-'} 
                              <span className="text-[10px] font-normal text-gray-500 ml-1">
                                {med.type === 'Syrup' ? 'ml' : 'tabs'}
                              </span>
                            </div>
                          </td>
                          <td className="px-2 py-2 text-center">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => removeMedicine(med.id)}
                              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
      
      {/* Footer Action */}
      <div className="flex justify-end gap-3 pt-4 border-t">
         <Button variant="outline">Cancel</Button>
         <Button className="bg-blue-600 hover:bg-blue-700 w-40">
           <Save className="w-4 h-4 mr-2" /> Save Record
         </Button>
      </div>

    </div>
  );
}