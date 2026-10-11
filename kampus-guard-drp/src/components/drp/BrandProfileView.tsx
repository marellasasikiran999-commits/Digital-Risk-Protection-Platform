import React, { useEffect, useState } from 'react';
import { Building2, Check, Globe, Loader2, Plus, Save, ShieldCheck, X } from 'lucide-react';
import type { Brand } from '../../utils/api';
import { createBrandAPI, updateBrandAPI } from '../../utils/api';
import { SectionHeader } from './SectionHeader';

interface BrandProfileViewProps {
  brands: Brand[];
  selectedBrand: string;
  onSelectBrand: (brandName: string) => void;
  onChanged: () => Promise<void> | void;
  findingsCount: number;
}

interface BrandForm {
  brand_name: string;
  official_website: string;
  official_logo_url: string;
  official_developer: string;
  official_handles: string;
  official_apps: string;
}

const EMPTY_FORM: BrandForm = {
  brand_name: '',
  official_website: '',
  official_logo_url: '',
  official_developer: '',
  official_handles: '',
  official_apps: '',
};

const toForm = (brand: Brand): BrandForm => ({
  brand_name: brand.brand_name,
  official_website: brand.official_website || '',
  official_logo_url: brand.official_logo_url || '',
  official_developer: brand.official_developer || '',
  official_handles: (brand.official_handles || []).join('\n'),
  official_apps: (brand.official_apps || []).join('\n'),
});

const splitLines = (value: string): string[] =>
  value.split('\n').map((line) => line.trim()).filter(Boolean);

interface FieldProps {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}

const Field: React.FC<FieldProps> = ({ label, hint, required = false, children }) => (
  <label className="block space-y-1.5">
    <span className="block text-[11px] font-semibold text-slate-300">
      {label}
      {required && <span className="text-rose-400"> *</span>}
    </span>
    {children}
    {hint && <span className="block text-[10px] text-slate-500">{hint}</span>}
  </label>
);

const INPUT_CLASS =
  'w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-cyan-500/60';

/**
 * Brand Profile - the definition of a brand's legitimate assets. Everything the
 * detection engines do is measured against the baseline captured here, and the
 * assets listed are the ones explicitly excluded from flagging.
 */
export const BrandProfileView: React.FC<BrandProfileViewProps> = ({
  brands, selectedBrand, onSelectBrand, onChanged, findingsCount,
}) => {
  const active = brands.find((brand) => brand.brand_name === selectedBrand) || brands[0] || null;
  const [form, setForm] = useState<BrandForm>(EMPTY_FORM);
  const [mode, setMode] = useState<'edit' | 'create'>('edit');
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (active && mode === 'edit') setForm(toForm(active));
  }, [active, mode]);

  const setField = (field: keyof BrandForm, value: string) =>
    setForm((previous) => ({ ...previous, [field]: value }));

  const flash = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 3200);
  };

  const submit = async () => {
    if (!form.brand_name.trim()) {
      flash('A brand name is required.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        brand_name: form.brand_name.trim(),
        official_website: form.official_website.trim(),
        official_logo_url: form.official_logo_url.trim(),
        official_developer: form.official_developer.trim() || form.brand_name.trim(),
        official_handles: splitLines(form.official_handles),
        official_apps: splitLines(form.official_apps),
      };

      if (mode === 'create') {
        await createBrandAPI(payload);
        onSelectBrand(payload.brand_name);
        flash(`Brand baseline created for ${payload.brand_name}.`);
        setMode('edit');
      } else if (active) {
        await updateBrandAPI(active.id, payload);
        flash(`Baseline updated for ${payload.brand_name}.`);
      }

      await onChanged();
    } catch {
      flash('Could not persist the brand baseline. Check the backend connection.');
    } finally {
      setSaving(false);
    }
  };

  const startCreate = () => {
    setMode('create');
    setForm(EMPTY_FORM);
  };

  const startEdit = (brand: Brand) => {
    setMode('edit');
    onSelectBrand(brand.brand_name);
    setForm(toForm(brand));
  };
