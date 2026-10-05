// Small, consistent building blocks for the admin panel.
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2, UploadCloud, ImageOff, Search, ChevronLeft } from 'lucide-react';
import { uploadAPI, getErrorMessage } from '../services/api';
import { resolveImageUrl } from '../utils/url';

export const cx = (...c) => c.filter(Boolean).join(' ');

// ---------- Buttons ----------
const BUTTON_VARIANTS = {
  primary: 'bg-slate-950 text-white hover:bg-black shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]',
  secondary: 'bg-white text-slate-800 border border-slate-200 hover:bg-slate-50',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
  danger: 'bg-white text-rose-600 border border-rose-200 hover:bg-rose-50',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700',
};

export const Button = ({ variant = 'primary', size = 'md', loading = false, icon: Icon, children, className = '', ...props }) => (
  <button
    type="button"
    disabled={loading || props.disabled}
    className={cx(
      'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer whitespace-nowrap',
      size === 'sm' ? 'h-9 px-3 text-[13px]' : 'h-11 px-4 text-sm',
      BUTTON_VARIANTS[variant],
      className
    )}
    {...props}
  >
    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : Icon && <Icon className="w-4 h-4" />}
    {children}
  </button>
);

export const IconButton = ({ icon: Icon, label, className = '', tone = 'default', ...props }) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    className={cx(
      'h-9 w-9 inline-flex items-center justify-center rounded-xl transition-colors cursor-pointer shrink-0',
      tone === 'danger' ? 'text-rose-600 hover:bg-rose-50' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900',
      className
    )}
    {...props}
  >
    <Icon className="w-4 h-4" />
  </button>
);

// ---------- Layout ----------
export const Card = ({ className = '', children, ...props }) => (
  <div className={cx('bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_2px_rgba(15,23,42,0.04)]', className)} {...props}>
    {children}
  </div>
);

export const SectionTitle = ({ title, desc, action }) => (
  <div className="flex items-start justify-between gap-3 mb-4">
    <div className="min-w-0">
      <h2 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight">{title}</h2>
      {desc && <p className="text-[13px] text-slate-500 mt-0.5">{desc}</p>}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);

export const EmptyState = ({ icon: Icon, title, desc, action }) => (
  <div className="text-center py-12 px-6">
    {Icon && (
      <div className="mx-auto h-12 w-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
        <Icon className="w-6 h-6" />
      </div>
    )}
    <div className="font-bold text-slate-900">{title}</div>
    {desc && <p className="text-[13px] text-slate-500 mt-1 max-w-sm mx-auto">{desc}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export const LoadingRows = ({ rows = 4 }) => (
  <div className="space-y-2">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="h-16 rounded-2xl bg-slate-100 animate-pulse" />
    ))}
  </div>
);

// ---------- Form fields ----------
const inputBase = 'w-full rounded-xl bg-white border border-slate-200 px-3.5 text-[15px] sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5';

export const Field = ({ label, hint, required, children, className = '' }) => (
  <label className={cx('block', className)}>
    {label && (
      <span className="block text-[13px] font-semibold text-slate-700 mb-1.5">
        {label}{required && <span className="text-rose-500"> *</span>}
      </span>
    )}
    {children}
    {hint && <span className="block text-[12px] text-slate-400 mt-1">{hint}</span>}
  </label>
);

export const Input = ({ className = '', ...props }) => (
  <input className={cx(inputBase, 'h-11', className)} {...props} />
);

export const Textarea = ({ className = '', rows = 3, ...props }) => (
  <textarea rows={rows} className={cx(inputBase, 'py-2.5 resize-y min-h-[80px]', className)} {...props} />
);

export const Select = ({ className = '', children, ...props }) => (
  <select className={cx(inputBase, 'h-11 pr-8 cursor-pointer', className)} {...props}>
    {children}
  </select>
);

export const SearchInput = ({ value, onChange, placeholder = 'Search…', className = '' }) => (
  <div className={cx('relative', className)}>
    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cx(inputBase, 'h-11 pl-9')}
    />
  </div>
);

export const Toggle = ({ checked, onChange, label, desc }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className="w-full flex items-center justify-between gap-4 text-left py-2 cursor-pointer"
  >
    <span className="min-w-0">
      <span className="block text-sm font-semibold text-slate-900">{label}</span>
      {desc && <span className="block text-[12px] text-slate-500">{desc}</span>}
    </span>
    <span className={cx('relative h-6 w-11 rounded-full transition-colors shrink-0', checked ? 'bg-emerald-500' : 'bg-slate-300')}>
      <span className={cx('absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform', checked && 'translate-x-5')} />
    </span>
  </button>
);

