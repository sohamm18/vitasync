import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Card, CardContent, CardHeader } from './components/ui/card';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate a network request delay for the "loading" animation
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gray-50">
      
      {/* --- Animated Background Mesh --- */}
      {/* This creates the moving gradient effect */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-50 via-white to-blue-100 animate-gradient-x opacity-80" />
      
      {/* Decorative floating blobs for depth */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], rotate: [0, 10, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"
      />
      <motion.div 
        animate={{ scale: [1, 1.2, 1], rotate: [0, -20, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"
      />

      {/* --- Main Card with Entry Animation --- */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="z-10 w-full max-w-md px-4"
      >
        <Card className="w-full border-none bg-transparent">
          
          <CardHeader className="space-y-4 text-center pt-8 pb-2 flex flex-col items-center">
            {/* Floating Logo Animation with Shadow */}
            <motion.div 
              animate={{ 
                y: [0, -12, 0],
                boxShadow: [
                  "0 10px 30px rgba(0, 0, 0, 0.1)",
                  "0 20px 50px rgba(0, 0, 0, 0.2)",
                  "0 10px 30px rgba(0, 0, 0, 0.1)"
                ]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="p-6 w-60 h-60 flex items-center justify-center rounded-3xl"
            >
              <img 
                src="/gpt vita.png" 
                alt="Vitasync Logo" 
                className="w-full h-full object-contain"
              />
            </motion.div>
            
            <div className="space-y-1">
              <motion.h1 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold tracking-tight text-gray-900"
              >
                Welcome Back - Dr Ajit V
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 0.3 }}
                className="text-sm text-gray-500"
              >
                Sign in to Vitasync Workspace
              </motion.p>
            </div>
          </CardHeader>

          <CardContent className="p-8 pt-6">
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Username Input with Slide-in Animation */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-2 text-left"
              >
                <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-gray-500 ml-1">
                  Username or Email
                </Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="Enter your username or email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-50/50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 h-12 rounded-xl transition-all duration-300"
                />
              </motion.div>

              {/* Password Input with Slide-in Animation */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-2 text-left"
              >
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-gray-500 ml-1">
                    Password
                  </Label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    Forgot?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-gray-50/50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 h-12 rounded-xl transition-all duration-300"
                />
              </motion.div>

              {/* Button with Click Physics (Scale down on tap) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-600/30 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Login"
                  )}
                </motion.button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
        
        {/* Footer Text */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-xs text-gray-400 mt-8"
        >
          Protected by Vitasync Security • v1.0.2
        </motion.p>
      </motion.div>
    </div>
  );
}