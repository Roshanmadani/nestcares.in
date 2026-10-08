import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SearchX, PhoneCall, ArrowLeft } from 'lucide-react';

// Shown when a service / treatment URL doesn't match anything in the catalog
const ServiceNotFound = ({ phone = '+91 92488 49388', what = 'service' }) => {
  useEffect(() => {
    document.title = `${what === 'service' ? 'Service' : 'Treatment'} not found | Nest Cares`;
  }, [what]);

  return (
  <div className="min-h-[60vh] flex items-center justify-center px-4 py-16 font-sans">
    <div className="liquid-glass rounded-[1.75rem] p-8 sm:p-10 max-w-md w-full text-center">
      <div className="mx-auto h-14 w-14 rounded-2xl bg-slate-950 text-white flex items-center justify-center">
        <SearchX className="w-6 h-6" />
      </div>
      <h1 className="mt-5 text-2xl font-black text-slate-950 tracking-tight">We couldn't find that {what}</h1>
      <p className="mt-2 text-[15px] text-slate-600">It may have been renamed or removed. Browse all services, or call us and we'll help right away.</p>
      <div className="mt-7 flex flex-col gap-3">
        <Link to="/services" className="btn-liquid-ink h-12 rounded-full flex items-center justify-center gap-2 font-bold text-[15px]">
          <ArrowLeft className="w-4 h-4" /> All services
        </Link>
        <a href={`tel:${phone.replace(/[^+\d]/g, '')}`} className="h-12 rounded-full border border-slate-200 bg-white flex items-center justify-center gap-2 font-bold text-[15px] text-slate-900">
          <PhoneCall className="w-4 h-4" /> Call {phone}
        </a>
      </div>
    </div>
  </div>
  );
};

export default ServiceNotFound;
