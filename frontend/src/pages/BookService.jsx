import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ShieldCheck, Clock, BadgeCheck } from 'lucide-react';
import BookingForm from '../components/BookingForm';

const BookService = ({ services }) => {
  const location = useLocation();
  const preSelectedService = location.state?.selectService || '';
  const preSelectedSubService = location.state?.selectSubService || '';
  const preSelectedMobile = location.state?.quickMobile || '';
  const preSelectedAddress = location.state?.quickArea ? `${location.state.quickArea}, Nizamabad` : '';

  useEffect(() => {
    document.title = "Book Home Healthcare Services in Nizamabad | Nest Cares";
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-32 md:pb-16 font-sans">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-[1.9rem] sm:text-4xl font-black text-slate-950 tracking-[-0.03em] leading-tight">
            Book care at home
          </h1>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] font-semibold text-slate-600">
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-400" /> Call-back in 15 min</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-slate-400" /> No advance payment</span>
            <span className="flex items-center gap-1.5"><BadgeCheck className="w-4 h-4 text-slate-400" /> Certified staff</span>
          </div>
        </div>

        <BookingForm
          services={services}
          preSelectedCategory={preSelectedService}
          preSelectedSubService={preSelectedSubService}
          preSelectedMobile={preSelectedMobile}
          preSelectedAddress={preSelectedAddress}
        />
      </div>
    </div>
  );
};

export default BookService;
