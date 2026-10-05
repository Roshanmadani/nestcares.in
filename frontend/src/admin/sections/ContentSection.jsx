import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, HelpCircle, MessageSquare, Quote } from 'lucide-react';
import { faqsAPI, testimonialsAPI, settingsAPI, getErrorMessage } from '../../services/api';
import { useToast } from '../../components/common/ToastContext';
import { resolveImageUrl } from '../../utils/url';
import {
  Button, Card, EmptyState, Field, IconButton, ImageUpload, Input, LoadingRows,
  Sheet, Textarea, cx
} from '../ui';

const TABS = [
  { id: 'faqs', label: 'FAQs', desc: 'Questions shown on the home page.' },
  { id: 'testimonials', label: 'Reviews', desc: 'Patient testimonials.' },
  { id: 'founders', label: 'About page', desc: 'Founder profiles on the About page.' },
];

// Generic list + sheet editor for simple collections
const useCollection = (api) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const load = async () => {
    setLoading(true);
    try {
      const res = await api.getAll();
      if (res.success) setItems(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);
  return { items, loading, reload: load };
};

const FaqsPanel = ({ onPublicChange }) => {
  const { addToast } = useToast();
  const { items, loading, reload } = useCollection(faqsAPI);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ question: '', answer: '' });
  const [saving, setSaving] = useState(false);

  const open = (faq) => {
    setEditing(faq);
    setForm({ question: faq.question || '', answer: faq.answer || '' });
  };

  const save = async () => {
    if (!form.question.trim() || !form.answer.trim()) return addToast('Question and answer are required', 'error');
    setSaving(true);
    try {
      if (editing._id) await faqsAPI.update(editing._id, form);
      else await faqsAPI.create(form);
      addToast('FAQ saved');
      setEditing(null);
      reload();
      onPublicChange();
    } catch (err) {
      addToast(getErrorMessage(err, 'Could not save FAQ'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (faq) => {
    if (!window.confirm('Delete this question?')) return;
    try {
      await faqsAPI.delete(faq._id);
      addToast('FAQ deleted');
      reload();
      onPublicChange();
    } catch (err) {
      addToast(getErrorMessage(err, 'Could not delete FAQ'), 'error');
    }
  };

  return (
    <>
      <div className="flex justify-end mb-3">
        <Button size="sm" icon={Plus} onClick={() => open({})}>Add question</Button>
      </div>
      {loading ? <LoadingRows rows={3} /> : items.length === 0 ? (
        <Card><EmptyState icon={HelpCircle} title="No FAQs yet" desc="The home page shows built-in questions until you add your own." /></Card>
      ) : (
        <Card className="divide-y divide-slate-100">
          {items.map(faq => (
            <div key={faq._id} className="flex items-start gap-2 p-4">
              <button type="button" onClick={() => open(faq)} className="flex-1 min-w-0 text-left cursor-pointer">
                <div className="font-semibold text-slate-950">{faq.question}</div>
                <p className="text-[13px] text-slate-500 mt-0.5 line-clamp-2">{faq.answer}</p>
              </button>
              <IconButton icon={Pencil} label="Edit" onClick={() => open(faq)} />
              <IconButton icon={Trash2} label="Delete" tone="danger" onClick={() => remove(faq)} />
            </div>
          ))}
        </Card>
      )}
      {editing && (
        <Sheet
          open
          onClose={() => setEditing(null)}
          title={editing._id ? 'Edit question' : 'New question'}
          footer={<div className="flex gap-2 justify-end"><Button variant="secondary" onClick={() => setEditing(null)}>Cancel</Button><Button onClick={save} loading={saving} className="flex-1 sm:flex-none">Save</Button></div>}
        >
          <div className="space-y-4">
            <Field label="Question" required><Input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} /></Field>
            <Field label="Answer" required><Textarea rows={5} value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} /></Field>
          </div>
        </Sheet>
      )}
    </>
  );
};

const TestimonialsPanel = () => {
  const { addToast } = useToast();
  const { items, loading, reload } = useCollection(testimonialsAPI);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', designation: '', text: '', image: '' });
  const [saving, setSaving] = useState(false);

  const open = (t) => {
    setEditing(t);
    setForm({ name: t.name || '', designation: t.designation || '', text: t.text || '', image: t.image || '' });
  };

  const save = async () => {
    if (!form.name.trim() || !form.text.trim()) return addToast('Name and review text are required', 'error');
    setSaving(true);
    try {
      if (editing._id) await testimonialsAPI.update(editing._id, form);
      else await testimonialsAPI.create(form);
      addToast('Review saved');
      setEditing(null);
      reload();
    } catch (err) {
      addToast(getErrorMessage(err, 'Could not save review'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (t) => {
    if (!window.confirm(`Delete the review from ${t.name}?`)) return;
    try {
      await testimonialsAPI.delete(t._id);
      addToast('Review deleted');
      reload();
    } catch (err) {
      addToast(getErrorMessage(err, 'Could not delete review'), 'error');
    }
  };

  return (
    <>
      <div className="flex justify-end mb-3">
        <Button size="sm" icon={Plus} onClick={() => open({})}>Add review</Button>
      </div>
      {loading ? <LoadingRows rows={3} /> : items.length === 0 ? (
        <Card><EmptyState icon={MessageSquare} title="No reviews yet" /></Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {items.map(t => (
            <Card key={t._id} className="p-4 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                {t.image ? (
                  <img src={resolveImageUrl(t.image)} alt="" className="h-10 w-10 rounded-full object-cover bg-slate-100" />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold">{(t.name || '?')[0]}</div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-slate-950 truncate">{t.name}</div>
                  <div className="text-[12px] text-slate-500 truncate">{t.designation}</div>
                </div>
                <IconButton icon={Pencil} label="Edit" onClick={() => open(t)} />
                <IconButton icon={Trash2} label="Delete" tone="danger" onClick={() => remove(t)} />
              </div>
              <p className="text-[13px] text-slate-600 line-clamp-3 flex gap-2"><Quote className="w-3.5 h-3.5 shrink-0 text-slate-300 mt-0.5" />{t.text}</p>
            </Card>
          ))}
        </div>
      )}
      {editing && (
        <Sheet
          open
          onClose={() => setEditing(null)}
          title={editing._id ? 'Edit review' : 'New review'}
          footer={<div className="flex gap-2 justify-end"><Button variant="secondary" onClick={() => setEditing(null)}>Cancel</Button><Button onClick={save} loading={saving} className="flex-1 sm:flex-none">Save</Button></div>}
        >
          <div className="space-y-4">
            <ImageUpload label="Photo (optional)" value={form.image} onChange={(v) => setForm(f => ({ ...f, image: v }))} onError={(m) => addToast(m, 'error')} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Name" required><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
              <Field label="Relation / area"><Input value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} placeholder="Son of patient, Subhash Nagar" /></Field>
            </div>
            <Field label="Review" required><Textarea rows={5} value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} /></Field>
          </div>
        </Sheet>
      )}
    </>
  );
};

const EMPTY_FOUNDER = { name: '', role: '', experience: '', bio: '', img: '' };

const FoundersPanel = ({ homepage, onSaved }) => {
  const { addToast } = useToast();
  const [founders, setFounders] = useState(() => {
    const list = homepage?.founders?.length ? homepage.founders : [EMPTY_FOUNDER, EMPTY_FOUNDER];
    return list.map(f => ({ ...EMPTY_FOUNDER, ...f }));
  });
  const [saving, setSaving] = useState(false);

  const update = (i, k, v) => setFounders(list => list.map((f, j) => (j === i ? { ...f, [k]: v } : f)));

  const save = async () => {
    setSaving(true);
    try {
      // Keep any other homepage keys that are stored alongside founders
      await settingsAPI.update('homepage', { ...(homepage || {}), founders });
      addToast('About page saved');
      onSaved();
    } catch (err) {
      addToast(getErrorMessage(err, 'Could not save'), 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      {founders.map((f, i) => (
        <Card key={i} className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-950">Founder {i + 1}</h4>
            {founders.length > 1 && (
              <IconButton icon={Trash2} label="Remove founder" tone="danger" onClick={() => setFounders(list => list.filter((_, j) => j !== i))} />
            )}
          </div>
          <ImageUpload label="Photo" value={f.img} onChange={(v) => update(i, 'img', v)} onError={(m) => addToast(m, 'error')} />
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Name"><Input value={f.name} onChange={(e) => update(i, 'name', e.target.value)} /></Field>
            <Field label="Role"><Input value={f.role} onChange={(e) => update(i, 'role', e.target.value)} /></Field>
          </div>
          <Field label="Experience"><Input value={f.experience} onChange={(e) => update(i, 'experience', e.target.value)} placeholder="20+ Years Experience" /></Field>
          <Field label="Message / bio"><Textarea rows={3} value={f.bio} onChange={(e) => update(i, 'bio', e.target.value)} /></Field>
        </Card>
      ))}
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" icon={Plus} onClick={() => setFounders(list => [...list, { ...EMPTY_FOUNDER }])}>Add founder</Button>
        <Button onClick={save} loading={saving} className="ml-auto">Save About page</Button>
      </div>
    </div>
  );
};

const ContentSection = ({ settings, onSettingsSaved, onPublicChange }) => {
  const [tab, setTab] = useState('faqs');
  const current = TABS.find(t => t.id === tab);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight">Website content</h2>
        <p className="text-[13px] text-slate-500">{current.desc}</p>
      </div>
      <div className="inline-flex p-1 rounded-xl bg-slate-100 w-full sm:w-auto">
        {TABS.map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cx('flex-1 sm:flex-none h-9 px-4 rounded-lg text-[13px] font-semibold cursor-pointer transition-colors',
              tab === t.id ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-900')}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'faqs' && <FaqsPanel onPublicChange={onPublicChange} />}
      {tab === 'testimonials' && <TestimonialsPanel />}
      {tab === 'founders' && <FoundersPanel key={JSON.stringify(settings?.homepage?.founders || [])} homepage={settings?.homepage} onSaved={onSettingsSaved} />}
    </div>
  );
};

export default ContentSection;
