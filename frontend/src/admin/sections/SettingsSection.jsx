import React, { useEffect, useState } from 'react';
import { Phone, Globe, Mail, Image as ImageIcon, Send, Eye, EyeOff } from 'lucide-react';
import { settingsAPI, getErrorMessage } from '../../services/api';
import { useToast } from '../../components/common/ToastContext';
import {
  Button, Card, Field, ImageUpload, Input, StringListEditor, Textarea, cx
} from '../ui';

const GROUPS = [
  { id: 'contact', label: 'Contact', icon: Phone, desc: 'Phone numbers and address shown across the website.' },
  { id: 'web', label: 'Website', icon: Globe, desc: 'Name, logo, search engine text and footer.' },
  { id: 'email', label: 'Email', icon: Mail, desc: 'Outgoing mail used for booking confirmations.' },
  { id: 'cloudinary', label: 'Images', icon: ImageIcon, desc: 'Optional Cloudinary storage for uploaded photos.' },
];

const SaveBar = ({ onSave, saving, dirty }) => (
  <div className="flex items-center justify-end gap-3 pt-4 mt-2 border-t border-slate-100">
    {dirty && <span className="text-[12px] font-semibold text-amber-600">Unsaved changes</span>}
    <Button onClick={onSave} loading={saving} disabled={!dirty} className="min-w-[8rem]">Save</Button>
  </div>
);

const PasswordInput = (props) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input type={show ? 'text' : 'password'} autoComplete="new-password" className="pr-10" {...props} />
      <button type="button" onClick={() => setShow(s => !s)} aria-label={show ? 'Hide' : 'Show'} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-700 cursor-pointer">
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
};

// Shared state helper for one settings key
const useSettingsForm = (initial) => {
  const [form, setForm] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [saving, setSaving] = useState(false);
  const dirty = JSON.stringify(form) !== JSON.stringify(saved);
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e?.target ? e.target.value : e }));
  return { form, setForm, saved, setSaved, saving, setSaving, dirty, set };
};

