
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 👈 Import for redirection
import { 
  Building2, 
  Printer, 
  Database, 
  Lock, 
  Info, 
  Save, 
  Download,
  X,
  Phone,
  Mail,
  User,
  LogOut
} from 'lucide-react';

// Check your import paths here based on your folder structure
import { Dialog, DialogContent, DialogTitle } from './components/ui/dialog';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Switch } from './components/ui/switch';
import { useAppContext } from './context/AppContext';

// 1. Define Props Interface
interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: string; // Optional prop to open specific tab
}

export default function SettingsModal({ isOpen, onClose, defaultTab = 'clinic' }: SettingsModalProps) {
  const { doctorProfile, setDoctorProfile } = useAppContext();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [margins, setMargins] = useState({ top: 40, left: 10 });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  // Hook for navigation
  const navigate = useNavigate();

  // 2. Sync tab when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
    }
  }, [isOpen, defaultTab]);

  // 3. Handle Logout Logic
  const handleLogout = () => {
    setShowLogoutConfirm(false);
    onClose();
    // Redirect to login page
    navigate('/'); 
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden bg-[#eaf7f4] border-[#3eb489]/20">
        
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-gray-100 flex items-center justify-between">
          <DialogTitle className="text-xl font-bold text-[#3eb489] flex items-center gap-2">
             Settings
          </DialogTitle>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
        </div>

        <div className="flex h-[450px] bg-white">
          
          {/* --- Sidebar Navigation --- */}
          <div className="w-48 bg-[#f8fafc] border-r border-gray-100 py-4 flex flex-col gap-1">
            {[
              { id: 'profile', label: 'My Profile', icon: User },
              { id: 'clinic', label: 'Clinic Profile', icon: Building2 },
              { id: 'printer', label: 'Prescription Layout', icon: Printer },
              { id: 'backup', label: 'Data Backup', icon: Database },
              { id: 'security', label: 'Security', icon: Lock },
              { id: 'about', label: 'About', icon: Info },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-4 py-3 text-sm font-medium text-left flex items-center gap-3 transition-all ${
                  activeTab === item.id 
                    ? 'bg-white text-[#3eb489] border-l-4 border-[#3eb489] shadow-sm' 
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                }`}
              >
                <item.icon size={18} /> {item.label}
              </button>
            ))}
          </div>

          {/* --- Main Content Area --- */}
          <div className="flex-1 p-8 overflow-y-auto bg-white">
            
            {/* TAB 1: MY PROFILE */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Doctor Profile</h3>
                  <p className="text-xs text-gray-500">Your professional information and credentials</p>
                </div>

                {/* Profile Header */}
                <div className="bg-[#eaf7f4] p-4 rounded-lg border border-[#3eb489]/20 flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#3eb489] rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{doctorProfile?.firstName} {doctorProfile?.lastName}</p>
                    <p className="text-xs text-gray-600">{doctorProfile?.email}</p>
                  </div>
                </div>

                {/* Profile Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500 font-semibold mb-1">Department</p>
                    <p className="font-semibold text-gray-900">{doctorProfile?.department}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500 font-semibold mb-1">Employee ID</p>
                    <p className="font-semibold text-gray-900">{doctorProfile?.employeeId}</p>
                  </div>
                </div>

                {/* Qualifications */}
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 font-semibold uppercase">Qualifications & Registration</p>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-sm text-gray-700">{doctorProfile?.designation}</p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-3 border-t pt-4">
                  <p className="text-xs text-gray-500 font-semibold uppercase">Contact Information</p>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-4 h-4 text-[#3eb489]" />
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm font-medium text-gray-900">{doctorProfile?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-4 h-4 text-[#3eb489]" />
                    <div>
                      <p className="text-xs text-gray-500">Mobile</p>
                      <p className="text-sm font-medium text-gray-900">{doctorProfile?.mobile}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Landline</p>
                      <p className="text-sm font-medium text-gray-900">{doctorProfile?.landline || 'Not Available'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CLINIC DETAILS */}
            {activeTab === 'clinic' && (
              <div className="space-y-5">
                <div>
                    <h3 className="font-bold text-gray-900 text-lg">Clinic Details</h3>
                    <p className="text-xs text-gray-500">This information appears on your printed prescriptions.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Clinic Name</Label>
                        <Input 
                            value={doctorProfile.clinicName} 
                            onChange={(e) => setDoctorProfile({...doctorProfile, clinicName: e.target.value})}
                            className="focus:ring-[#3eb489]"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Phone (For Patients)</Label>
                        <Input 
                            value={doctorProfile.mobile} 
                            onChange={(e) => setDoctorProfile({...doctorProfile, mobile: e.target.value})}
                            className="focus:ring-[#3eb489]"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                  <Label>Registration Number (Reg No)</Label>
                  <Input 
                    value={doctorProfile.registrationNumber} 
                    onChange={(e) => setDoctorProfile({...doctorProfile, registrationNumber: e.target.value})}
                    placeholder="e.g. MMC-2024-XXXX"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Full Address</Label>
                  <textarea 
                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#3eb489] min-h-[80px]"
                    value={doctorProfile.clinicAddress}
                    onChange={(e) => setDoctorProfile({...doctorProfile, clinicAddress: e.target.value})}
                  />
                </div>
              </div>
            )}

            {/* TAB 3: PRINTER SETUP */}
            {activeTab === 'printer' && (
              <div className="space-y-6">
                <div>
                    <h3 className="font-bold text-gray-900 text-lg">Printer Setup</h3>
                    <p className="text-xs text-gray-500">Adjust margins to fit your letterhead.</p>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 flex gap-3 items-start">
                    <Printer className="text-yellow-600 w-5 h-5 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                        <strong>Tip:</strong> If you use pre-printed letterhead paper, turn <u>off</u> the "Print Header" option below.
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-xl bg-gray-50">
                    <div className="space-y-0.5">
                        <Label className="text-base">Print Header?</Label>
                        <p className="text-xs text-gray-500">Print Clinic Name & Logo on PDF</p>
                    </div>
                    <Switch defaultChecked={true} className="data-[state=checked]:bg-[#3eb489]" />
                </div>
                
                <div className="space-y-6 pt-2">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Label>Top Margin (Push text down)</Label>
                      <span className="text-xs font-bold text-[#3eb489] bg-[#eaf7f4] px-2 py-1 rounded">{margins.top}mm</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" 
                      value={margins.top} 
                      onChange={(e) => setMargins({...margins, top: parseInt(e.target.value)})}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#3eb489]"
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Label>Left Margin (Push text right)</Label>
                      <span className="text-xs font-bold text-[#3eb489] bg-[#eaf7f4] px-2 py-1 rounded">{margins.left}mm</span>
                    </div>
                    <input 
                      type="range" min="0" max="50" 
                      value={margins.left} 
                      onChange={(e) => setMargins({...margins, left: parseInt(e.target.value)})}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#3eb489]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: DATA BACKUP */}
            {activeTab === 'backup' && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                <div className="w-16 h-16 bg-[#eaf7f4] rounded-full flex items-center justify-center mb-2">
                  <Database className="w-8 h-8 text-[#3eb489]" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-xl">Backup Your Data</h3>
                  <p className="text-sm text-gray-500 max-w-[250px] mx-auto mt-2">
                    Avoid data loss. Download a complete copy of your patients and records securely.
                  </p>
                </div>
                <Button className="bg-[#3eb489] hover:bg-[#2d8a6b] text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-[#3eb489]/20">
                  <Download className="mr-2 h-5 w-5" /> Download Backup
                </Button>
                <p className="text-xs text-gray-400">Last backup: Never</p>
              </div>
            )}

            {/* TAB 5: SECURITY */}
            {activeTab === 'security' && (
              <div className="space-y-5">
                <div>
                    <h3 className="font-bold text-gray-900 text-lg">Security</h3>
                    <p className="text-xs text-gray-500">Update your login password.</p>
                </div>
                <div className="space-y-3">
                    <div className="space-y-1">
                        <Label>Current Password</Label>
                        <Input type="password" />
                    </div>
                    <div className="space-y-1">
                        <Label>New Password</Label>
                        <Input type="password" />
                    </div>
                    <div className="space-y-1">
                        <Label>Confirm New Password</Label>
                        <Input type="password" />
                    </div>
                    <div className="pt-2">
                        <Button className="w-full bg-gray-900 text-white hover:bg-gray-800">Update Password</Button>
                    </div>
                </div>
              </div>
            )}

            {/* TAB 6: ABOUT */}
            {activeTab === 'about' && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                <div className="w-20 h-20 bg-[#eaf7f4] rounded-2xl flex items-center justify-center mb-2 border-2 border-[#3eb489]/20">
                  <span className="text-3xl font-bold text-[#3eb489]">VS</span>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-bold text-gray-900 text-2xl tracking-tight">Vitasync AI</h3>
                  <p className="text-sm font-medium text-[#3eb489] bg-[#eaf7f4] px-3 py-1 rounded-full inline-block">
                    Version 1.0.0 (Stable)
                  </p>
                </div>

                <p className="text-sm text-gray-500 max-w-[300px] mx-auto">
                  Bridging Healthcare with Intelligent Solutions. <br/>
                  Designed exclusively for <strong>Sai Samarth Clinic</strong>.
                </p>

                <div className="w-full border-t border-gray-100 pt-6 mt-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Developer Support</p>
                  <div className="flex flex-col gap-2 items-center text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-[#3eb489]" /> 
                      <span>+917499448779, +918999797573</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-[#3eb489]" /> 
                      <span>support@vitasync.in</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Footer with Logout */}
        <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={onClose}>Close</Button>
            <Button className="bg-[#3eb489] hover:bg-[#2d8a6b] text-white shadow-md" onClick={onClose}>
              <Save className="w-4 h-4 mr-2" /> Save Changes
            </Button>
          </div>
        </div>

        {/* Logout Confirmation Modal */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
            <div className="bg-white rounded-lg shadow-2xl max-w-sm mx-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <LogOut className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Confirm Logout</h3>
                </div>
                
                <p className="text-sm text-gray-600">
                  Are you sure you want to logout? You will be returned to the login screen. Make sure you've saved any unsaved changes.
                </p>
              </div>

              <div className="px-6 py-4 border-t bg-gray-50 flex gap-3 justify-end rounded-b-lg">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}

      </DialogContent>
    </Dialog>
  );
}


