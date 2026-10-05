import React, { useMemo } from 'react';
import { CalendarCheck, Clock, CheckCircle2, CalendarDays, ArrowRight, UserCheck, Activity, Inbox } from 'lucide-react';
import { Card, EmptyState, LoadingRows, StatusBadge, cx } from '../ui';
import { bookingRef, formatDate } from './BookingsSection';

const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const StatTile = ({ label, value, icon: Icon, tone = 'default', onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={cx(
      'text-left rounded-2xl p-4 border transition-all active:scale-[0.98] cursor-pointer',
      tone === 'dark' ? 'bg-slate-950 border-slate-950 text-white' : 'bg-white border-slate-200/80 hover:border-slate-300'
    )}
  >
    <div className="flex items-center justify-between">
      <span className={cx('text-[12px] font-semibold', tone === 'dark' ? 'text-white/70' : 'text-slate-500')}>{label}</span>
      <Icon className={cx('w-4 h-4', tone === 'dark' ? 'text-amber-300' : 'text-slate-400')} />
    </div>
    <div className="text-3xl font-black tracking-tight mt-2 tabular-nums">{value}</div>
  </button>
);

const OverviewSection = ({ user, bookings, loading, servicesCount, doctorsCount, onGo, onOpenBooking }) => {
  const today = todayStr();

  const { pending, todays, confirmed, completed } = useMemo(() => ({
    pending: bookings.filter(b => b.status === 'pending'),
    todays: bookings.filter(b => b.preferredDate === today && b.status !== 'rejected'),
    confirmed: bookings.filter(b => b.status === 'approved'),
    completed: bookings.filter(b => b.status === 'completed'),
  }), [bookings, today]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = (user?.name || 'Admin').split(' ')[0];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">{greeting}, {firstName}</h2>
        <p className="text-[13px] text-slate-500 mt-0.5">
          {pending.length > 0
            ? `${pending.length} booking${pending.length === 1 ? ' needs' : 's need'} your attention.`
            : 'All caught up — no pending bookings.'}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatTile label="Pending" value={pending.length} icon={Clock} tone="dark" onClick={() => onGo('bookings', { status: 'pending' })} />
        <StatTile label="Visits today" value={todays.length} icon={CalendarDays} onClick={() => onGo('bookings')} />
        <StatTile label="Confirmed" value={confirmed.length} icon={CalendarCheck} onClick={() => onGo('bookings', { status: 'approved' })} />
        <StatTile label="Completed" value={completed.length} icon={CheckCircle2} onClick={() => onGo('bookings', { status: 'completed' })} />
      </div>

      <Card>
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <h3 className="font-bold text-slate-950">Needs attention</h3>
          <button type="button" onClick={() => onGo('bookings', { status: 'pending' })} className="text-[13px] font-semibold text-slate-600 hover:text-slate-950 flex items-center gap-1 cursor-pointer">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        {loading && bookings.length === 0 ? (
          <div className="p-4"><LoadingRows rows={3} /></div>
        ) : pending.length === 0 ? (
          <EmptyState icon={Inbox} title="No pending bookings" desc="New requests from the website will show up here." />
        ) : (
          <ul className="divide-y divide-slate-100">
            {pending.slice(0, 6).map(b => (
              <li key={b._id}>
                <button
                  type="button"
                  onClick={() => onOpenBooking(b._id)}
                  className="w-full text-left px-4 py-3 flex items-center justify-between gap-3 hover:bg-slate-50 active:bg-slate-100 cursor-pointer"
                >
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-950 truncate">{b.name}</div>
                    <div className="text-[12px] text-slate-500 truncate">
                      {b.serviceName} · {formatDate(b.preferredDate)} · {b.preferredTime}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <StatusBadge status={b.status} />
                    <span className="text-[11px] text-slate-400">{bookingRef(b)}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={() => onGo('doctors')} className="text-left bg-white rounded-2xl border border-slate-200/80 p-4 hover:border-slate-300 cursor-pointer">
          <UserCheck className="w-5 h-5 text-slate-400" />
          <div className="text-2xl font-black mt-2 tabular-nums">{doctorsCount}</div>
          <div className="text-[12px] font-semibold text-slate-500">Doctors</div>
        </button>
        <button type="button" onClick={() => onGo('services')} className="text-left bg-white rounded-2xl border border-slate-200/80 p-4 hover:border-slate-300 cursor-pointer">
          <Activity className="w-5 h-5 text-slate-400" />
          <div className="text-2xl font-black mt-2 tabular-nums">{servicesCount}</div>
          <div className="text-[12px] font-semibold text-slate-500">Services</div>
        </button>
      </div>
    </div>
  );
};

export default OverviewSection;
