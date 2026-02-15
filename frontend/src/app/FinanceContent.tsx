import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  X,
  Check,
  User
} from 'lucide-react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { useAppContext } from './context/AppContext'; // Ensure this path matches your project structure

// Initial Mock Data including Patient IDs for demo purposes
const INITIAL_TRANSACTIONS = [
  { id: 1, patientId: '101', desc: 'Consultation Fee - Rohan Sharma', date: '2026-02-14', type: 'Income', amount: 500, status: 'Completed', method: 'UPI' },
  { id: 2, patientId: null, desc: 'Medicine Stock Purchase', date: '2026-02-13', type: 'Expense', amount: 12400, status: 'Completed', method: 'Bank Transfer' },
  { id: 3, patientId: '102', desc: 'OPD Charges - Ananya Gupta', date: '2026-02-13', type: 'Income', amount: 800, status: 'Pending', method: 'Cash' },
];

export default function FinanceContent() {
  const { activePatient } = useAppContext(); // Retrieve the active patient from context
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [activeFilter, setActiveFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- Form State ---
  const [newTx, setNewTx] = useState({
    desc: '',
    amount: '',
    type: 'Income',
    method: 'Cash',
    status: 'Completed'
  });

  // --- Financial Calculation Logic ---
  const financials = useMemo(() => {
    const revenue = transactions
      .filter(t => t.type === 'Income' && t.status === 'Completed')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expenses = transactions
      .filter(t => t.type === 'Expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const profit = revenue - expenses;
    const margin = revenue > 0 ? ((profit / revenue) * 100).toFixed(1) : 0;

    return { revenue, expenses, profit, margin };
  }, [transactions]);

  // --- Handlers ---
  const handleAddTransaction = () => {
    if (!newTx.amount || !newTx.desc) return;

    const transaction = {
      id: Date.now(),
      // 🚀 LINKING LOGIC: Assign active patient ID if it exists
      patientId: activePatient?.id || null,
      desc: activePatient 
        ? `${newTx.desc} - ${activePatient.name}` 
        : newTx.desc,
      date: new Date().toISOString().split('T')[0],
      type: newTx.type,
      amount: parseFloat(newTx.amount),
      status: newTx.status,
      method: newTx.method
    };

    setTransactions([transaction, ...transactions]);
    
    // Reset and Close
    setNewTx({ desc: '', amount: '', type: 'Income', method: 'Cash', status: 'Completed' });
    setIsModalOpen(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6 relative">
      
      {/* --- Header --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Financial Overview</h2>
          <p className="text-gray-500 text-sm">Track clinic revenue and linked patient billing</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setIsModalOpen(true)} className="rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg">
            <Plus className="w-4 h-4 mr-2" /> Add Transaction
          </Button>
        </div>
      </div>

      {/* --- Stat Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none bg-white shadow-lg rounded-2xl overflow-hidden">
          <CardContent className="p-6 relative">
            <div className="absolute top-0 right-0 p-4 opacity-10"><TrendingUp size={48} className="text-blue-600" /></div>
            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-2">{formatCurrency(financials.revenue)}</h3>
            <div className="mt-2 text-sm text-green-600 flex items-center gap-1"><ArrowUpRight size={14} /> Income</div>
          </CardContent>
        </Card>

        <Card className="border-none bg-white shadow-lg rounded-2xl overflow-hidden">
          <CardContent className="p-6 relative">
            <div className="absolute top-0 right-0 p-4 opacity-10"><TrendingDown size={48} className="text-red-600" /></div>
            <p className="text-sm font-medium text-gray-500">Total Expenses</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-2">{formatCurrency(financials.expenses)}</h3>
            <div className="mt-2 text-sm text-red-600 flex items-center gap-1"><ArrowUpRight size={14} /> Outflow</div>
          </CardContent>
        </Card>

        <Card className="border-none bg-white shadow-lg rounded-2xl overflow-hidden">
          <CardContent className="p-6 relative">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Wallet size={48} className="text-green-600" /></div>
            <p className="text-sm font-medium text-gray-500">Net Profit</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-2">{formatCurrency(financials.profit)}</h3>
            <div className="mt-2 text-sm text-gray-500">{financials.margin}% Margin</div>
          </CardContent>
        </Card>
      </div>

      {/* --- Transactions Table --- */}
      <Card className="border-none shadow-xl bg-white rounded-2xl overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between px-6 py-5 border-b border-gray-100">
          <CardTitle className="text-lg font-semibold text-gray-800">Recent Transactions</CardTitle>
          <div className="flex bg-gray-100 p-1 rounded-lg">
            {['All', 'Income', 'Expense'].map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveFilter(tab)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeFilter === tab ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500">
                <tr>
                  <th className="px-6 py-4 text-left">Description</th>
                  <th className="px-6 py-4 text-left">Date</th>
                  <th className="px-6 py-4 text-left">Method</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.filter(t => activeFilter === 'All' || t.type === activeFilter).map((tx) => (
                  <motion.tr key={tx.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${tx.type === 'Income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          {tx.type === 'Income' ? <ArrowDownRight size={16} /> : <ArrowUpRight size={16} />}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{tx.desc}</p>
                          {tx.patientId && (
                            <p className="text-[10px] text-blue-600 flex items-center gap-1 mt-0.5 font-bold uppercase">
                              <User size={10} /> Linked to ID: {tx.patientId}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{tx.date}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{tx.method}</td>
                    <td className={`px-6 py-4 text-right font-bold ${tx.type === 'Income' ? 'text-green-600' : 'text-gray-900'}`}>
                      {tx.type === 'Income' ? '+' : '-'} {formatCurrency(tx.amount)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* --- ADD TRANSACTION MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="p-6 border-b flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Add New Transaction</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Visual Indicator for Active Patient */}
                {activePatient && (
                  <div className="bg-blue-50 p-3 rounded-xl flex items-center gap-3 border border-blue-100">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white"><User size={14} /></div>
                    <div>
                      <p className="text-xs text-blue-600 font-bold uppercase tracking-wider leading-none">Adding Bill For</p>
                      <p className="text-sm font-bold text-blue-900">{activePatient.name}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setNewTx({...newTx, type: 'Income'})} className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${newTx.type === 'Income' ? 'bg-green-50 border-green-200 text-green-700' : 'border-gray-200 text-gray-500'}`}>
                    <ArrowDownRight /> Income
                  </button>
                  <button onClick={() => setNewTx({...newTx, type: 'Expense'})} className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${newTx.type === 'Expense' ? 'bg-red-50 border-red-200 text-red-700' : 'border-gray-200 text-gray-500'}`}>
                    <ArrowUpRight /> Expense
                  </button>
                </div>

                <div className="space-y-2">
                  <Label>Amount (₹)</Label>
                  <Input type="number" placeholder="0.00" value={newTx.amount} onChange={(e) => setNewTx({...newTx, amount: e.target.value})} className="text-lg font-bold" />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input placeholder="e.g. Consultation Fee" value={newTx.desc} onChange={(e) => setNewTx({...newTx, desc: e.target.value})} />
                </div>

                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <Select value={newTx.method} onValueChange={(val) => setNewTx({...newTx, method: val})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="UPI">UPI</SelectItem>
                      <SelectItem value="Card">Card</SelectItem>
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleAddTransaction} className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
                  <Check className="mr-2" /> Save Transaction
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}