import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { resolveImageUrl } from '../utils/url';
import { 
  ShieldCheck, Mail, Lock, ArrowLeft, ArrowRight, Eye, EyeOff, 
  ShieldAlert, RefreshCw, CheckCircle, Sparkles, UserCheck
} from 'lucide-react';

const Login = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [loginType, setLoginType] = useState('admin'); // 'admin' or 'doctor'
  const [email, setEmail] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [logoSrc, setLogoSrc] = useState('/logo.png');

  // Load brand logo settings
  useEffect(() => {
    const settingsStr = localStorage.getItem('mock_settings');
    if (settingsStr) {
      try {
        const settings = JSON.parse(settingsStr);
        if (settings?.web?.logoUrl) {
          const url = settings.web.logoUrl;
          if (url.startsWith('/')) {
            setLogoSrc(url === '/logo.png' ? '/logo.png' : resolveImageUrl(url));
          } else {
            setLogoSrc(url);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Auth redirects
  useEffect(() => {
    if (user) {
      navigate('/admin');
    }
  }, [user, navigate]);

  useEffect(() => {
    const docToken = localStorage.getItem('doctor_token');
    if (docToken) {
      navigate('/doctor/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (loginType === 'admin') {
      if (!email || !password) {
        setError('Please fill in both email and password.');
        setLoading(false);
        return;
      }

      const res = await login(email, password);
      setLoading(false);

      if (res.success) {
        navigate('/admin');
      } else {
        setError(res.message || 'Invalid credentials. Please verify your email and password.');
      }
    } else {
      if (!doctorId || !password) {
        setError('Please fill in both Doctor ID and password.');
        setLoading(false);
        return;
      }

      const doctors = JSON.parse(localStorage.getItem('mock_doctors') || '[]');
      const match = doctors.find(
        d => d && d.doctorId?.toLowerCase() === doctorId.trim().toLowerCase() && d.password === password
      );

      setLoading(false);
      if (match) {
        localStorage.setItem('doctor_token', 'mock-doctor-token-' + Date.now());
        localStorage.setItem('doctor_user', JSON.stringify(match));
        navigate('/doctor/dashboard');
      } else {
        setError('Invalid Doctor ID or password.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafb] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans select-none text-slate-900">
      
      {/* Ambient background soft glow */}

      {/* Top Floating Return Pill */}
      <div className="absolute top-4 sm:top-6 left-4 sm:left-8 z-20">
        <Link 
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-950 transition-all bg-white/90 backdrop-blur-md border border-slate-200/90 hover:border-slate-300 px-4 py-2 rounded-full shadow-xs hover:shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-slate-600" />
          <span>Return to website</span>
        </Link>
      </div>

      {/* Glossy White Luxury Login Card */}
      <div className="w-full max-w-[460px] bg-white/95 backdrop-blur-2xl border border-black/[0.08] rounded-3xl p-6 sm:p-10 shadow-[0_20px_50px_rgba(15,23,42,0.06)] flex flex-col gap-6 relative z-10 my-8">
        
        {/* Brand Emblem */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-200 p-1.5 flex items-center justify-center shadow-xs">
            <img 
              src={logoSrc} 
              alt="Nest Cares" 
              className="h-full w-full object-contain" 
              onError={() => setLogoSrc('/logo.png')}
            />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Nest Cares • Nizamabad
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight leading-tight mt-0.5">
              Portal Authorization
            </h1>
            <p className="text-slate-500 text-xs mt-1">
              Sign in to manage patient bookings & healthcare services
            </p>
          </div>
        </div>

        {/* Segmented Control Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200/80">
          <button
            type="button"
            onClick={() => {
              setLoginType('admin');
              setError('');
            }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              loginType === 'admin' 
                ? 'bg-slate-950 text-white shadow-sm font-black' 
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            Admin Portal
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginType('doctor');
              setError('');
            }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              loginType === 'doctor' 
                ? 'bg-slate-950 text-white shadow-sm font-black' 
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            Doctor Portal
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3.5 rounded-2xl text-left leading-relaxed font-semibold flex items-start gap-2.5 animate-in fade-in">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          
          {loginType === 'admin' ? (
            /* Email Input */
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                Admin Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@nestcares.in"
                  className="w-full h-12 pl-10 pr-4 bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-slate-900 rounded-2xl focus:outline-none transition-all text-slate-900 placeholder:text-slate-400 text-xs font-semibold"
                />
              </div>
            </div>
          ) : (
            /* Doctor ID Input */
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                Doctor Badge ID
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <UserCheck className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                  placeholder="e.g. DOC-101"
                  className="w-full h-12 pl-10 pr-4 bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-slate-900 rounded-2xl focus:outline-none transition-all text-slate-900 placeholder:text-slate-400 text-xs font-semibold"
                />
              </div>
            </div>
          )}

          {/* Password Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">
              Security Password
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-12 pl-10 pr-10 bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-slate-900 rounded-2xl focus:outline-none transition-all text-slate-900 placeholder:text-slate-400 text-xs font-semibold"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                tabIndex="-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Session */}
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 select-none pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 text-slate-900 focus:ring-0 w-3.5 h-3.5 cursor-pointer"
              />
              <span>Remember session</span>
            </label>
            <button 
              type="button"
              onClick={() => alert('Please contact administrator at support@nestcares.in or +91 92488 49388 to reset credentials.')}
              className="text-slate-600 hover:text-slate-950 transition-colors font-semibold"
            >
              Reset access?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-slate-950 hover:bg-black disabled:bg-slate-400 text-white font-bold rounded-full flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-xs uppercase tracking-wider shadow-sm hover:shadow-md cursor-pointer mt-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Authorizing Access...</span>
              </>
            ) : (
              <>
                <span>Sign In to Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>

        {/* Security badges */}
        <div className="flex items-center justify-center gap-4 border-t border-slate-100 pt-4 select-none text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>HIPAA Compliant</span>
          </div>
          <span className="text-slate-300">•</span>
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Login;