// ---------- Status ----------
export const STATUS_STYLES = {
  pending: { label: 'Pending', className: 'bg-amber-50 text-amber-700 ring-amber-200', dot: 'bg-amber-500' },
  approved: { label: 'Confirmed', className: 'bg-sky-50 text-sky-700 ring-sky-200', dot: 'bg-sky-500' },
  completed: { label: 'Completed', className: 'bg-emerald-50 text-emerald-700 ring-emerald-200', dot: 'bg-emerald-500' },
  rejected: { label: 'Cancelled', className: 'bg-rose-50 text-rose-700 ring-rose-200', dot: 'bg-rose-500' },
};

export const StatusBadge = ({ status }) => {
  const s = STATUS_STYLES[status] || STATUS_STYLES.pending;
  return (
    <span className={cx('inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold ring-1 ring-inset', s.className)}>
      <span className={cx('h-1.5 w-1.5 rounded-full', s.dot)} />
      {s.label}
    </span>
  );
};

export const Pill = ({ children, tone = 'slate' }) => {
  const tones = {
    slate: 'bg-slate-100 text-slate-600',
    green: 'bg-emerald-50 text-emerald-700',
    red: 'bg-rose-50 text-rose-700',
  };
  return <span className={cx('inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold', tones[tone])}>{children}</span>;
};

// ---------- Sheet (bottom sheet on phones, centred dialog on larger screens) ----------
export const Sheet = ({ open, onClose, title, subtitle, children, footer, wide = false }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-6" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] animate-in fade-in" onClick={onClose} />
      <div
        className={cx(
          'relative bg-white w-full max-h-[92dvh] flex flex-col rounded-t-3xl sm:rounded-3xl shadow-2xl',
          wide ? 'sm:max-w-3xl' : 'sm:max-w-lg'
        )}
      >
        <div className="sm:hidden mx-auto mt-2.5 h-1.5 w-10 rounded-full bg-slate-200" aria-hidden="true" />
        <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3 border-b border-slate-100">
          <div className="min-w-0">
            <h3 className="text-base font-black text-slate-950 truncate">{title}</h3>
            {subtitle && <p className="text-[12px] text-slate-500 mt-0.5 truncate">{subtitle}</p>}
          </div>
          <IconButton icon={X} label="Close" onClick={onClose} className="-mr-2 -mt-1" />
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 overscroll-contain">{children}</div>
        {footer && (
          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/60 rounded-b-none sm:rounded-b-3xl pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:pb-3">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

// Full-page editor header with a back button (used for long forms)
export const EditorHeader = ({ title, onBack, actions }) => (
  <div className="flex items-center justify-between gap-3 mb-4">
    <div className="flex items-center gap-1 min-w-0">
      <IconButton icon={ChevronLeft} label="Back" onClick={onBack} className="-ml-2" />
      <h2 className="text-lg font-black text-slate-950 truncate">{title}</h2>
    </div>
    <div className="flex items-center gap-2 shrink-0">{actions}</div>
  </div>
);

// ---------- Image upload ----------
export const ImageUpload = ({ value, onChange, label = 'Image', shape = 'square', onError }) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [broken, setBroken] = useState(false);

  useEffect(() => setBroken(false), [value]);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadAPI.image(file);
      if (res.success) onChange(res.url);
    } catch (err) {
      onError?.(getErrorMessage(err, 'Image upload failed'));
    } finally {
      setUploading(false);
    }
  };

  const src = value ? resolveImageUrl(value) : '';

  return (
    <div>
      <span className="block text-[13px] font-semibold text-slate-700 mb-1.5">{label}</span>
      <div className="flex items-center gap-3">
        <div className={cx('relative bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center text-slate-400',
          shape === 'wide' ? 'h-20 w-32 rounded-xl' : 'h-20 w-20 rounded-2xl')}>
          {src && !broken ? (
            <img src={src} alt="" className="h-full w-full object-cover" onError={() => setBroken(true)} />
          ) : (
            <ImageOff className="w-5 h-5" />
          )}
          {uploading && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-slate-700" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" icon={UploadCloud} onClick={() => inputRef.current?.click()} disabled={uploading}>
              {value ? 'Replace' : 'Upload'}
            </Button>
            {value && (
              <Button size="sm" variant="ghost" onClick={() => onChange('')}>Remove</Button>
            )}
          </div>
          <Input
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="…or paste an image URL"
            className="!h-9 !text-[13px]"
          />
        </div>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
    </div>
  );
};

// Editable list of short strings (benefits, phone numbers…)
export const StringListEditor = ({ items = [], onChange, placeholder = 'Add item', addLabel = 'Add' }) => {
  const [draft, setDraft] = useState('');
  const add = () => {
    const v = draft.trim();
    if (!v) return;
    onChange([...items, v]);
    setDraft('');
  };
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input
            value={item}
            onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))}
          />
          <IconButton icon={X} label="Remove" tone="danger" onClick={() => onChange(items.filter((_, j) => j !== i))} />
        </div>
      ))}
      <div className="flex items-center gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          placeholder={placeholder}
        />
        <Button variant="secondary" onClick={add} disabled={!draft.trim()}>{addLabel}</Button>
      </div>
    </div>
  );
};
