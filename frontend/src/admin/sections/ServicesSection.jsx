import React, { useState } from 'react';
import {
  Plus, Pencil, Trash2, Activity, ArrowUp, ArrowDown, Eye, EyeOff, X, ChevronDown, UploadCloud, Loader2
} from 'lucide-react';
import { servicesAPI, uploadAPI, getErrorMessage } from '../../services/api';
import { useToast } from '../../components/common/ToastContext';
import { resolveImageUrl } from '../../utils/url';
import {
  Button, Card, EditorHeader, EmptyState, Field, IconButton, ImageUpload, Input, LoadingRows,
  Pill, SectionTitle, StringListEditor, Textarea, Toggle, cx
} from '../ui';

const EMPTY_SERVICE = {
  title: '',
  shortDescription: '',
  fullDescription: '',
  price: '',
  bannerImage: '',
  galleryImages: [],
  benefits: [],
  subServices: [],
  faqs: [],
  bookable: true,
  active: true,
  icon: 'Heart',
  preparationInstructions: ''
};

const EDITOR_TABS = [
  { id: 'basics', label: 'Basics' },
  { id: 'treatments', label: 'Treatments' },
  { id: 'benefits', label: 'Benefits' },
  { id: 'faqs', label: 'FAQs' },
  { id: 'photos', label: 'Photos' },
];

const TreatmentRow = ({ sub, index, total, onChange, onRemove, onMove }) => {
  const [open, setOpen] = useState(!sub.name);
  const set = (k) => (e) => onChange({ ...sub, [k]: e?.target ? e.target.value : e });

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-1 pl-4 pr-2 py-2">
        <button type="button" onClick={() => setOpen(o => !o)} className="flex-1 min-w-0 text-left py-1.5 cursor-pointer">
          <div className="font-semibold text-slate-950 truncate">{sub.name || 'New treatment'}</div>
          <div className="text-[12px] text-slate-500 flex gap-2">
            {Number(sub.price) > 0 && <span>₹{sub.price}</span>}
            {sub.active === false && <span>Hidden</span>}
            {sub.bookable === false && <span>Not bookable</span>}
          </div>
        </button>
        <IconButton icon={ArrowUp} label="Move up" onClick={() => onMove(index, -1)} disabled={index === 0} className="disabled:opacity-30" />
        <IconButton icon={ArrowDown} label="Move down" onClick={() => onMove(index, 1)} disabled={index === total - 1} className="disabled:opacity-30" />
        <IconButton icon={X} label="Remove treatment" tone="danger" onClick={onRemove} />
        <IconButton icon={ChevronDown} label={open ? 'Collapse' : 'Expand'} onClick={() => setOpen(o => !o)} className={open ? 'rotate-180' : ''} />
      </div>
      {open && (
        <div className="px-4 pb-4 pt-1 space-y-3 border-t border-slate-100">
          <div className="grid grid-cols-[1fr_7rem] gap-3">
            <Field label="Name" required>
              <Input value={sub.name || ''} onChange={set('name')} placeholder="Home Doctor Visit" />
            </Field>
            <Field label="Price (₹)">
              <Input type="number" inputMode="numeric" value={sub.price ?? ''} onChange={set('price')} />
            </Field>
          </div>
          <Field label="Description">
            <Textarea rows={2} value={sub.description || ''} onChange={set('description')} />
          </Field>
          <div className="grid sm:grid-cols-2 gap-x-6">
            <Toggle checked={sub.active !== false} onChange={set('active')} label="Show on website" />
            <Toggle checked={sub.bookable !== false} onChange={set('bookable')} label="Can be booked" />
          </div>
        </div>
      )}
    </Card>
  );
};

