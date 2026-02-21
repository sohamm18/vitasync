import React, { createContext, useContext, useState, ReactNode } from 'react';

// --- Interfaces ---

export interface DoctorProfile {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  landline: string;
  designation: string;
  department: string;
  employeeId: string;
  clinicName: string;
  clinicAddress: string;
  clinicCity: string;
  clinicState: string;
  clinicZip: string;
  registrationNumber: string;
}

export interface Patient {
  id: string;
  name: string;
  phone: string;
  age: string;
  gender: 'Male' | 'Female' | 'Other';
  weight?: string;
  bloodGroup?: string;
  address?: string;
  lastVisit?: string | {
    weight: string;
    bpSys: string;
    bpDia: string;
    [key: string]: any;
  };
}

export interface Transaction {
  id: number;
  patientId: string | null;
  desc: string;
  date: string;
  type: 'Income' | 'Expense';
  amount: number;
  status: 'Completed' | 'Pending';
  method: string;
}

export interface Medicine {
  id: string;
  name: string;
  company: string;
  dosage: string;
  type: string;
}

export interface Company {
  name: string;
  medicines: Medicine[];
}

interface AppContextType {
  doctorProfile: DoctorProfile;
  setDoctorProfile: (profile: DoctorProfile) => void;
  activePatient: Patient | null;
  setActivePatient: (patient: Patient | null) => void;
  companies: Company[];
  setCompanies: (companies: Company[]) => void;
  addCompany: (company: Company) => void;
  allTransactions: Transaction[];
  setAllTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  prescriptionData: any;
  setPrescriptionData: (data: any) => void;
  // 👇 NEW: Added for tab switching and data persistence
  activeTab: string;
  setActiveTab: (tab: string) => void;
  clinicalFormData: any;
  setClinicalFormData: (data: any) => void;
}

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 1, patientId: '101', desc: 'Consultation Fee - Rohan Sharma', date: '2026-02-14', type: 'Income', amount: 500, status: 'Completed', method: 'UPI' },
  { id: 2, patientId: null, desc: 'Medicine Stock Purchase', date: '2026-02-13', type: 'Expense', amount: 12400, status: 'Completed', method: 'Bank Transfer' },
  { id: 3, patientId: '102', desc: 'OPD Charges - Ananya Gupta', date: '2026-02-13', type: 'Income', amount: 800, status: 'Pending', method: 'Cash' },
];

const defaultDoctorProfile: DoctorProfile = {
  firstName: 'Dr. Ajit',
  lastName: 'Vispute',
  email: 'saisamarth@gmail.com',
  mobile: '+91 96232 89615',
  landline: '+',
  designation: 'B.A.M.S (MUHS,Nashik; AHERF, MUHS)',
  department: 'General Medicine',
  employeeId: 'DOC-2024-001',
  clinicName: 'Sai Samarth Clinic', 
  clinicAddress: 'Shop No.8, Praide Monarch Park,Behind Big Bazaar',
  clinicCity: 'Nashik Road',
  clinicState: 'Nashik, Maharashtra',
  clinicZip: '422101',
  registrationNumber: '',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile>(defaultDoctorProfile);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [activePatient, setActivePatient] = useState<Patient | null>(null);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [prescriptionData, setPrescriptionData] = useState<any>({});
  
  // 👇 NEW States
  const [activeTab, setActiveTab] = useState('Patients');
  const [clinicalFormData, setClinicalFormData] = useState<any>(null);

  const addCompany = (company: Company) => {
    setCompanies(prev => {
      const existing = prev.find(c => c.name === company.name);
      if (existing) {
        return prev.map(c => c.name === company.name ? company : c);
      }
      return [...prev, company];
    });
  };

  return (
    <AppContext.Provider value={{ 
      doctorProfile, 
      setDoctorProfile, 
      activePatient, 
      setActivePatient, 
      companies, 
      setCompanies, 
      addCompany,
      allTransactions,
      setAllTransactions,
      prescriptionData,
      setPrescriptionData,
      activeTab,         // 👈 Added
      setActiveTab,      // 👈 Added
      clinicalFormData,  // 👈 Added
      setClinicalFormData // 👈 Added
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}