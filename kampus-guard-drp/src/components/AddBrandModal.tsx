import React, { useState } from 'react';
import { X, Building2, Plus } from 'lucide-react';
import { createBrandAPI } from '../utils/api';

interface AddBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBrandCreated: (brandName: string) => void;
}

export const AddBrandModal: React.FC<AddBrandModalProps> = ({
  isOpen,
  onClose,
  onBrandCreated
}) => {
  const [brandName, setBrandName] = useState('');
  const [website, setWebsite] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [developer, setDeveloper] = useState('');
  const [handlesInput, setHandlesInput] = useState('');
  const [appsInput, setAppsInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim() || !website.trim()) {
      setError('Brand Name and Official Website are required.');
      return;
    }

    setLoading(true);
    setError(null);

    const handles = handlesInput
      .split(',')
      .map(h => h.trim())
      .filter(h => h.length > 0);

    const apps = appsInput
      .split(',')
      .map(a => a.trim())
      .filter(a => a.length > 0);

    try {
      await createBrandAPI({
        brand_name: brandName.trim(),
        official_website: website.trim(),
        official_logo_url: logoUrl.trim() || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
        official_developer: developer.trim() || `${brandName.trim()} Inc.`,
        official_handles: handles,
        official_apps: apps
      });

      onBrandCreated(brandName.trim());
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error saving brand to database.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121824] border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-white space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Register New Brand Baseline</h2>
              <p className="text-xs text-slate-400">Add official assets for 0% False Positive Whitelisting</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs p-3 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Brand Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Digital Risk Protection Platform, Acme Global"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="w-full bg-[#0a0e17] border border-slate-800 focus:border-orange-500 rounded-xl px-3.5 py-2.5 text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Official Website *</label>
              <input
                type="url"
                required
                placeholder="https://example.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full bg-[#0a0e17] border border-slate-800 focus:border-orange-500 rounded-xl px-3.5 py-2.5 text-white focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Official Developer Name</label>
              <input
                type="text"
                placeholder="e.g. Acme Technologies Ltd"
                value={developer}
                onChange={(e) => setDeveloper(e.target.value)}
                className="w-full bg-[#0a0e17] border border-slate-800 focus:border-orange-500 rounded-xl px-3.5 py-2.5 text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Official Logo URL (Optional)</label>
            <input
              type="url"
              placeholder="https://example.com/logo.png"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              className="w-full bg-[#0a0e17] border border-slate-800 focus:border-orange-500 rounded-xl px-3.5 py-2.5 text-white focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Official Social Handles (Comma-separated)</label>
            <input
              type="text"
              placeholder="@acme, @acme_hq, company/acme-corp"
              value={handlesInput}
              onChange={(e) => setHandlesInput(e.target.value)}
              className="w-full bg-[#0a0e17] border border-slate-800 focus:border-orange-500 rounded-xl px-3.5 py-2.5 text-white focus:outline-none font-mono"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">Handles entered here are permanently whitelisted (0% false positives).</span>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Official App Package IDs (Comma-separated)</label>
            <input
              type="text"
              placeholder="com.acme.app, com.acme.portal"
              value={appsInput}
              onChange={(e) => setAppsInput(e.target.value)}
              className="w-full bg-[#0a0e17] border border-slate-800 focus:border-orange-500 rounded-xl px-3.5 py-2.5 text-white focus:outline-none font-mono"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800/80">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-300 hover:bg-slate-800/60 font-semibold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs shadow-lg shadow-orange-500/20 disabled:opacity-50 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              {loading ? 'Saving Brand...' : 'Save Brand Baseline'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