const ServiceEditor = ({ service, onClose, onSaved }) => {
  const { addToast } = useToast();
  const isNew = !service._id;
  const [form, setForm] = useState(() => ({
    ...EMPTY_SERVICE,
    ...service,
    galleryImages: service.galleryImages || [],
    benefits: service.benefits || [],
    subServices: (service.subServices || []).map(s => (typeof s === 'string' ? { name: s } : s)),
    faqs: service.faqs || [],
  }));
  const [tab, setTab] = useState('basics');
  const [saving, setSaving] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e?.target ? e.target.value : e }));

  const updateSub = (i, sub) => setForm(f => ({ ...f, subServices: f.subServices.map((s, j) => (j === i ? sub : s)) }));
  const moveSub = (i, dir) => setForm(f => {
    const list = [...f.subServices];
    const j = i + dir;
    if (j < 0 || j >= list.length) return f;
    [list[i], list[j]] = [list[j], list[i]];
    return { ...f, subServices: list };
  });

  const addGalleryImage = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setGalleryUploading(true);
    try {
      const res = await uploadAPI.image(file);
      if (res.success) setForm(f => ({ ...f, galleryImages: [...f.galleryImages, res.url] }));
    } catch (err) {
      addToast(getErrorMessage(err, 'Image upload failed'), 'error');
    } finally {
      setGalleryUploading(false);
    }
  };

  const save = async () => {
    if (!form.title.trim() || !form.shortDescription.trim() || !form.fullDescription.trim()) {
      setTab('basics');
      addToast('Title, short description and full description are required', 'error');
      return;
    }
    const unnamed = form.subServices.findIndex(s => !String(s.name || '').trim());
    if (unnamed !== -1) {
      setTab('treatments');
      addToast(`Treatment ${unnamed + 1} needs a name`, 'error');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price) || 0,
        subServices: form.subServices.map((s, i) => ({
          ...s,
          name: s.name.trim(),
          price: Number(s.price) || 0,
          displayOrder: i,
        })),
        faqs: form.faqs.filter(f => f.question?.trim() && f.answer?.trim()),
      };
      delete payload._id;
      const res = isNew ? await servicesAPI.create(payload) : await servicesAPI.update(service._id, payload);
      if (res.success) {
        addToast(isNew ? 'Service created' : 'Service saved');
        onSaved();
        onClose();
      }
    } catch (err) {
      addToast(getErrorMessage(err, 'Could not save service'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const counts = {
    treatments: form.subServices.length,
    benefits: form.benefits.length,
    faqs: form.faqs.length,
    photos: form.galleryImages.length,
  };

  return (
    <div className="pb-24 sm:pb-0">
      <EditorHeader
        title={isNew ? 'New service' : form.title || 'Edit service'}
        onBack={onClose}
        actions={<Button onClick={save} loading={saving} className="hidden sm:inline-flex">Save service</Button>}
      />

      <div className="flex gap-1.5 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 mb-4">
        {EDITOR_TABS.map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cx(
              'h-9 px-3.5 rounded-full text-[13px] font-semibold shrink-0 flex items-center gap-1.5 cursor-pointer',
              tab === t.id ? 'bg-slate-950 text-white' : 'bg-white border border-slate-200 text-slate-600'
            )}
          >
            {t.label}
            {counts[t.id] !== undefined && <span className={tab === t.id ? 'text-white/60' : 'text-slate-400'}>{counts[t.id]}</span>}
          </button>
        ))}
      </div>

      <Card className="p-4 sm:p-6">
        {tab === 'basics' && (
          <div className="space-y-4 max-w-2xl">
            <Field label="Service name" required>
              <Input value={form.title} onChange={set('title')} placeholder="Nursing Services" />
            </Field>
            <Field label="Short description" required hint="One or two lines shown on service cards.">
              <Textarea rows={2} value={form.shortDescription} onChange={set('shortDescription')} />
            </Field>
            <Field label="Full description" required>
              <Textarea rows={5} value={form.fullDescription} onChange={set('fullDescription')} />
            </Field>
            <Field label="Starting price (₹)" hint="Leave 0 to hide the price.">
              <Input type="number" inputMode="numeric" value={form.price} onChange={set('price')} className="max-w-[12rem]" />
            </Field>
            <ImageUpload label="Banner image" shape="wide" value={form.bannerImage} onChange={set('bannerImage')} onError={(m) => addToast(m, 'error')} />
            <Field label="Before the visit (optional)" hint="Preparation instructions for patients.">
              <Textarea rows={3} value={form.preparationInstructions} onChange={set('preparationInstructions')} />
            </Field>
            <div className="border-t border-slate-100 pt-2">
              <Toggle checked={form.active !== false} onChange={set('active')} label="Show on website" />
              <Toggle checked={form.bookable !== false} onChange={set('bookable')} label="Accept bookings" desc="Turn off to list the service without a booking option." />
            </div>
          </div>
        )}

        {tab === 'treatments' && (
          <div className="space-y-3">
            <p className="text-[13px] text-slate-500">Treatments are the options patients choose when booking this service.</p>
            {form.subServices.map((sub, i) => (
              <TreatmentRow
                key={i}
                sub={sub}
                index={i}
                total={form.subServices.length}
                onChange={(s) => updateSub(i, s)}
                onRemove={() => setForm(f => ({ ...f, subServices: f.subServices.filter((_, j) => j !== i) }))}
                onMove={moveSub}
              />
            ))}
            <Button
              variant="secondary"
              icon={Plus}
              onClick={() => setForm(f => ({ ...f, subServices: [...f.subServices, { name: '', description: '', price: 0, active: true, bookable: true }] }))}
            >
              Add treatment
            </Button>
          </div>
        )}

        {tab === 'benefits' && (
          <div className="max-w-2xl">
            <p className="text-[13px] text-slate-500 mb-3">Short bullet points shown on the service page.</p>
            <StringListEditor items={form.benefits} onChange={set('benefits')} placeholder="e.g. Certified ICU nurses" />
          </div>
        )}

        {tab === 'faqs' && (
          <div className="space-y-3 max-w-2xl">
            {form.faqs.map((faq, i) => (
              <Card key={i} className="p-3 space-y-2">
                <div className="flex items-start gap-2">
                  <Input
                    value={faq.question}
                    onChange={(e) => setForm(f => ({ ...f, faqs: f.faqs.map((x, j) => (j === i ? { ...x, question: e.target.value } : x)) }))}
                    placeholder="Question"
                    className="font-semibold"
                  />
                  <IconButton icon={X} label="Remove question" tone="danger" onClick={() => setForm(f => ({ ...f, faqs: f.faqs.filter((_, j) => j !== i) }))} />
                </div>
                <Textarea
                  rows={2}
                  value={faq.answer}
                  onChange={(e) => setForm(f => ({ ...f, faqs: f.faqs.map((x, j) => (j === i ? { ...x, answer: e.target.value } : x)) }))}
                  placeholder="Answer"
                />
              </Card>
            ))}
            <Button variant="secondary" icon={Plus} onClick={() => setForm(f => ({ ...f, faqs: [...f.faqs, { question: '', answer: '' }] }))}>
              Add question
            </Button>
          </div>
        )}

        {tab === 'photos' && (
          <div>
            <p className="text-[13px] text-slate-500 mb-3">Gallery photos shown on the service page.</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
              {form.galleryImages.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 group">
                  <img src={resolveImageUrl(img)} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, galleryImages: f.galleryImages.filter((_, j) => j !== i) }))}
                    aria-label="Remove photo"
                    className="absolute top-1 right-1 h-7 w-7 rounded-full bg-black/60 text-white flex items-center justify-center cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <label className="aspect-square rounded-xl border-2 border-dashed border-slate-200 text-slate-500 flex flex-col items-center justify-center gap-1 text-[12px] font-semibold cursor-pointer hover:border-slate-400">
                {galleryUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
                {galleryUploading ? 'Uploading' : 'Add photo'}
                <input type="file" accept="image/*" className="hidden" onChange={addGalleryImage} disabled={galleryUploading} />
              </label>
            </div>
          </div>
        )}
      </Card>

      {/* Sticky save on phones */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-white/90 backdrop-blur border-t border-slate-200 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] flex gap-2">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button onClick={save} loading={saving} className="flex-1">Save service</Button>
      </div>
    </div>
  );
};