const ContactPanel = ({ value, onSaved }) => {
  const { addToast } = useToast();
  const initial = {
    phoneNumbers: value?.phoneNumbers || [],
    whatsappNumber: value?.whatsappNumber || '',
    emailAddress: value?.emailAddress || '',
    emergencyContact: value?.emergencyContact || '',
    officeAddress: value?.officeAddress || '',
    workingHours: value?.workingHours || '',
    googleMapsLink: value?.googleMapsLink || '',
  };
  const s = useSettingsForm(initial);

  const save = async () => {
    s.setSaving(true);
    try {
      await settingsAPI.update('contact', { ...(value || {}), ...s.form, phoneNumbers: s.form.phoneNumbers.filter(p => p.trim()) });
      s.setSaved(s.form);
      addToast('Contact details saved');
      onSaved();
    } catch (err) {
      addToast(getErrorMessage(err, 'Could not save contact details'), 'error');
    } finally {
      s.setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <Field label="Phone numbers" hint="The first number is used for the call buttons.">
        <StringListEditor items={s.form.phoneNumbers} onChange={s.set('phoneNumbers')} placeholder="+91 92488 49388" />
      </Field>
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="WhatsApp number"><Input type="tel" value={s.form.whatsappNumber} onChange={s.set('whatsappNumber')} placeholder="+91 92488 49388" /></Field>
        <Field label="Emergency number"><Input type="tel" value={s.form.emergencyContact} onChange={s.set('emergencyContact')} /></Field>
      </div>
      <Field label="Email address"><Input type="email" value={s.form.emailAddress} onChange={s.set('emailAddress')} /></Field>
      <Field label="Office address"><Textarea rows={2} value={s.form.officeAddress} onChange={s.set('officeAddress')} /></Field>
      <Field label="Working hours"><Input value={s.form.workingHours} onChange={s.set('workingHours')} placeholder="Open 24/7 for emergencies" /></Field>
      <Field label="Google Maps embed link" hint="From Google Maps → Share → Embed a map → copy the src URL.">
        <Input value={s.form.googleMapsLink} onChange={s.set('googleMapsLink')} />
      </Field>
      <SaveBar onSave={save} saving={s.saving} dirty={s.dirty} />
    </div>
  );
};

const WebPanel = ({ value, onSaved }) => {
  const { addToast } = useToast();
  const initial = {
    companyName: value?.companyName || '',
    logoUrl: value?.logoUrl || '',
    faviconUrl: value?.faviconUrl || '',
    seoTitle: value?.seoTitle || '',
    seoDescription: value?.seoDescription || '',
    footerContent: value?.footerContent || '',
    copyright: value?.copyright || '',
    googleAnalyticsCode: value?.googleAnalyticsCode || '',
  };
  const s = useSettingsForm(initial);

  const save = async () => {
    s.setSaving(true);
    try {
      // Merge so keys this form doesn't edit (e.g. brand colours) are kept
      await settingsAPI.update('web', { ...(value || {}), ...s.form });
      s.setSaved(s.form);
      addToast('Website settings saved');
      onSaved();
    } catch (err) {
      addToast(getErrorMessage(err, 'Could not save website settings'), 'error');
    } finally {
      s.setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <Field label="Business name"><Input value={s.form.companyName} onChange={s.set('companyName')} placeholder="Nest Cares" /></Field>
      <div className="grid sm:grid-cols-2 gap-4">
        <ImageUpload label="Logo" value={s.form.logoUrl} onChange={s.set('logoUrl')} onError={(m) => addToast(m, 'error')} />
        <ImageUpload label="Browser tab icon" value={s.form.faviconUrl} onChange={s.set('faviconUrl')} onError={(m) => addToast(m, 'error')} />
      </div>
      <div className="pt-2">
        <div className="text-[12px] font-bold uppercase tracking-wider text-slate-400 mb-3">Google search</div>
        <div className="space-y-4">
          <Field label="Page title" hint={`${s.form.seoTitle.length}/60 characters`}>
            <Input value={s.form.seoTitle} onChange={s.set('seoTitle')} />
          </Field>
          <Field label="Description" hint={`${s.form.seoDescription.length}/160 characters`}>
            <Textarea rows={3} value={s.form.seoDescription} onChange={s.set('seoDescription')} />
          </Field>
          <Field label="Google Analytics ID"><Input value={s.form.googleAnalyticsCode} onChange={s.set('googleAnalyticsCode')} placeholder="G-XXXXXXXXXX" /></Field>
        </div>
      </div>
      <div className="pt-2">
        <div className="text-[12px] font-bold uppercase tracking-wider text-slate-400 mb-3">Footer</div>
        <div className="space-y-4">
          <Field label="Footer text"><Textarea rows={2} value={s.form.footerContent} onChange={s.set('footerContent')} /></Field>
          <Field label="Copyright line"><Input value={s.form.copyright} onChange={s.set('copyright')} /></Field>
        </div>
      </div>
      <SaveBar onSave={save} saving={s.saving} dirty={s.dirty} />
    </div>
  );
};

const EmailPanel = () => {
  const { addToast } = useToast();
  const [full, setFull] = useState(null);
  const [loadError, setLoadError] = useState('');
  const s = useSettingsForm({ smtpHost: '', smtpPort: '', smtpUser: '', smtpPass: '', businessEmail: '', senderName: '' });
  const [testTo, setTestTo] = useState('');
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    settingsAPI.getEmailConfig()
      .then(res => {
        const v = res.data || {};
        setFull(v);
        const next = {
          smtpHost: v.smtpHost || '', smtpPort: String(v.smtpPort || ''), smtpUser: v.smtpUser || '',
          smtpPass: v.smtpPass || '', businessEmail: v.businessEmail || '', senderName: v.senderName || ''
        };
        s.setForm(next);
        s.setSaved(next);
        setTestTo(v.businessEmail || '');
      })
      .catch(err => {
        if (err.response?.status === 404) setFull({});
        else setLoadError(getErrorMessage(err, 'Could not load email settings'));
      });
  }, []);

  const save = async () => {
    s.setSaving(true);
    try {
      // Merge so saved email templates are preserved
      await settingsAPI.update('email', { ...(full || {}), ...s.form });
      setFull(f => ({ ...(f || {}), ...s.form }));
      s.setSaved(s.form);
      addToast('Email settings saved');
    } catch (err) {
      addToast(getErrorMessage(err, 'Could not save email settings'), 'error');
    } finally {
      s.setSaving(false);
    }
  };

  const sendTest = async () => {
    setTesting(true);
    try {
      const res = await settingsAPI.sendTestEmail(testTo);
      addToast(res.message || 'Test email sent');
    } catch (err) {
      addToast(getErrorMessage(err, 'Test email failed'), 'error');
    } finally {
      setTesting(false);
    }
  };

  if (loadError) return <p className="text-sm text-rose-600">{loadError}</p>;
  if (!full) return <div className="h-40 rounded-2xl bg-slate-100 animate-pulse" />;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[1fr_6rem] gap-3">
        <Field label="SMTP server"><Input value={s.form.smtpHost} onChange={s.set('smtpHost')} placeholder="smtp.gmail.com" /></Field>
        <Field label="Port"><Input inputMode="numeric" value={s.form.smtpPort} onChange={s.set('smtpPort')} placeholder="465" /></Field>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Username"><Input value={s.form.smtpUser} onChange={s.set('smtpUser')} autoComplete="off" /></Field>
        <Field label="Password / app password"><PasswordInput value={s.form.smtpPass} onChange={s.set('smtpPass')} /></Field>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Sender name"><Input value={s.form.senderName} onChange={s.set('senderName')} placeholder="Nest Cares Support" /></Field>
        <Field label="Business email" hint="New booking alerts are sent here."><Input type="email" value={s.form.businessEmail} onChange={s.set('businessEmail')} /></Field>
      </div>
      <SaveBar onSave={save} saving={s.saving} dirty={s.dirty} />

      <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 sm:p-4">
        <div className="text-sm font-semibold text-slate-900">Send a test email</div>
        <p className="text-[12px] text-slate-500 mb-3">Save first, then check the settings work.</p>
        <div className="flex gap-2">
          <Input type="email" value={testTo} onChange={(e) => setTestTo(e.target.value)} placeholder="you@example.com" />
          <Button variant="secondary" icon={Send} onClick={sendTest} loading={testing} disabled={!testTo || s.dirty}>Send</Button>
        </div>
      </div>
    </div>
  );
};

