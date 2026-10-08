import React, { useMemo, useState } from 'react';
import {
  Download, Filter, PhoneCall, MessageSquare, MapPin, Trash2, Printer,
  CalendarCheck, Mail, FileText, Clock, Check, X, RotateCcw, RefreshCw
} from 'lucide-react';
import { bookingsAPI, getErrorMessage } from '../../services/api';
import { useToast } from '../../components/common/ToastContext';
import {
  Button, Card, EmptyState, Field, IconButton, Input, LoadingRows, SearchInput,
  Select, Sheet, StatusBadge, STATUS_STYLES, cx
} from '../ui';

export const STATUS_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'approved', label: 'Confirmed' },
  { id: 'completed', label: 'Completed' },
  { id: 'rejected', label: 'Cancelled' },
];

export const bookingRef = (b) => b.bookingId || `#${String(b._id || '').slice(-6)}`;

export const formatDate = (value) => {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const formatDateTime = (value) => {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
};

const phoneDigits = (mobile = '') => {
  const d = String(mobile).replace(/\D/g, '');
  return d.length === 10 ? `91${d}` : d;
};

const csvCell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;

const exportCSV = (rows) => {
  const headers = ['Booking ID', 'Patient Name', 'Mobile', 'Email', 'Service', 'Treatment', 'Date', 'Time Slot', 'Address', 'Notes', 'Status', 'Submitted At'];
  const lines = rows.map(b => [
    bookingRef(b), b.name, b.mobile, b.email, b.serviceName, b.subServiceName,
    b.preferredDate, b.preferredTime, b.address, b.notes,
    (STATUS_STYLES[b.status]?.label || b.status), b.createdAt
  ].map(csvCell).join(','));
  const blob = new Blob([[headers.map(csvCell).join(','), ...lines].join('\n')], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `Bookings_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

const escapeHtml = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Opens a clean printable booking slip in a new window
const printBooking = (b) => {
  const w = window.open('', '_blank', 'width=720,height=900');
  if (!w) return;
  const row = (k, v) => `<tr><th>${k}</th><td>${escapeHtml(v || '—')}</td></tr>`;
  w.document.write(`<!doctype html><html><head><title>${escapeHtml(bookingRef(b))}</title>
    <style>body{font-family:system-ui,sans-serif;padding:32px;color:#0f172a}h1{font-size:20px;margin:0}
    p{color:#64748b;margin:4px 0 24px}table{width:100%;border-collapse:collapse}th,td{text-align:left;padding:10px 8px;border-bottom:1px solid #e2e8f0;font-size:14px;vertical-align:top}
    th{width:160px;color:#64748b;font-weight:600}</style></head><body>
    <h1>Nest Cares — Booking ${escapeHtml(bookingRef(b))}</h1><p>Printed ${new Date().toLocaleString('en-IN')}</p>
    <table>${row('Status', STATUS_STYLES[b.status]?.label || b.status)}${row('Patient', b.name)}${row('Mobile', b.mobile)}${row('Email', b.email)}
    ${row('Service', b.serviceName)}${row('Treatment', b.subServiceName)}${row('Date', formatDate(b.preferredDate))}${row('Time slot', b.preferredTime)}
    ${row('Address', b.address)}${row('Notes', b.notes)}${row('Submitted', formatDateTime(b.createdAt))}</table>
    <script>window.onload=()=>window.print()</script></body></html>`);
  w.document.close();
};

// Next-step actions for each status, in the order shown
const STATUS_ACTIONS = {
  pending: [
    { to: 'approved', label: 'Confirm booking', icon: Check, variant: 'primary' },
    { to: 'rejected', label: 'Cancel', icon: X, variant: 'danger' },
  ],
  approved: [
    { to: 'completed', label: 'Mark completed', icon: Check, variant: 'success' },
    { to: 'rejected', label: 'Cancel', icon: X, variant: 'danger' },
  ],
  completed: [{ to: 'pending', label: 'Reopen', icon: RotateCcw, variant: 'secondary' }],
  rejected: [{ to: 'pending', label: 'Reopen', icon: RotateCcw, variant: 'secondary' }],
};

const DetailRow = ({ icon: Icon, label, children }) => (
  <div className="flex gap-3 py-2.5">
    <Icon className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
    <div className="min-w-0 flex-1">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</div>
      <div className="text-sm text-slate-900 mt-0.5 break-words">{children}</div>
    </div>
  </div>
);

export const BookingDetailSheet = ({ booking, onClose, onChanged }) => {
  const { addToast } = useToast();
  const [busy, setBusy] = useState(null);

  if (!booking) return null;

  const setStatus = async (status) => {
    setBusy(status);
    try {
      const res = await bookingsAPI.updateBookingStatus(booking._id, status);
      if (res.success) {
        addToast(`Booking ${bookingRef(booking)} marked ${STATUS_STYLES[status].label.toLowerCase()}`);
        onChanged({ ...booking, status });
      }
    } catch (err) {
      addToast(getErrorMessage(err, 'Could not update the booking'), 'error');
    } finally {
      setBusy(null);
    }
  };

  const remove = async () => {
    if (!window.confirm(`Delete booking ${bookingRef(booking)} for ${booking.name}? This cannot be undone.`)) return;
    setBusy('delete');
    try {
      await bookingsAPI.deleteBooking(booking._id);
      addToast('Booking deleted');
      onChanged(null, booking._id);
      onClose();
    } catch (err) {
      addToast(getErrorMessage(err, 'Could not delete the booking'), 'error');
    } finally {
      setBusy(null);
    }
  };

  const wa = phoneDigits(booking.mobile);
  const waText = encodeURIComponent(`Hello ${booking.name}, this is Nest Cares regarding your booking ${bookingRef(booking)} for ${booking.serviceName}.`);

  return (
    <Sheet
      open
      onClose={onClose}
      title={booking.name}
      subtitle={`${bookingRef(booking)} · submitted ${formatDateTime(booking.createdAt)}`}
      footer={
        <div className="flex flex-wrap items-center gap-2">
          {(STATUS_ACTIONS[booking.status] || STATUS_ACTIONS.pending).map(a => (
            <Button key={a.to} variant={a.variant} icon={a.icon} loading={busy === a.to} onClick={() => setStatus(a.to)} className="flex-1 sm:flex-none">
              {a.label}
            </Button>
          ))}
          <div className="flex items-center gap-1 ml-auto">
            <IconButton icon={Printer} label="Print booking" onClick={() => printBooking(booking)} />
            <IconButton icon={Trash2} label="Delete booking" tone="danger" onClick={remove} disabled={busy === 'delete'} />
          </div>
        </div>
      }
    >
      <div className="flex items-center justify-between gap-3">
        <StatusBadge status={booking.status} />
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4">
        <a href={`tel:${booking.mobile}`} className="h-12 rounded-xl bg-slate-950 text-white font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
          <PhoneCall className="w-4 h-4" /> Call
        </a>
        <a href={`https://wa.me/${wa}?text=${waText}`} target="_blank" rel="noopener noreferrer" className="h-12 rounded-xl bg-emerald-600 text-white font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
          <MessageSquare className="w-4 h-4" /> WhatsApp
        </a>
      </div>

      <div className="mt-3 divide-y divide-slate-100">
        <DetailRow icon={PhoneCall} label="Mobile">{booking.mobile}</DetailRow>
        <DetailRow icon={CalendarCheck} label="Service">
          <span className="font-semibold">{booking.serviceName}</span>
          {booking.subServiceName && <span className="text-slate-500"> · {booking.subServiceName}</span>}
        </DetailRow>
        <DetailRow icon={Clock} label="When">{formatDate(booking.preferredDate)} · {booking.preferredTime}</DetailRow>
        <DetailRow icon={MapPin} label="Address">
          {booking.address}
          {booking.address && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-[13px] font-semibold text-sky-700 mt-1"
            >
              Open in Google Maps →
            </a>
          )}
        </DetailRow>
        {booking.email && <DetailRow icon={Mail} label="Email">{booking.email}</DetailRow>}
        {booking.notes && <DetailRow icon={FileText} label="Notes">{booking.notes}</DetailRow>}
      </div>
    </Sheet>
  );
};

const BookingsSection = ({ bookings, loading, onRefresh, onBookingChanged, services = [], initialStatus = 'all', openBookingId, onOpenBooking }) => {
  const [status, setStatus] = useState(initialStatus);
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [serviceFilter, setServiceFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const { addToast } = useToast();

  const counts = useMemo(() => {
    const c = { all: bookings.length };
    bookings.forEach(b => { c[b.status] = (c[b.status] || 0) + 1; });
    return c;
  }, [bookings]);

  const serviceNames = useMemo(() => {
    const names = new Set([...services.map(s => s.title), ...bookings.map(b => b.serviceName)].filter(Boolean));
    return [...names].sort();
  }, [services, bookings]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return bookings.filter(b => {
      if (status !== 'all' && b.status !== status) return false;
      if (serviceFilter !== 'all' && b.serviceName !== serviceFilter) return false;
      if (dateFrom && (b.preferredDate || '') < dateFrom) return false;
      if (dateTo && (b.preferredDate || '') > dateTo) return false;
      if (!q) return true;
      return [b.name, b.mobile, b.email, b.address, b.serviceName, b.subServiceName, b.bookingId]
        .some(v => v && String(v).toLowerCase().includes(q));
    });
  }, [bookings, status, search, serviceFilter, dateFrom, dateTo]);

  const activeFilterCount = [serviceFilter !== 'all', dateFrom, dateTo].filter(Boolean).length;
  const openBooking = bookings.find(b => b._id === openBookingId) || null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="max-lg:sr-only text-lg sm:text-xl font-black text-slate-950 tracking-tight">Bookings</h2>
          <p className="text-[13px] text-slate-500">Tap a booking to call the patient or update its status.</p>
        </div>
        <div className="flex items-center gap-2">
          <IconButton icon={RefreshCw} label="Refresh" onClick={onRefresh} className={loading ? 'animate-spin' : ''} />
          <Button
            variant="secondary"
            size="sm"
            icon={Download}
            onClick={() => {
              if (!filtered.length) return addToast('No bookings to export', 'error');
              exportCSV(filtered);
              addToast(`Exported ${filtered.length} booking${filtered.length === 1 ? '' : 's'}`);
            }}
          >
            <span className="hidden sm:inline">Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        {STATUS_FILTERS.map(f => (
          <button
            key={f.id}
            type="button"
            onClick={() => setStatus(f.id)}
            className={cx(
              'h-9 px-3.5 rounded-full text-[13px] font-semibold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer',
              status === f.id ? 'bg-slate-950 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-950'
            )}
          >
            {f.label}
            <span className={cx('text-[11px] tabular-nums', status === f.id ? 'text-white/60' : 'text-slate-400')}>{counts[f.id] || 0}</span>
          </button>
        ))}
      </div>

      {/* Search + filters */}
      <div className="flex gap-2">
        <SearchInput value={search} onChange={setSearch} placeholder="Search name, phone, ID, area…" className="flex-1" />
        <Button variant="secondary" icon={Filter} onClick={() => setShowFilters(v => !v)} className={activeFilterCount ? '!border-slate-900' : ''}>
          <span className="hidden sm:inline">Filters</span>
          {activeFilterCount > 0 && <span className="h-5 min-w-5 px-1 rounded-full bg-slate-950 text-white text-[11px] flex items-center justify-center">{activeFilterCount}</span>}
        </Button>
      </div>

      {showFilters && (
        <Card className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field label="Service">
            <Select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)}>
              <option value="all">All services</option>
              {serviceNames.map(n => <option key={n} value={n}>{n}</option>)}
            </Select>
          </Field>
          <Field label="Visit date from">
            <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          </Field>
          <Field label="Visit date to">
            <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          </Field>
          {activeFilterCount > 0 && (
            <div className="sm:col-span-3">
              <Button variant="ghost" size="sm" onClick={() => { setServiceFilter('all'); setDateFrom(''); setDateTo(''); }}>Clear filters</Button>
            </div>
          )}
        </Card>
      )}

      {/* List */}
      {loading && bookings.length === 0 ? (
        <LoadingRows rows={5} />
      ) : filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={CalendarCheck}
            title={bookings.length === 0 ? 'No bookings yet' : 'No bookings match'}
            desc={bookings.length === 0 ? 'New requests from the website will appear here.' : 'Try a different status, search or filter.'}
          />
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="hidden md:grid grid-cols-[1.4fr_1.4fr_1fr_0.8fr] gap-4 px-4 py-2.5 bg-slate-50 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <span>Patient</span><span>Service</span><span>Visit</span><span className="text-right">Status</span>
          </div>
          <ul className="divide-y divide-slate-100">
            {filtered.map(b => (
              <li key={b._id}>
                <button
                  type="button"
                  onClick={() => onOpenBooking(b._id)}
                  className="w-full text-left px-4 py-3.5 hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer md:grid md:grid-cols-[1.4fr_1.4fr_1fr_0.8fr] md:gap-4 md:items-center"
                >
                  <div className="flex items-start justify-between gap-3 md:block min-w-0">
                    <div className="min-w-0">
                      <div className="font-bold text-slate-950 truncate">{b.name}</div>
                      <div className="text-[12px] text-slate-500 truncate">{bookingRef(b)} · {b.mobile}</div>
                    </div>
                    <div className="md:hidden shrink-0"><StatusBadge status={b.status} /></div>
                  </div>
                  <div className="mt-1.5 md:mt-0 text-[13px] text-slate-700 truncate">
                    <span className="font-semibold">{b.serviceName}</span>
                    {b.subServiceName && <span className="text-slate-500 md:block md:truncate"><span className="md:hidden"> · </span>{b.subServiceName}</span>}
                  </div>
                  <div className="mt-0.5 md:mt-0 text-[12px] md:text-[13px] text-slate-500 md:text-slate-700">
                    {formatDate(b.preferredDate)}
                    <span className="md:block md:text-[12px] md:text-slate-500"><span className="md:hidden"> · </span>{b.preferredTime}</span>
                  </div>
                  <div className="hidden md:flex justify-end"><StatusBadge status={b.status} /></div>
                </button>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <BookingDetailSheet
        booking={openBooking}
        onClose={() => onOpenBooking(null)}
        onChanged={onBookingChanged}
      />
    </div>
  );
};

export default BookingsSection;