return (
    <div className="space-y-5">
      <SectionHeader
        eyebrow="Brand profile"
        title="Define the brand's legitimate assets"
        subtitle="The baseline registered here drives every detection. Official handles and official applications are matched first and excluded from flagging, which is what keeps the false-positive rate at zero."
        stats={[
          { label: 'Registered brands', value: brands.length, tone: 'accent' },
          { label: 'Official handles', value: (active?.official_handles || []).length, tone: 'safe' },
          { label: 'Official apps', value: (active?.official_apps || []).length, tone: 'safe' },
          { label: 'Findings on record', value: findingsCount },
        ]}
      />

      {notice && (
        <div className="flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2.5 text-xs font-medium text-cyan-200">
          <Check className="h-3.5 w-3.5" />
          {notice}
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[300px_1fr]">
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wide text-slate-400">Protected brands</h2>

          <div className="space-y-2">
            {brands.map((brand) => {
              const isActive = active?.id === brand.id;
              return (
                <button
                  key={brand.id}
                  type="button"
                  onClick={() => startEdit(brand)}
                  className={`w-full rounded-xl border p-3 text-left transition-colors ${
                    isActive
                      ? 'border-cyan-500/40 bg-cyan-500/[0.07]'
                      : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Building2 className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span className="truncate text-xs font-semibold text-white">{brand.brand_name}</span>
                  </div>
                  <p className="mt-1 truncate text-[10px] text-slate-500">
                    {brand.official_website || 'No website set'}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2 font-mono text-[10px] text-slate-400">
                    <span>{brand.official_handles.length} handles</span>
                    <span className="text-slate-600">·</span>
                    <span>{brand.official_apps.length} apps</span>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={startCreate}
            className={`flex w-full items-center justify-center gap-2 rounded-xl border border-dashed px-3 py-2.5 text-xs font-semibold transition-colors ${
              mode === 'create'
                ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-300'
                : 'border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-200'
            }`}
          >
            <Plus className="h-3.5 w-3.5" />
            Register a new brand
          </button>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white">
                {mode === 'create' ? 'New brand baseline' : `Baseline — ${active?.brand_name || 'none selected'}`}
              </h2>
            </div>
            {mode === 'create' && (
              <button
                type="button"
                onClick={() => {
                  setMode('edit');
                  if (active) setForm(toForm(active));
                }}
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 hover:text-slate-200"
              >
                <X className="h-3.5 w-3.5" />
                Cancel
              </button>
            )}
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Brand / company name" required>
              <input
                value={form.brand_name}
                onChange={(event) => setField('brand_name', event.target.value)}
                placeholder="Acme Corporation"
                className={INPUT_CLASS}
              />
            </Field>

            <Field label="Official website">
              <input
                value={form.official_website}
                onChange={(event) => setField('official_website', event.target.value)}
                placeholder="www.acme.com"
                className={`${INPUT_CLASS} font-mono`}
              />
            </Field>

            <Field label="Authorised publisher / developer">
              <input
                value={form.official_developer}
                onChange={(event) => setField('official_developer', event.target.value)}
                placeholder="Acme Mobile Ltd"
                className={INPUT_CLASS}
              />
            </Field>

            <Field label="Official logo URL">
              <input
                value={form.official_logo_url}
                onChange={(event) => setField('official_logo_url', event.target.value)}
                placeholder="https://example.com/logo.png"
                className={`${INPUT_CLASS} font-mono`}
              />
            </Field>

            <Field label="Official social handles" hint="One per line. These are excluded from flagging.">
              <textarea
                value={form.official_handles}
                onChange={(event) => setField('official_handles', event.target.value)}
                rows={5}
                placeholder={'@acme\n@acme_support\ncompany/acme'}
                className={`${INPUT_CLASS} resize-y font-mono`}
              />
            </Field>

            <Field label="Official application package IDs" hint="One per line. The publisher must also match.">
              <textarea
                value={form.official_apps}
                onChange={(event) => setField('official_apps', event.target.value)}
                rows={5}
                placeholder={'com.acme.app\nid.acme.ios'}
                className={`${INPUT_CLASS} resize-y font-mono`}
              />
            </Field>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-800 pt-4">
            <button
              type="button"
              onClick={submit}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-xs font-bold text-slate-950 transition-colors hover:bg-cyan-400 disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              {mode === 'create' ? 'Create baseline' : 'Save baseline'}
            </button>

            {mode === 'edit' && active && (
              <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500">
                <Globe className="h-3.5 w-3.5" />
                Changes apply to the next scan you run.
              </span>
            )}
          </div>

          {mode === 'edit' && active && (
            <div className="mt-5 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.04] p-4">
              <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-300">Exclusion rule active</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-300">
                {active.official_handles.length} official handle
                {active.official_handles.length === 1 ? '' : 's'} and {active.official_apps.length} official application
                {active.official_apps.length === 1 ? '' : 's'} are registered. Any candidate matching the baseline is
                recorded as verified and scored 0, so the brand's own presence never appears as a threat.
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {active.official_handles.map((handle) => (
                  <span
                    key={handle}
                    className="rounded-md border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-200"
                  >
                    {handle}
                  </span>
                ))}
                {active.official_apps.map((app) => (
                  <span
                    key={app}
                    className="rounded-md border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-200"
                  >
                    {app}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