const ServicesSection = ({ services, loading, onChanged, onEditingChange }) => {
  const { addToast } = useToast();
  const [editing, setEditingState] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const setEditing = (s) => {
    setEditingState(s);
    onEditingChange?.(!!s);
    window.scrollTo({ top: 0 });
  };

  const toggleVisible = async (s) => {
    setBusyId(s._id);
    try {
      await servicesAPI.update(s._id, { active: s.active === false });
      addToast(s.active === false ? `${s.title} is now visible` : `${s.title} is now hidden`);
      onChanged();
    } catch (err) {
      addToast(getErrorMessage(err, 'Could not update service'), 'error');
    } finally {
      setBusyId(null);
    }
  };

  const move = async (index, dir) => {
    const list = [...services];
    const j = index + dir;
    if (j < 0 || j >= list.length) return;
    [list[index], list[j]] = [list[j], list[index]];
    try {
      await servicesAPI.reorder(list.map(s => s._id));
      onChanged();
    } catch (err) {
      addToast(getErrorMessage(err, 'Could not change the order'), 'error');
    }
  };

  const remove = async (s) => {
    if (!window.confirm(`Delete "${s.title}" and all its treatments? This cannot be undone.`)) return;
    try {
      await servicesAPI.delete(s._id);
      addToast('Service deleted');
      onChanged();
    } catch (err) {
      addToast(getErrorMessage(err, 'Could not delete service'), 'error');
    }
  };

  if (editing) {
    return <ServiceEditor service={editing} onClose={() => setEditing(null)} onSaved={onChanged} />;
  }

  return (
    <div className="space-y-4">
      <SectionTitle
        title="Services"
        desc="What patients can find and book. Use the arrows to change the order."
        action={<Button icon={Plus} size="sm" onClick={() => setEditing({})}>Add</Button>}
      />

      {loading && services.length === 0 ? (
        <LoadingRows rows={4} />
      ) : services.length === 0 ? (
        <Card>
          <EmptyState icon={Activity} title="No services yet" action={<Button icon={Plus} onClick={() => setEditing({})}>Add service</Button>} />
        </Card>
      ) : (
        <Card className="divide-y divide-slate-100 overflow-hidden">
          {services.map((s, i) => {
            const visible = s.active !== false;
            const treatments = (s.subServices || []).length;
            return (
              <div key={s._id} className="flex items-center gap-3 p-3 sm:p-4">
                <div className="flex flex-col -my-1">
                  <IconButton icon={ArrowUp} label="Move up" onClick={() => move(i, -1)} disabled={i === 0} className="!h-7 disabled:opacity-25" />
                  <IconButton icon={ArrowDown} label="Move down" onClick={() => move(i, 1)} disabled={i === services.length - 1} className="!h-7 disabled:opacity-25" />
                </div>
                <div className={cx('hidden sm:block h-14 w-20 rounded-xl overflow-hidden bg-slate-100 shrink-0', !visible && 'opacity-50 grayscale')}>
                  {s.bannerImage && <img src={resolveImageUrl(s.bannerImage)} alt="" className="h-full w-full object-cover" />}
                </div>
                <button type="button" onClick={() => setEditing(s)} className="min-w-0 flex-1 text-left cursor-pointer">
                  <div className="font-bold text-slate-950 truncate">{s.title}</div>
                  <div className="mt-0.5 flex flex-wrap gap-1">
                    {visible ? <Pill tone="green">Visible</Pill> : <Pill>Hidden</Pill>}
                    <Pill>{treatments} treatment{treatments === 1 ? '' : 's'}</Pill>
                    {s.bookable === false && <Pill tone="red">Not bookable</Pill>}
                  </div>
                </button>
                <div className="flex items-center">
                  <IconButton
                    icon={visible ? EyeOff : Eye}
                    label={visible ? 'Hide from website' : 'Show on website'}
                    onClick={() => toggleVisible(s)}
                    disabled={busyId === s._id}
                  />
                  <IconButton icon={Pencil} label={`Edit ${s.title}`} onClick={() => setEditing(s)} className="hidden sm:inline-flex" />
                  <IconButton icon={Trash2} label={`Delete ${s.title}`} tone="danger" onClick={() => remove(s)} />
                </div>
              </div>
            );
          })}
        </Card>
      )}
    </div>
  );
};

export default ServicesSection;
