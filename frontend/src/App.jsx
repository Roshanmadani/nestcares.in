import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import LaunchCeremony from './components/LaunchCeremony';
import { mockDb } from './utils/mockDb';
import { settingsAPI, servicesAPI, testimonialsAPI, faqsAPI, apiClient } from './services/api';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingButtons from './components/FloatingButtons';
import MobileBottomNav from './components/MobileBottomNav';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/common/ErrorBoundary';

import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import SubServiceDetail from './pages/SubServiceDetail';
import BookService from './pages/BookService';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Dashboard from './admin/Dashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import NotFound from './pages/NotFound';

import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/common/ToastContext';

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Launch ceremony: www.nestcares.in/launch or www.nestcares.in/?launch
  const [showLaunch, setShowLaunch] = useState(
    () => location.pathname === '/launch' || new URLSearchParams(location.search).has('launch')
  );
  const finishLaunch = () => {
    setShowLaunch(false);
    navigate('/', { replace: true });
    document.title = 'Nest Cares | #1 Home Healthcare & Nursing Services in Nizamabad';
    window.scrollTo(0, 0);
  };
  
  // Public Config & Content States - Pre-load from local mock cache for instant rendering
  const [services, setServices] = useState(mockDb.getServices(false));
  const [testimonials, setTestimonials] = useState(mockDb.getTestimonials());
  const [faqs, setFaqs] = useState(mockDb.getFaqs());
  const [doctors, setDoctors] = useState(mockDb.getDoctors());
  const [settings, setSettings] = useState(mockDb.getSettings());
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      // Parallelize all initial fetches to resolve concurrently
      const [resSettings, resServices, resTestimonials, resFaqs, resDocs] = await Promise.allSettled([
        settingsAPI.getAll().catch(() => null),
        servicesAPI.getAll().catch(() => null),
        testimonialsAPI.getAll().catch(() => null),
        faqsAPI.getAll().catch(() => null),
        apiClient.get('/doctors').catch(() => null)
      ]);

      if (resSettings.status === 'fulfilled' && resSettings.value?.success) {
        // { web, contact, homepage, ... } — keep cached values for any key the API lacks
        setSettings(prev => ({ ...prev, ...resSettings.value.data }));
      }

      if (resServices.status === 'fulfilled' && resServices.value?.success) {
        setServices(resServices.value.data);
      }

      if (resTestimonials.status === 'fulfilled' && resTestimonials.value?.success) {
        setTestimonials(resTestimonials.value.data);
      }

      if (resFaqs.status === 'fulfilled' && resFaqs.value?.success) {
        setFaqs(resFaqs.value.data);
      }

      let mockDocs = mockDb.getDoctors();
      if (resDocs.status === 'fulfilled' && resDocs.value?.data?.success) {
        mockDocs = resDocs.value.data.data;
      }
      setDoctors(mockDocs);
    } catch (err) {
      console.log('[System] Initializing localized database cache...');
      window.useMockDb = true;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Maximum 650ms loading presentation timer to bypass cold starts
    const timer = setTimeout(() => {
      setLoading(false);
    }, 650);
    return () => clearTimeout(timer);
  }, []);

  // Update Favicon & Title from brand settings dynamically
  useEffect(() => {
    document.title = settings?.web?.seoTitle || (settings?.web?.companyName ? `${settings.web.companyName} - Home Healthcare` : "Nest Cares - Best Home Healthcare Services in Nizamabad");
    
    if (settings?.web?.faviconUrl) {
      const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = settings.web.faviconUrl.startsWith('/') ? `http://localhost:5000${settings.web.faviconUrl}` : settings.web.faviconUrl;
      document.getElementsByTagName('head')[0].appendChild(link);
    }

    if (settings?.web?.seoDescription) {
      const meta = document.querySelector("meta[name='description']") || document.createElement('meta');
      meta.name = 'description';
      meta.content = settings.web.seoDescription;
      document.getElementsByTagName('head')[0].appendChild(meta);
    }
  }, [settings]);

  if (showLaunch) {
    return (
      <AnimatePresence>
        <LaunchCeremony key="launch" onDone={finishLaunch} />
      </AnimatePresence>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#fafafb] text-slate-800 font-sans select-none relative overflow-hidden">
        {/* Ambient background glow */}
        
        {/* Pulsing Logo and Loader */}
        <div className="relative flex flex-col items-center justify-center gap-4 z-10">
          <motion.img
            src="/logo.png"
            alt="Nest Cares Logo"
            className="h-16 md:h-20 w-auto object-contain"
            animate={{
              scale: [0.97, 1.03, 0.97],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <div className="text-[10px] font-bold text-teal-800 uppercase tracking-widest animate-pulse mt-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Loading Nest Cares Healthcare...</span>
          </div>
        </div>
      </div>
    );
  }

  // Check if current page is admin tab or login screen to omit public layout
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isLoginRoute = location.pathname.startsWith('/login');
  const isDoctorRoute = location.pathname.startsWith('/doctor');
  const hideLayout = isAdminRoute || isLoginRoute || isDoctorRoute;
  const isBookingRoute = location.pathname === '/book';

  return (
    <>
      <style>{`
        :root {
          --brand-primary: ${settings?.web?.primaryColor || '#0f766e'};
          --brand-secondary: ${settings?.web?.secondaryColor || '#134e4a'};
          --brand-accent: ${settings?.web?.accentColor || '#059669'};
        }
      `}</style>
      <ScrollToTop />
      {!hideLayout && <Navbar webSettings={settings?.web} />}
      
      <main className={hideLayout ? '' : `min-h-[80vh] pt-20 sm:pt-24 ${isBookingRoute ? 'pb-0' : 'pb-24'} md:pb-0`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <Home 
              homepageSettings={settings?.homepage} 
              contactSettings={settings?.contact} 
              services={services} 
              testimonials={testimonials} 
              faqs={faqs} 
              doctors={doctors}
            />
          } />
          <Route path="/about" element={<About doctors={doctors} founders={settings?.homepage?.founders} />} />
          <Route path="/about-us" element={<About doctors={doctors} founders={settings?.homepage?.founders} />} />
          <Route path="/services" element={<Services services={services} />} />
          <Route path="/services/:slug" element={<ServiceDetail services={services} contactSettings={settings?.contact} />} />
          <Route path="/services/:slug/:subSlug" element={<SubServiceDetail services={services} contactSettings={settings?.contact} />} />
          <Route path="/book" element={<BookService services={services} />} />
          <Route path="/contact" element={<Contact contactSettings={settings?.contact} />} />
          
          {/* Admin Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/launch" element={null} />
          
          {/* Doctor Portal */}
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          
          {/* Admin Protected Dashboard Tab */}
          <Route path="/admin" element={<Dashboard refreshPublicData={fetchData} />} />

          {/* 404 Catch-All Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!hideLayout && <Footer webSettings={settings?.web} contactSettings={settings?.contact} />}
      {/* The booking page has its own sticky action bar on phones */}
      {!hideLayout && <FloatingButtons contactSettings={settings?.contact} hideOnMobile={isBookingRoute} />}
      {!hideLayout && !isBookingRoute && <MobileBottomNav contactSettings={settings?.contact} />}
    </>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <AppContent />
          </Router>
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
