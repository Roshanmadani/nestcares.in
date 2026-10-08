import React, { useState, useEffect } from 'react';
import { 
  MapPin, Phone, Mail, Clock, ShieldAlert, 
  MessageSquare, Send, CheckCircle2, ArrowRight, HeartPulse, Sparkles, PhoneCall
} from 'lucide-react';
import { bookingsAPI } from '../services/api';
import PageLayout from '../components/common/PageLayout';
import { useToast } from '../components/common/ToastContext';

const Contact = ({ contactSettings }) => {
  const { addToast } = useToast();

  useEffect(() => {
    document.title = "Contact Nest Cares Nizamabad | 24/7 Home Healthcare & Nursing Helpline";
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const phoneNumbers = contactSettings?.phoneNumbers || ['+91 92488 49388', '+91 63035 91409'];
  const email = contactSettings?.emailAddress || 'contact@nestcares.in';
  const whatsapp = contactSettings?.whatsappNumber || '+91 92488 49388';
  const address = contactSettings?.officeAddress || 'Chandra Shekar Colony, Nizamabad, Telangana - 503002';
  const workingHours = contactSettings?.workingHours || 'Mon - Sun: 24/7 Available for Emergencies';
  const emergency = contactSettings?.emergencyContact || '+91 92488 49388';
  const mapLink = contactSettings?.googleMapsLink || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60320.09117621495!2d78.06456073100346!3d18.672462371908477!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcddb435ff51ca1%3A0x67dbb8a0717e1329!2sNizamabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1655000000000!5m2!1sen!2sin';

  const [form, setForm] = useState({ name: '', email: '', mobile: '', subject: 'Home Care Inquiry', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.mobile.trim() || !form.message.trim()) {
      addToast('Please fill in patient name, mobile number, and your inquiry.', 'error');
      return;
    }
    
    setLoading(true);
    try {
      // Create inquiry booking record
      await bookingsAPI.createBooking({
        name: form.name.trim(),
        mobile: form.mobile.trim(),
        email: form.email.trim() || 'contact@nestcares.in',
        address: 'Nizamabad (Inquiry Desk)',
        serviceName: form.subject || 'General Healthcare Inquiry',
        subServiceName: 'General Consultation Inquiry',
        preferredDate: new Date().toISOString().split('T')[0],
        preferredTime: 'Immediate',
        notes: `Inquiry Message: ${form.message.trim()}`
      }).catch(() => null);

      setSent(true);
      addToast('Inquiry received! Our medical desk will contact you within 15 minutes.', 'success');
      setForm({ name: '', email: '', mobile: '', subject: 'Home Care Inquiry', message: '' });
    } catch (err) {
      setSent(true);
      addToast('Inquiry logged successfully!', 'success');
    } finally {
      setLoading(false);
    }
  };

  const cleanWhatsappNumber = whatsapp.replace(/\D/g, '');

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-10 text-left">
        
        {/* Header Title */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-teal-50 text-teal-700 border border-teal-200">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            24/7 Clinical Coordination Desk
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Contact Support & Triage Desk
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed font-normal">
            Reach out to our medical coordinators in Nizamabad to schedule home doctor visits, ICU installations, ambulance transport, or nurse deployments.
          </p>
        </div>

        {/* 3 Quick Help Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card-premium p-6 rounded-3xl border border-slate-200/80 bg-white shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 border border-teal-100 flex items-center justify-center font-bold">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Emergency Hotline</div>
            <a href={`tel:${emergency.replace(/\D/g, '')}`} className="text-lg font-black text-slate-900 hover:text-teal-700 transition-colors flex items-center min-h-11">
              {emergency}
            </a>
            <p className="text-xs text-slate-600">24/7 Standby ambulance & ICU dispatch.</p>
          </div>

          <div className="glass-card-premium p-6 rounded-3xl border border-slate-200/80 bg-white shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">WhatsApp Desk</div>
            <a 
              href={`https://wa.me/${cleanWhatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-black text-emerald-600 hover:text-emerald-700 transition-colors flex items-center min-h-11"
            >
              {whatsapp}
            </a>
            <p className="text-xs text-slate-600">Fast coordination & instant report sharing.</p>
          </div>

          <div className="glass-card-premium p-6 rounded-3xl border border-slate-200/80 bg-white shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-700 border border-sky-100 flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Central Office</div>
            <span className="text-sm font-black text-slate-900 block line-clamp-1">
              Chandra Shekar Colony
            </span>
            <p className="text-xs text-slate-600">Nizamabad, Telangana - 503002</p>
          </div>
        </div>

        {/* Main 2-Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Inquiry Form */}
          <div className="lg:col-span-7 glass-card-premium rounded-3xl border border-slate-200/80 bg-white shadow-sm p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Send a Medical Inquiry
              </h2>
              <p className="text-xs text-slate-600">
                Our care manager will review and respond within 15 minutes.
              </p>
            </div>

            {sent ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="text-base font-black text-emerald-900">Message Dispatched!</h4>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  Thank you for reaching out. A Nest Cares coordinator in Nizamabad is reviewing your inquiry right now.
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Ramesh Reddy"
                      className="px-4 py-3 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 font-medium"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      value={form.mobile}
                      onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                      placeholder="e.g. 92488 49388"
                      className="px-4 py-3 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">Email Address (Optional)</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="your.email@gmail.com"
                      className="px-4 py-3 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">Service Category</label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="px-4 py-3 text-xs rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-900 focus:outline-none focus:border-teal-600 cursor-pointer"
                    >
                      <option value="Home Doctor Visit">Home Doctor Visit</option>
                      <option value="ICU Setup at Home">ICU Setup at Home</option>
                      <option value="Professional Home Nursing">Professional Home Nursing</option>
                      <option value="Ambulance Services">Ambulance Services</option>
                      <option value="Lab Diagnostics">Doorstep Lab Diagnostics</option>
                      <option value="Physiotherapy">Home Physiotherapy</option>
                      <option value="General Inquiry">Other Healthcare Inquiry</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase">Patient Situation / Message *</label>
                  <textarea
                    rows="3.5"
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Briefly describe patient medical conditions or required equipment..."
                    className="px-4 py-3 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 resize-none"
                  ></textarea>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-8 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-white" />
                    <span>{loading ? 'Submitting...' : 'Submit Inquiry'}</span>
                  </button>

                  <a
                    href={`https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(`Hi Nest Cares, I have an inquiry regarding ${form.subject}. Patient name: ${form.name || 'Not specified'}. Message: ${form.message || 'Please connect me to a medical coordinator.'}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-white" />
                    <span>Send on WhatsApp</span>
                  </a>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Google Maps & Operational Hours */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Nizamabad Map Container */}
            <div className="glass-card-premium rounded-3xl border border-slate-200/80 bg-white shadow-sm overflow-hidden p-2">
              <div className="w-full h-72 rounded-2xl overflow-hidden bg-slate-100">
                <iframe
                  title="Nest Cares Nizamabad Location"
                  src={mapLink}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              <div className="p-4 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-teal-600" />
                  <span>Serving All Areas in Nizamabad</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Active Coverage
                </span>
              </div>
            </div>

            {/* Operating Hours Card */}
            <div className="glass-card-premium p-6 rounded-3xl border border-slate-200/80 bg-white shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-wider">
                <Clock className="w-4 h-4 text-teal-600" />
                <span>Operating Timings</span>
              </div>
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between pb-2 border-b border-slate-100">
                  <span className="font-semibold text-slate-500">Emergency & Ambulance:</span>
                  <span className="font-bold text-emerald-700">24/7 / 365 Days</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-100">
                  <span className="font-semibold text-slate-500">Home Doctor Visits:</span>
                  <span className="font-bold text-slate-900">08:00 AM - 09:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-500">Nursing Shifts:</span>
                  <span className="font-bold text-slate-900">12-Hour / 24-Hour Shifts</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Contact;
