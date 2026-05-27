import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'sonner';
import { useLoginMutation, useSignupMutation } from './authApiSlice.js';
import { setCredentials } from './authSlice.js';
import { Compass, Briefcase, Users, Lock, Mail, User } from 'lucide-react';

/**
 * Centered Minimalist Authentication Portal (Premium Antigravity Light Theme)
 * Restores extreme contrast, maximum readability, and incorporates floating ambient glows.
 */
const AuthPage = ({ onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const dispatch = useDispatch();

  // Form Fields State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('entrepreneur'); // entrepreneur, investor, supplier

  // Mutation Endpoints
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [signup, { isLoading: isSignupLoading }] = useSignupMutation();

  // Client-Side Defensive Input Validation
  const validateForm = () => {
    if (!isLogin && (!name || name.trim().length < 2)) {
      toast.error('Full Name must be at least 2 characters long.');
      return false;
    }
    
    // Strict email format check
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!email || !emailRegex.test(email.trim())) {
      toast.error('Please enter a valid, format-compliant email address.');
      return false;
    }

    if (!password || password.length < 8) {
      toast.error('Security password must be at least 8 characters long.');
      return false;
    }

    return true;
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      email: email.trim(),
      password,
    };

    if (!isLogin) {
      payload.name = name.trim();
      payload.role = role;
    }

    try {
      if (isLogin) {
        const result = await login(payload).unwrap();
        dispatch(setCredentials({ user: result.data.user, token: result.token }));
        toast.success(`Welcome back, ${result.data.user.name}!`);
      } else {
        const result = await signup(payload).unwrap();
        dispatch(setCredentials({ user: result.data.user, token: result.token }));
        toast.success(`Welcome to Zenith, ${result.data.user.name}! Account registered successfully.`);
      }
    } catch (error) {
      const message = error.data?.message || 'Authentication service is offline. Please try again.';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FBFBFB] dark:bg-[#0B0B0B] text-[#111111] dark:text-[#F5F5F5] p-4 font-sans antialiased relative overflow-hidden select-none transition-colors duration-300">
      <Toaster position="top-right" closeButton richColors theme="light" />
      
      {/* Premium Antigravity Ambient Glowing Nodes */}
      <div 
        className="absolute top-[-15%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#8C6D47]/10 dark:bg-[#8C6D47]/5 blur-[150px] pointer-events-none" 
      />
      <div 
        className="absolute bottom-[-15%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#8C6D47]/10 dark:bg-[#8C6D47]/5 blur-[150px] pointer-events-none" 
      />
 
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 220, damping: 26 }}
        className="w-full max-w-md bg-white dark:bg-[#1A1917] border border-[#E5E5E5] dark:border-[#222222] rounded-none shadow-xl p-6 backdrop-blur-xl relative z-10 text-[#111111] dark:text-[#F5F5F5] transition-colors duration-300"
      >
        {onBack && (
          <button 
            type="button"
            onClick={onBack}
            className="absolute left-6 top-6 text-[10px] font-mono uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 hover:text-[#161513] dark:hover:text-[#F4F0EA] transition-colors flex items-center gap-1 cursor-pointer"
          >
            ← Back
          </button>
        )}
        {/* Zenith Minimalist Brand Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-10 h-10 rounded-none bg-[#161513] dark:bg-[#F4F0EA] text-[#F4F0EA] dark:text-[#161513] flex items-center justify-center mb-2 shadow-md">
            <Compass className="w-5 h-5 stroke-[1.8]" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#161513] dark:text-[#F4F0EA]">Zenith</h1>
          <p className="text-[11px] text-[#161513]/70 dark:text-[#F4F0EA]/70 font-semibold mt-0.5 text-center">
            AI-Driven Business Incubation Platform for India
          </p>
        </div>

        {/* Tab Toggle Switch */}
        <div className="grid grid-cols-2 bg-[#FBFBFB] dark:bg-[#121110] border border-[#E5E5E5] dark:border-[#222222] p-0.5 rounded-none mb-6 relative transition-colors duration-200">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`py-1.5 text-xs font-mono font-bold rounded-none relative z-10 transition-colors duration-200 ${
              isLogin ? 'text-[#111111] dark:text-[#F5F5F5]' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`py-1.5 text-xs font-mono font-bold rounded-none relative z-10 transition-colors duration-200 ${
              !isLogin ? 'text-[#111111] dark:text-[#F5F5F5]' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            Register
          </button>
          <motion.div
            layoutId="activeTab"
            transition={{ type: 'spring', stiffness: 250, damping: 28 }}
            className="absolute top-[3px] bottom-[3px] left-[3px] w-[calc(50%-3px)] bg-white dark:bg-[#1A1917] border border-[#E5E5E5] dark:border-[#222222] rounded-none shadow-sm pointer-events-none"
            style={{
              x: isLogin ? '0%' : '100%',
            }}
          />
        </div>

        {/* Interactive Form Panel */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            {isLogin ? (
              // ==========================================
              // SIGN IN FORM FLUID LAYOUT
              // ==========================================
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.12 }}
                className="space-y-3.5"
              >
                {/* Email Input */}
                <div className="space-y-1">
                  <label className="text-[#111111]/70 dark:text-[#F5F5F5]/70 font-mono font-bold text-[10px] tracking-wider uppercase">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.in"
                      className="w-full p-4 pl-12 text-xs bg-white dark:bg-[#1A1917] border border-[#E5E5E5] dark:border-[#222222] rounded-none text-[#111111] dark:text-[#F5F5F5] placeholder-slate-400 dark:placeholder-slate-500 focus:ring-1 focus:ring-[#8C6D47] focus:border-[#8C6D47] focus-visible:outline-none transition-all duration-150"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1">
                  <label className="text-[#111111]/70 dark:text-[#F5F5F5]/70 font-mono font-bold text-[10px] tracking-wider uppercase">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter secure password"
                      className="w-full p-4 pl-12 text-xs bg-white dark:bg-[#1A1917] border border-[#E5E5E5] dark:border-[#222222] rounded-none text-[#111111] dark:text-[#F5F5F5] placeholder-slate-400 dark:placeholder-slate-500 focus:ring-1 focus:ring-[#8C6D47] focus:border-[#8C6D47] focus-visible:outline-none transition-all duration-150"
                      required
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              // ==========================================
              // REGISTRATION FORM FLUID LAYOUT
              // ==========================================
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.12 }}
                className="space-y-3.5"
              >
                {/* Full Name Input */}
                <div className="space-y-1">
                  <label className="text-[#111111]/70 dark:text-[#F5F5F5]/70 font-mono font-bold text-[10px] tracking-wider uppercase">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Rajesh Kumar"
                      className="w-full p-4 pl-12 text-xs bg-white dark:bg-[#1A1917] border border-[#E5E5E5] dark:border-[#222222] rounded-none text-[#111111] dark:text-[#F5F5F5] placeholder-slate-400 dark:placeholder-slate-500 focus:ring-1 focus:ring-[#8C6D47] focus:border-[#8C6D47] focus-visible:outline-none transition-all duration-150"
                      required
                    />
                  </div>
                </div>

                {/* Email Address Input */}
                <div className="space-y-1">
                  <label className="text-[#111111]/70 dark:text-[#F5F5F5]/70 font-mono font-bold text-[10px] tracking-wider uppercase">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="rajesh@incube.in"
                      className="w-full p-4 pl-12 text-xs bg-white dark:bg-[#1A1917] border border-[#E5E5E5] dark:border-[#222222] rounded-none text-[#111111] dark:text-[#F5F5F5] placeholder-slate-400 dark:placeholder-slate-500 focus:ring-1 focus:ring-[#8C6D47] focus:border-[#8C6D47] focus-visible:outline-none transition-all duration-150"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1">
                  <label className="text-[#111111]/70 dark:text-[#F5F5F5]/70 font-mono font-bold text-[10px] tracking-wider uppercase">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      className="w-full p-4 pl-12 text-xs bg-white dark:bg-[#1A1917] border border-[#E5E5E5] dark:border-[#222222] rounded-none text-[#111111] dark:text-[#F5F5F5] placeholder-slate-400 dark:placeholder-slate-500 focus:ring-1 focus:ring-[#8C6D47] focus:border-[#8C6D47] focus-visible:outline-none transition-all duration-150"
                      required
                    />
                  </div>
                </div>

                {/* Role Selection Custom Cards */}
                <div className="space-y-1.5">
                  <label className="text-[#161513]/70 dark:text-[#F4F0EA]/70 font-mono font-bold text-[10px] tracking-wider uppercase">Incubation Role</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'entrepreneur', label: 'Entrepreneur', icon: User },
                      { value: 'investor', label: 'Investor', icon: Users },
                      { value: 'supplier', label: 'Supplier', icon: Briefcase },
                    ].map((item) => {
                      const Icon = item.icon;
                      const active = role === item.value;
                      return (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => setRole(item.value)}
                          className={`flex flex-col items-center justify-center py-2 px-1 rounded-none border text-center transition-all duration-150 ${
                            active
                              ? 'border-[#8C6D47] bg-[#161513]/5 dark:bg-white/5 text-[#111111] dark:text-[#F5F5F5] font-mono font-bold ring-1 ring-[#8C6D47]'
                              : 'border-[#E5E5E5] dark:border-[#222222] hover:border-[#8C6D47] bg-white dark:bg-[#1A1917] text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 mb-1 transition-colors duration-150 ${active ? 'text-[#8C6D47]' : 'text-slate-400 dark:text-slate-500'}`} />
                          <span
                            className={`uppercase tracking-wide transition-colors duration-150 text-[10px] ${
                              active
                                ? 'text-[#111111] dark:text-[#F5F5F5] font-bold'
                                : 'text-slate-500 dark:text-slate-400 font-medium'
                            }`}
                          >
                            {item.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLogin ? isLoginLoading : isSignupLoading}
            className="w-full py-3 bg-[#161513] text-[#F4F0EA] dark:bg-[#F4F0EA] dark:text-[#161513] hover:bg-[#8C6D47] dark:hover:bg-[#8C6D47] dark:hover:text-white rounded-none font-mono font-bold tracking-wider uppercase transition-colors duration-150 disabled:bg-slate-400 flex items-center justify-center gap-2 mt-4 cursor-pointer shadow-md shadow-[#8C6D47]/10"
          >
            {isLogin
              ? isLoginLoading
                ? 'Authenticating...'
                : 'Sign In'
              : isSignupLoading
              ? 'Registering...'
              : 'Create Account'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AuthPage;
