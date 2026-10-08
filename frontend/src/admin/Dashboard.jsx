import React, { useCallback, useEffect, useState } from 'react';
import { Navigate, useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  LayoutDashboard, CalendarCheck, UserCheck, Activity, FileText, Settings as SettingsIcon,
  LogOut, ExternalLink, MoreHorizontal, ChevronRight
} from 'lucide-react';
import { bookingsAPI, doctorsAPI, servicesAPI, settingsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Sheet, cx } from './ui';
import OverviewSection from './sections/OverviewSection';
import BookingsSection from './sections/BookingsSection';
import DoctorsSection from './sections/DoctorsSection';
import ServicesSection from './sections/ServicesSection';
import ContentSection from './sections/ContentSection';
import SettingsSection from './sections/SettingsSection';

const NAV = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'bookings', label: 'Bookings', icon: CalendarCheck },
  { id: 'doctors', label: 'Doctors', icon: UserCheck },
  { id: 'services', label: 'Services', icon: Activity },
  { id: 'content', label: 'Website content', short: 'Content', icon: FileText },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
];

// Phones show the first four in the tab bar; the rest live under "More"
const MOBILE_TABS = NAV.slice(0, 4);
const MORE_ITEMS = NAV.slice(4);

const POLL_MS = 30000;

const Dashboard = ({ refreshPublicData }) => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const tab = NAV.some(n => n.id === params.get('tab')) ? params.get('tab') : 'overview';
  const openBookingId = params.get('booking');
  const statusParam = params.get('status') || 'all';

  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [doctorsLoading, setDoctorsLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [settings, setSettings] = useState({});
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [editingFullPage, setEditingFullPage] = useState(false);

  const loadBookings = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setBookingsLoading(true);
    try {
      const res = await bookingsAPI.getBookings();
      if (res.success) setBookings(res.data || []);
    } catch (err) {
      console.error('[Admin] bookings', err);
    } finally {
      setBookingsLoading(false);
    }
  }, []);

  const loadDoctors = useCallback(async () => {
    try {
      const res = await doctorsAPI.getAll();
      if (res.success) setDoctors(res.data || []);
    } catch (err) {
      console.error('[Admin] doctors', err);
    } finally {
      setDoctorsLoading(false);
    }
  }, []);

  const loadServices = useCallback(async () => {
    try {
      const res = await servicesAPI.getAllIncludingHidden();
      if (res.success) setServices(res.data || []);
    } catch (err) {
      console.error('[Admin] services', err);
    } finally {
      setServicesLoading(false);
    }
  }, []);

  const loadSettings = useCallback(async () => {
    try {
      const res = await settingsAPI.getAll();
      if (res.success) setSettings(res.data || {});
    } catch (err) {
      console.error('[Admin] settings', err);
    } finally {
      setSettingsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    loadBookings();
    loadDoctors();
    loadServices();
    loadSettings();
  }, [token, loadBookings, loadDoctors, loadServices, loadSettings]);

  // Keep the bookings list fresh while the panel is open and visible
  useEffect(() => {
    if (!token) return;
    const id = setInterval(() => {
      if (document.visibilityState === 'visible') loadBookings({ silent: true });
    }, POLL_MS);
    return () => clearInterval(id);
  }, [token, loadBookings]);

  if (!token) return <Navigate to="/login" replace />;

  const go = (id, extra = {}) => {
    const next = { tab: id };
    if (extra.status) next.status = extra.status;
    setParams(next);
    setMoreOpen(false);
    setEditingFullPage(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const openBooking = (id) => {
    const next = Object.fromEntries(params.entries());
    if (id) {
      next.booking = id;
      if (tab === 'overview') next.tab = 'overview';
    } else {
      delete next.booking;
    }
    setParams(next);
  };

  const handleBookingChanged = (updated, deletedId) => {
    if (deletedId) setBookings(list => list.filter(b => b._id !== deletedId));
    else if (updated) setBookings(list => list.map(b => (b._id === updated._id ? updated : b)));
  };

  const signOut = () => {
    if (!window.confirm('Sign out of the admin panel?')) return;
    logout();
    navigate('/login', { replace: true });
  };

  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  const publicChanged = () => refreshPublicData?.();
  const current = NAV.find(n => n.id === tab);
  const initials = (user?.name || 'A').split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();

  const renderNavButton = (item) => {
    const active = tab === item.id;
    return (
      <button
        key={item.id}
        type="button"
        onClick={() => go(item.id)}
        className={cx(
          'w-full h-10 px-3 rounded-xl flex items-center gap-3 text-sm font-semibold transition-colors cursor-pointer',
          active ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white hover:bg-white/5'
        )}
      >
        <item.icon className="w-4 h-4" />
        <span className="flex-1 text-left">{item.label}</span>
        {item.id === 'bookings' && pendingCount > 0 && (
          <span className={cx('min-w-5 h-5 px-1.5 rounded-full text-[11px] font-bold flex items-center justify-center', active ? 'bg-amber-400 text-slate-950' : 'bg-amber-400/90 text-slate-950')}>
            {pendingCount}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-[#f6f7f9] text-slate-800 font-sans lg:flex">
      {/* ---------- Desktop sidebar ---------- */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-[#0b0b0d] text-white sticky top-0 h-screen">
        <div className="px-5 h-16 flex items-center gap-2.5 border-b border-white/10">
          <img src="/logo.png" alt="" className="h-8 w-8 rounded-lg bg-white p-1 object-contain" />
          <div className="leading-tight">
            <div className="text-sm font-black">{settings?.web?.companyName || 'Nest Cares'}</div>
            <div className="text-[11px] text-slate-400">Admin panel</div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV.map(renderNavButton)}
        </nav>
        <div className="p-3 border-t border-white/10 space-y-1">
          <Link to="/" target="_blank" className="h-10 px-3 rounded-xl flex items-center gap-3 text-sm font-semibold text-slate-400 hover:text-white hover:bg-white/5">
            <ExternalLink className="w-4 h-4" /> View website
          </Link>
          <div className="flex items-center gap-3 px-3 pt-2">
            <div className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center text-[12px] font-bold shrink-0">{initials}</div>
            <div className="min-w-0 flex-1 leading-tight">
              <div className="text-[13px] font-semibold truncate">{user?.name || 'Administrator'}</div>
              <div className="text-[11px] text-slate-400 truncate">{user?.email}</div>
            </div>
          </div>
          <button type="button" onClick={signOut} className="w-full h-10 px-3 rounded-xl flex items-center gap-3 text-sm font-semibold text-rose-300 hover:text-rose-200 hover:bg-rose-500/10 cursor-pointer">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* ---------- Main ---------- */}
      <div className="flex-1 min-w-0">
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-30 bg-[#f6f7f9]/90 backdrop-blur border-b border-slate-200/70">
          <div className="h-14 px-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <img src="/logo.png" alt="" className="h-8 w-8 rounded-lg bg-white p-1 object-contain border border-slate-200" />
              <div className="leading-tight min-w-0">
                <div className="text-[11px] font-semibold text-slate-500">Admin</div>
                <div className="text-[15px] font-black text-slate-950 truncate">{current.short || current.label}</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMoreOpen(true)}
              aria-label="Account menu"
              className="h-9 w-9 rounded-full bg-slate-950 text-white text-[12px] font-bold flex items-center justify-center cursor-pointer"
            >
              {initials}
            </button>
          </div>
        </header>

        <main className={cx('px-4 sm:px-6 lg:px-10 py-5 lg:py-8 max-w-6xl mx-auto', editingFullPage ? 'pb-8' : 'pb-28 lg:pb-10')}>
          <div key={tab} className="admin-section-in">
          {tab === 'overview' && (
            <OverviewSection
              user={user}
              bookings={bookings}
              loading={bookingsLoading}
              servicesCount={services.length}
              doctorsCount={doctors.length}
              onGo={go}
              onOpenBooking={(id) => setParams({ tab: 'bookings', booking: id, status: 'pending' })}
            />
          )}
          {tab === 'bookings' && (
            <BookingsSection
              key={statusParam}
              bookings={bookings}
              loading={bookingsLoading}
              onRefresh={() => loadBookings()}
              onBookingChanged={handleBookingChanged}
              services={services}
              initialStatus={statusParam}
              openBookingId={openBookingId}
              onOpenBooking={openBooking}
            />
          )}
          {tab === 'doctors' && (
            <DoctorsSection doctors={doctors} loading={doctorsLoading} onChanged={() => { loadDoctors(); publicChanged(); }} />
          )}
          {tab === 'services' && (
            <ServicesSection
              services={services}
              loading={servicesLoading}
              onChanged={() => { loadServices(); publicChanged(); }}
              onEditingChange={setEditingFullPage}
            />
          )}
          {tab === 'content' && (
            <ContentSection settings={settings} settingsLoaded={settingsLoaded} onSettingsSaved={() => { loadSettings(); publicChanged(); }} onPublicChange={publicChanged} />
          )}
          {tab === 'settings' && (
            <SettingsSection settings={settings} settingsLoaded={settingsLoaded} onSettingsSaved={() => { loadSettings(); publicChanged(); }} />
          )}
          </div>
        </main>
      </div>

      {/* ---------- Mobile tab bar ---------- */}
      {!editingFullPage && (
        <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-slate-200 pb-[env(safe-area-inset-bottom)]">
          <div className="grid grid-cols-5 h-16">
            {MOBILE_TABS.map(item => {
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => go(item.id)}
                  className={cx('relative flex flex-col items-center justify-center gap-1 text-[11px] font-semibold cursor-pointer', active ? 'text-slate-950' : 'text-slate-400')}
                >
                  <span className={cx('h-7 w-12 rounded-full flex items-center justify-center transition-colors', active && 'bg-slate-950/[0.07]')}>
                    <item.icon className={cx('w-5 h-5', active && 'stroke-[2.4]')} />
                  </span>
                  {item.short || item.label}
                  {item.id === 'bookings' && pendingCount > 0 && (
                    <span className="absolute top-1.5 left-1/2 ml-2 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                      {pendingCount}
                    </span>
                  )}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setMoreOpen(true)}
              className={cx('flex flex-col items-center justify-center gap-1 text-[11px] font-semibold cursor-pointer', MORE_ITEMS.some(m => m.id === tab) ? 'text-slate-950' : 'text-slate-400')}
            >
              <span className={cx('h-7 w-12 rounded-full flex items-center justify-center', MORE_ITEMS.some(m => m.id === tab) && 'bg-slate-950/[0.07]')}>
                <MoreHorizontal className="w-5 h-5" />
              </span>
              More
            </button>
          </div>
        </nav>
      )}

      {/* ---------- Mobile "More" sheet ---------- */}
      <Sheet open={moreOpen} onClose={() => setMoreOpen(false)} title={user?.name || 'Administrator'} subtitle={user?.email}>
        <div className="space-y-1 -mx-2">
          {MORE_ITEMS.map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => go(item.id)}
              className="w-full h-12 px-3 rounded-xl flex items-center gap-3 text-[15px] font-semibold text-slate-800 hover:bg-slate-100 cursor-pointer"
            >
              <item.icon className="w-5 h-5 text-slate-500" />
              <span className="flex-1 text-left">{item.label}</span>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </button>
          ))}
          <Link
            to="/"
            target="_blank"
            onClick={() => setMoreOpen(false)}
            className="w-full h-12 px-3 rounded-xl flex items-center gap-3 text-[15px] font-semibold text-slate-800 hover:bg-slate-100"
          >
            <ExternalLink className="w-5 h-5 text-slate-500" />
            <span className="flex-1 text-left">View website</span>
            <ChevronRight className="w-4 h-4 text-slate-300" />
          </Link>
          <div className="h-px bg-slate-100 my-2" />
          <button
            type="button"
            onClick={signOut}
            className="w-full h-12 px-3 rounded-xl flex items-center gap-3 text-[15px] font-semibold text-rose-600 hover:bg-rose-50 cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            Sign out
          </button>
        </div>
      </Sheet>
    </div>
  );
};

export default Dashboard;
