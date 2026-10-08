import React, { useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, UserCheck } from 'lucide-react';
import { doctorsAPI, getErrorMessage } from '../../services/api';
import { useToast } from '../../components/common/ToastContext';
import { resolveImageUrl } from '../../utils/url';
import {
  Button, Card, EmptyState, Field, IconButton, ImageUpload, Input, LoadingRows,
  Pill, SearchInput, Sheet, Textarea, Toggle, SectionTitle
} from '../ui';

const EMPTY_DOCTOR = {
  name: '',
  specialty: '',
  qualifications: 'MBBS',
  experience: '',
  regNumber: '',
  image: '',
  phone: '',
  email: '',
  bio: '',
  availability: 'Available for Home Visits',
  displayOrder: 0,
  isActive: true
};

const DoctorEditor = ({ doctor, nextOrder, onClose, onSaved }) => {
  const { addToast } = useToast();
  const isNew = !doctor._id;
  const [form, setForm] = useState(() => isNew
    ? { ...EMPTY_DOCTOR, displayOrder: nextOrder }
    : { ...EMPTY_DOCTOR, ...doctor, isActive: doctor.isActive !== false });
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e?.target ? e.target.value : e }));

  const save = async (e) => {
    e?.preventDefault();
    if (!form.name.trim() || !form.specialty.trim()) {
      addToast('Name and specialty are required', 'error');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, displayOrder: Number(form.displayOrder) || 0 };
      const res = isNew ? await doctorsAPI.create(payload) : await doctorsAPI.update(doctor._id, payload);
      if (res.success) {
        addToast(isNew ? 'Doctor added' : 'Doctor updated');
        onSaved();
        onClose();
      }
    } catch (err) {
      addToast(getErrorMessage(err, 'Could not save doctor'), 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet
      open
      onClose={onClose}
      title={isNew ? 'Add doctor' : 'Edit doctor'}
      footer={
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={save} loading={saving} className="flex-1 sm:flex-none">{isNew ? 'Add doctor' : 'Save changes'}</Button>
        </div>
      }
    >
      <form onSubmit={save} className="space-y-4">
        <ImageUpload label="Photo" value={form.image} onChange={set('image')} onError={(m) => addToast(m, 'error')} />
        <Field label="Full name" required>
          <Input value={form.name} onChange={set('name')} placeholder="Dr. K. Srinivas Reddy" />
        </Field>
        <Field label="Specialty" required>
          <Input value={form.specialty} onChange={set('specialty')} placeholder="General Physician & Geriatrician" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Qualifications">
            <Input value={form.qualifications} onChange={set('qualifications')} placeholder="MBBS, MD" />
          </Field>
          <Field label="Experience">
            <Input value={form.experience} onChange={set('experience')} placeholder="12+ Years" />
          </Field>
        </div>
        <Field label="Availability">
          <Input value={form.availability} onChange={set('availability')} placeholder="Mon – Sat, 9 AM – 7 PM" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Phone">
            <Input type="tel" value={form.phone} onChange={set('phone')} />
          </Field>
          <Field label="Email">
            <Input type="email" value={form.email} onChange={set('email')} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Registration no.">
            <Input value={form.regNumber} onChange={set('regNumber')} />
          </Field>
          <Field label="Display order" hint="Lower shows first">
            <Input type="number" inputMode="numeric" value={form.displayOrder} onChange={set('displayOrder')} />
          </Field>
        </div>
        <Field label="Short bio">
          <Textarea value={form.bio} onChange={set('bio')} rows={3} />
        </Field>
        <Toggle checked={form.isActive} onChange={set('isActive')} label="Show on website" desc="Hidden doctors stay saved but are not listed publicly." />
        <button type="submit" className="hidden" />
      </form>
    </Sheet>
  );
};

const DoctorsSection = ({ doctors, loading, onChanged }) => {
  const { addToast } = useToast();
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return doctors;
    return doctors.filter(d => [d.name, d.specialty, d.qualifications].some(v => v && v.toLowerCase().includes(q)));
  }, [doctors, search]);

  const toggleActive = async (doc) => {
    try {
      await doctorsAPI.update(doc._id, { isActive: doc.isActive === false });
      addToast(doc.isActive === false ? `${doc.name} is now visible` : `${doc.name} is now hidden`);
      onChanged();
    } catch (err) {
      addToast(getErrorMessage(err, 'Could not update doctor'), 'error');
    }
  };

  const remove = async (doc) => {
    if (!window.confirm(`Delete ${doc.name}? This cannot be undone.`)) return;
    try {
      await doctorsAPI.delete(doc._id);
      addToast('Doctor deleted');
      onChanged();
    } catch (err) {
      addToast(getErrorMessage(err, 'Could not delete doctor'), 'error');
    }
  };

  return (
    <div className="space-y-4">
      <SectionTitle
        title="Doctors"
        desc="Profiles shown on the website's doctors pages."
        action={<Button icon={Plus} size="sm" onClick={() => setEditing({})}>Add</Button>}
      />

      {doctors.length > 4 && <SearchInput value={search} onChange={setSearch} placeholder="Search doctors…" />}

      {loading && doctors.length === 0 ? (
        <LoadingRows rows={3} />
      ) : filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={UserCheck}
            title={doctors.length ? 'No doctors match' : 'No doctors yet'}
            desc={doctors.length ? 'Try another search.' : 'Add your first doctor profile.'}
            action={!doctors.length && <Button icon={Plus} onClick={() => setEditing({})}>Add doctor</Button>}
          />
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map(doc => {
            const active = doc.isActive !== false;
            return (
              <Card key={doc._id} className="p-4 flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <img
                    src={resolveImageUrl(doc.image) || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200'}
                    alt={doc.name}
                    className={`h-14 w-14 rounded-xl object-cover bg-slate-100 shrink-0 ${active ? '' : 'grayscale opacity-60'}`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-slate-950 truncate">{doc.name}</div>
                    <div className="text-[13px] text-slate-600 truncate">{doc.specialty}</div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {active ? <Pill tone="green">On website</Pill> : <Pill>Hidden</Pill>}
                      {doc.experience && <Pill>{doc.experience}</Pill>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-2 -mb-1">
                  <button type="button" onClick={() => toggleActive(doc)} className="text-[13px] font-semibold text-slate-600 hover:text-slate-950 cursor-pointer">
                    {active ? 'Hide from website' : 'Show on website'}
                  </button>
                  <div className="flex">
                    <IconButton icon={Pencil} label={`Edit ${doc.name}`} onClick={() => setEditing(doc)} />
                    <IconButton icon={Trash2} label={`Delete ${doc.name}`} tone="danger" onClick={() => remove(doc)} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {editing && (
        <DoctorEditor
          doctor={editing}
          nextOrder={doctors.length + 1}
          onClose={() => setEditing(null)}
          onSaved={onChanged}
        />
      )}
    </div>
  );
};

export default DoctorsSection;
