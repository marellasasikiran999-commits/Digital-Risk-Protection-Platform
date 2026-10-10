import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Trash2, Globe, Smartphone, Check, Edit3, Building2 } from 'lucide-react';
import type { OfficialBrandAsset, PlatformType, AppStoreType } from '../types';
import { INITIAL_BRAND_ASSETS } from '../data/mockData';

interface BrandProfileManagerProps {
  brandAsset?: OfficialBrandAsset;
  onUpdateBrandAsset?: (updated: OfficialBrandAsset) => void;
  brands?: any[];
  selectedBrand?: string;
  onSelectBrand?: (b: string) => void;
  onOpenAddBrand?: () => void;
}

export const BrandProfileManager: React.FC<BrandProfileManagerProps> = ({
  brandAsset: initialAsset,
  onUpdateBrandAsset,
  selectedBrand = 'Digital Risk Protection Platform',
  onOpenAddBrand
}) => {
  const defaultAsset = initialAsset || INITIAL_BRAND_ASSETS[selectedBrand] || INITIAL_BRAND_ASSETS['Digital Risk Protection Platform'];
  const [currentAsset, setCurrentAsset] = useState<OfficialBrandAsset>(defaultAsset);

  const [newHandle, setNewHandle] = useState('');
  const [newPlatform, setNewPlatform] = useState<PlatformType>('twitter');
  const [newAppId, setNewAppId] = useState('');
  const [newAppName, setNewAppName] = useState('');
  const [newAppStore, setNewAppStore] = useState<AppStoreType>('google_play');
  const [isEditingWebsite, setIsEditingWebsite] = useState(false);
  const [websiteInput, setWebsiteInput] = useState(defaultAsset.officialWebsite);
  const [savedToast, setSavedToast] = useState(false);

  useEffect(() => {
    const asset = initialAsset || INITIAL_BRAND_ASSETS[selectedBrand] || INITIAL_BRAND_ASSETS['Digital Risk Protection Platform'];
    setCurrentAsset(asset);
    setWebsiteInput(asset.officialWebsite);
  }, [initialAsset, selectedBrand]);

  const updateAsset = (updated: OfficialBrandAsset) => {
    setCurrentAsset(updated);
    if (onUpdateBrandAsset) {
      onUpdateBrandAsset(updated);
    }
    // Also save in localStorage for local persistence
    localStorage.setItem(`brand_asset_${updated.brandName}`, JSON.stringify(updated));
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const handleAddSocial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHandle) return;
    const updated: OfficialBrandAsset = {
      ...currentAsset,
      officialHandles: [
        ...currentAsset.officialHandles,
        {
          platform: newPlatform,
          handle: newHandle.startsWith('@') ? newHandle : `@${newHandle}`,
          url: `https://${newPlatform}.com/${newHandle.replace('@', '')}`,
          verified: true
        }
      ]
    };
    updateAsset(updated);
    setNewHandle('');
  };

  const handleRemoveSocial = (handleStr: string) => {
    const updated: OfficialBrandAsset = {
      ...currentAsset,
      officialHandles: currentAsset.officialHandles.filter(h => h.handle !== handleStr)
    };
    updateAsset(updated);
  };

  const handleAddApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppId || !newAppName) return;
    const updated: OfficialBrandAsset = {
      ...currentAsset,
      officialApps: [
        ...currentAsset.officialApps,
        {
          store: newAppStore,
          appId: newAppId,
          appName: newAppName,
          publisherName: currentAsset.officialPublishers[0] || `${currentAsset.brandName} Security Corp`,
          iconUrl: currentAsset.officialLogoUrl
        }
      ]
    };
    updateAsset(updated);
    setNewAppId('');
    setNewAppName('');
  };

  const handleRemoveApp = (appIdStr: string) => {
    const updated: OfficialBrandAsset = {
      ...currentAsset,
      officialApps: currentAsset.officialApps.filter(a => a.appId !== appIdStr)
    };
    updateAsset(updated);
  };

  const handleSaveWebsite = () => {
    const updated: OfficialBrandAsset = {
      ...currentAsset,
      officialWebsite: websiteInput
    };
    updateAsset(updated);
    setIsEditingWebsite(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Brand Profile &amp; Asset Whitelist
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                0% False Positive Baseline
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified corporate assets for <strong className="text-white">{currentAsset.brandName}</strong>. Any candidates matching these items are excluded from alerts.
            </p>
          </div>
        </div>

        {onOpenAddBrand && (
          <button
            onClick={onOpenAddBrand}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-blue-600/30 transition-all"
          >
            <Plus className="w-4 h-4" /> Add New Brand
          </button>
        )}
      </div>

      {savedToast && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Brand baseline saved to database! Survives browser refresh.</span>
        </div>
      )}

      {/* Official Website Card */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white">Official Primary Domain</h3>
          </div>
          {!isEditingWebsite ? (
            <button
              onClick={() => setIsEditingWebsite(true)}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit Domain
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveWebsite}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditingWebsite(false)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {isEditingWebsite ? (
          <input
            type="text"
            value={websiteInput}
            onChange={(e) => setWebsiteInput(e.target.value)}
            className="w-full bg-[#141e33] border border-slate-700 rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
          />
        ) : (
          <div className="p-3 bg-[#121c30] rounded-xl border border-slate-800 flex items-center justify-between text-xs">
            <span className="font-mono text-white font-semibold">{currentAsset.officialWebsite}</span>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Trademark Owner
            </span>
          </div>
        )}
      </div>

      {/* Verified Handles & Apps Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Verified Social Channels */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center justify-between">
            <span>Verified Social Channels ({currentAsset.officialHandles.length})</span>
            <span className="text-[10px] text-emerald-400 uppercase font-bold">Whitelisted</span>
          </h3>

          <form onSubmit={handleAddSocial} className="flex gap-2 text-xs">
            <select
              value={newPlatform}
              onChange={(e) => setNewPlatform(e.target.value as any)}
              className="bg-[#141e33] border border-slate-700 rounded-xl px-2.5 py-2 text-white focus:outline-none"
            >
              <option value="twitter">Twitter / X</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="telegram">Telegram</option>
              <option value="linkedin">LinkedIn</option>
            </select>
            <input
              type="text"
              placeholder="@official_handle"
              value={newHandle}
              onChange={(e) => setNewHandle(e.target.value)}
              className="flex-1 bg-[#141e33] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center gap-1 shadow-md shadow-blue-600/30"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </form>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {currentAsset.officialHandles.map((h, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-[#121c30] border border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {h.platform}
                  </span>
                  <span className="font-mono text-white font-bold">{h.handle}</span>
                </div>
                <button
                  onClick={() => handleRemoveSocial(h.handle)}
                  className="text-slate-500 hover:text-rose-400 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Verified Mobile Apps */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center justify-between">
            <span>Verified Mobile App Packages ({currentAsset.officialApps.length})</span>
            <span className="text-[10px] text-emerald-400 uppercase font-bold">Whitelisted</span>
          </h3>

          <form onSubmit={handleAddApp} className="space-y-2 text-xs">
            <div className="flex gap-2">
              <select
                value={newAppStore}
                onChange={(e) => setNewAppStore(e.target.value as any)}
                className="bg-[#141e33] border border-slate-700 rounded-xl px-2.5 py-2 text-white focus:outline-none"
              >
                <option value="google_play">Google Play</option>
                <option value="apple_app_store">Apple Store</option>
              </select>
              <input
                type="text"
                placeholder="App Name (e.g. DRP Portal)"
                value={newAppName}
                onChange={(e) => setNewAppName(e.target.value)}
                className="flex-1 bg-[#141e33] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Package ID (e.g. com.drp.app)"
                value={newAppId}
                onChange={(e) => setNewAppId(e.target.value)}
                className="flex-1 bg-[#141e33] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center gap-1 shadow-md shadow-blue-600/30"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </form>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {currentAsset.officialApps.map((a, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-[#121c30] border border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-purple-400 shrink-0" />
                  <div>
                    <span className="font-bold text-white block">{a.appName}</span>
                    <span className="font-mono text-[10px] text-slate-400 block">{a.appId}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveApp(a.appId)}
                  className="text-slate-500 hover:text-rose-400 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
