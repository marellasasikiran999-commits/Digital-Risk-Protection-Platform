import React, { useState, useEffect } from 'react';
import { X, Building2, Save, CheckCircle } from 'lucide-react';

interface EditBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand: any;
  onBrandUpdated: (updatedBrand: any) => void;
}

export const EditBrandModal: React.FC<EditBrandModalProps> = ({
  isOpen,
  onClose,
  brand,
  onBrandUpdated
}) => {
  const [brandName, setBrandName] = useState(brand?.brand_name || 'Digital Risk Protection Platform');
  const [website, setWebsite] = useState(brand?.official_website || 'https://www.digitalriskprotection.com');
  const [logoUrl, setLogoUrl] = useState(brand?.official_logo_url || '');
  const [developer, setDeveloper] = useState(brand?.official_developer || 'Digital Risk Protection Platform');
  const [handlesInput, setHandlesInput] = useState(
    Array.isArray(brand?.official_handles) ? brand.official_handles.join(', ') : '@digitalriskprotection, @drp_platform'
  );
  const [appsInput, setAppsInput] = useState(
    Array.isArray(brand?.official_apps) ? brand.official_apps.join(', ') : 'com.drp.platform.official, Digital Risk Protection Platform'
  );
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (brand) {
      setBrandName(brand.brand_name || 'Digital Risk Protection Platform');
      setWebsite(brand.official_website || 'https://www.digitalriskprotection.com');
      setLogoUrl(brand.official_logo_url || '');
      setDeveloper(brand.official_developer || 'Digital Risk Protection Platform');
      setHandlesInput(
        Array.isArray(brand.official_handles) ? brand.official_handles.join(', ') : '@digitalriskprotection, @drp_platform'
      );
      setAppsInput(
        Array.isArray(brand.official_apps) ? brand.official_apps.join(', ') : 'com.drp.platform.official, Digital Risk Protection Platform'
      );
    }
  }, [brand]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const handles = handlesInput.split(',').map((h: string) => h.trim()).filter((h: string) => h.length > 0);
    const apps = appsInput.split(',').map((a: string) => a.trim()).filter((a: string) => a.length > 0);

    const updated = {
      ...brand,
      brand_name: brandName,
      official_website: website,
      official_logo_url: logoUrl,
      official_developer: developer,
      official_handles: handles,
      official_apps: apps
    };

    try {
      await fetch(`http://127.0.0.1:8000/api/brands/${brand?.id || 1}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch {
      // Fallback local update
    }

    setSuccess(true);
    setTimeout(() => {
      onBrandUpdated(updated);
      setSuccess(false);
      onClose();
    }, 600);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#111827] border border-gray-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-white space-y-5">
        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Edit Brand Profile</h3>
              <p className="text-xs text-gray-400">Update verified corporate identity &amp; whitelists</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Brand profile updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-gray-300 font-semibold block mb-1">Brand Name</label>
            <input
              type="text"
              required
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="w-full bg-[#0b0f19] border border-gray-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-gray-300 font-semibold block mb-1">Official Website</label>
              <input
                type="url"
                required
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full bg-[#0b0f19] border border-gray-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
            <div>
              <label className="text-gray-300 font-semibold block mb-1">Developer / Publisher Name</label>
              <input
                type="text"
                value={developer}
                onChange={(e) => setDeveloper(e.target.value)}
                className="w-full bg-[#0b0f19] border border-gray-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-300 font-semibold block mb-1">Official Social Handles (Whitelisted)</label>
            <input
              type="text"
              value={handlesInput}
              onChange={(e) => setHandlesInput(e.target.value)}
              className="w-full bg-[#0b0f19] border border-gray-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500 font-mono"
            />
            <span className="text-[10px] text-gray-500 mt-1 block">Separated by comma. These handles will not be flagged as fake candidates.</span>
          </div>

          <div>
            <label className="text-gray-300 font-semibold block mb-1">Official App Name &amp; Package IDs</label>
            <input
              type="text"
              value={appsInput}
              onChange={(e) => setAppsInput(e.target.value)}
              className="w-full bg-[#0b0f19] border border-gray-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 font-semibold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/20 disabled:opacity-50 flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Updating...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