const CloudinaryPanel = () => {
  const { addToast } = useToast();
  const [loaded, setLoaded] = useState(false);
  const s = useSettingsForm({ cloudName: '', apiKey: '', apiSecret: '' });

  useEffect(() => {
    settingsAPI.getCloudinaryConfig()
      .then(res => {
        const v = { cloudName: '', apiKey: '', apiSecret: '', ...(res.data || {}) };
        s.setForm(v);
        s.setSaved(v);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const save = async () => {
    s.setSaving(true);
    try {
      await settingsAPI.update('cloudinary', s.form);
      s.setSaved(s.form);
      addToast('Image storage settings saved');
    } catch (err) {
      addToast(getErrorMessage(err, 'Could not save'), 'error');
    } finally {
      s.setSaving(false);
    }
  };

  if (!loaded) return <div className="h-40 rounded-2xl bg-slate-100 animate-pulse" />;

  return (
    <div className="space-y-4">
      <p className="text-[13px] text-slate-500">Leave empty to store uploaded photos on the server instead.</p>
      <Field label="Cloud name"><Input value={s.form.cloudName} onChange={s.set('cloudName')} autoComplete="off" /></Field>
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="API key"><Input value={s.form.apiKey} onChange={s.set('apiKey')} autoComplete="off" /></Field>
        <Field label="API secret"><PasswordInput value={s.form.apiSecret} onChange={s.set('apiSecret')} /></Field>
      </div>
      <SaveBar onSave={save} saving={s.saving} dirty={s.dirty} />
    </div>
  );
};

const SettingsSection = ({ settings, onSettingsSaved }) => {
  const [group, setGroup] = useState('contact');
  const current = GROUPS.find(g => g.id === group);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight">Settings</h2>
        <p className="text-[13px] text-slate-500">{current.desc}</p>
      </div>

      <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-slate-100 sm:inline-flex">
        {GROUPS.map(g => (
          <button
            key={g.id}
            type="button"
            onClick={() => setGroup(g.id)}
            className={cx('h-10 sm:h-9 px-2 sm:px-4 rounded-lg text-[12px] sm:text-[13px] font-semibold flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 cursor-pointer transition-colors',
              group === g.id ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-900')}
          >
            <g.icon className="w-4 h-4 hidden sm:block" />
            {g.label}
          </button>
        ))}
      </div>

      <Card className="p-4 sm:p-6 max-w-3xl">
        {group === 'contact' && <ContactPanel key={JSON.stringify(settings?.contact || {})} value={settings?.contact} onSaved={onSettingsSaved} />}
        {group === 'web' && <WebPanel key={JSON.stringify(settings?.web || {})} value={settings?.web} onSaved={onSettingsSaved} />}
        {group === 'email' && <EmailPanel />}
        {group === 'cloudinary' && <CloudinaryPanel />}
      </Card>
    </div>
  );
};

export default SettingsSection;
