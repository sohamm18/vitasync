import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Pill, 
  FileText, 
  Settings, 
  Activity,
  LogOut 
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';

// --- Configuration ---
const MENU_ITEMS = [
  { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
  { icon: Users, label: 'Patients', path: '/dashboard/patients' },
  { icon: Pill, label: 'Pharmacy', path: '/dashboard/pharmacy' },
  { icon: FileText, label: 'Reports', path: '/dashboard/reports' },
  { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
];

export default function AppleLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex h-screen bg-[#F5F5F7] font-sans selection:bg-blue-500/30">
      
      {/* --- Sidebar (Glassmorphism) --- */}
      <motion.aside 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-64 h-full flex flex-col bg-white/70 backdrop-blur-xl border-r border-white/20 shadow-sm z-50 fixed md:relative"
      >
        {/* Logo Area */}
        <div className="p-8 pb-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Activity className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight text-gray-900">Vitasync</h1>
              <p className="text-xs text-gray-500 font-medium">Medical Suite</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {MENU_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <div key={item.path} className="relative group">
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white shadow-sm rounded-xl border border-gray-100"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                
                <button
                  onClick={() => navigate(item.path)}
                  className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200 
                    ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'}`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                  {item.label}
                </button>
              </div>
            );
          })}
        </nav>

        {/* User Profile (Bottom) */}
        <div className="p-4 border-t border-gray-100/50">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/50 hover:bg-white transition-colors border border-transparent hover:border-gray-100 cursor-pointer group">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-blue-700 font-bold text-sm">
              DR
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">Dr. Rajesh</p>
              <p className="text-xs text-gray-500 truncate">Cardiologist</p>
            </div>
            <LogOut className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
          </div>
        </div>
      </motion.aside>

      {/* --- Main Content Area --- */}
      <main className="flex-1 h-full overflow-y-auto overflow-x-hidden relative">
        <div className="p-8 max-w-7xl mx-auto space-y-8">
          
          {/* Header/Breadcrumb */}
          <motion.header 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-between items-center mb-8"
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                {MENU_ITEMS.find(i => i.path === location.pathname)?.label || 'Dashboard'}
              </h2>
              <p className="text-gray-500 text-sm mt-1">Welcome back, Dr. Rajesh Kumar</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="rounded-full bg-white/50 backdrop-blur-sm border-gray-200">
                Feedback
              </Button>
              <Button className="rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20">
                + New Patient
              </Button>
            </div>
          </motion.header>

          {/* Page Content with Staggered Animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}