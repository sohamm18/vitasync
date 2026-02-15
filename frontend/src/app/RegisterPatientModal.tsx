import React, { useState } from 'react';
import { X, UserPlus, Save } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from './components/ui/dialog';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';

export default function RegisterPatientModal({ isOpen, onClose, onRegister }: { 
  isOpen: boolean; 
  onClose: () => void;
  onRegister: (patient: any) => void;
}) {
  const [formData, setFormData] = useState({ name: '', mobile: '', age: '', gender: 'Male' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate creating a patient ID
    const newPatient = { ...formData, id: Math.floor(Math.random() * 1000) };
    onRegister(newPatient);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-[#ffffe3] border-[#3eb489]/20">
        <div className="flex items-center justify-between mb-4">
          <DialogTitle className="text-xl font-bold text-[#3eb489] flex items-center gap-2">
            <UserPlus size={20} /> Quick Register
          </DialogTitle>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label>Patient Full Name</Label>
            <Input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Mobile Number</Label>
              <Input required type="tel" value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})} />
            </div>
            <div className="space-y-1">
              <Label>Gender</Label>
              <select 
                className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm"
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
              >
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
          </div>
          <Button type="submit" className="w-full bg-[#3eb489] hover:bg-[#2d8a6b] text-white">
            Register & Select Patient
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}