import type { OfficialBrandAsset } from '../types';

export const INITIAL_BRAND_ASSETS: Record<string, OfficialBrandAsset> = {
  'Digital Risk Protection Platform': {
    brandName: 'Digital Risk Protection Platform',
    alternateNames: ['DRP Platform', 'Digital Risk Protection', 'DRP Enterprise'],
    officialLogoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    officialWebsite: 'https://www.digitalriskprotection.com',
    officialHandles: [
      { platform: 'twitter', handle: '@digitalriskprotection', url: 'https://x.com/digitalriskprotection', verified: true },
      { platform: 'linkedin', handle: 'company/digital-risk-protection-platform', url: 'https://linkedin.com/company/digital-risk-protection-platform', verified: true },
      { platform: 'instagram', handle: '@digitalriskprotection_hq', url: 'https://instagram.com/digitalriskprotection_hq', verified: true },
      { platform: 'telegram', handle: '@drp_platform_official', url: 'https://t.me/drp_platform_official', verified: true }
    ],
    officialApps: [
      {
        store: 'google_play',
        appId: 'com.drp.platform.official',
        appName: 'Digital Risk Protection Platform',
        publisherName: 'Digital Risk Protection Platform',
        iconUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80'
      }
    ],
    officialPublishers: ['Digital Risk Protection Platform', 'DRP Enterprise Security']
  },
  'Tesla': {
    brandName: 'Tesla',
    alternateNames: ['Tesla Motors', 'Tesla Energy'],
    officialLogoUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=150&auto=format&fit=crop&q=80',
    officialWebsite: 'https://tesla.com',
    officialHandles: [
      { platform: 'twitter', handle: '@Tesla', url: 'https://x.com/Tesla', verified: true },
      { platform: 'instagram', handle: '@teslamotors', url: 'https://instagram.com/teslamotors', verified: true }
    ],
    officialApps: [
      {
        store: 'google_play',
        appId: 'com.teslamotors.tesla',
        appName: 'Tesla Official',
        publisherName: 'Tesla, Inc.',
        iconUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=150&auto=format&fit=crop&q=80'
      }
    ],
    officialPublishers: ['Tesla, Inc.', 'Tesla Motors']
  },
  'PayPal': {
    brandName: 'PayPal',
    alternateNames: ['PayPal Inc', 'PayPal Money'],
    officialLogoUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=150&auto=format&fit=crop&q=80',
    officialWebsite: 'https://paypal.com',
    officialHandles: [
      { platform: 'twitter', handle: '@PayPal', url: 'https://x.com/PayPal', verified: true },
      { platform: 'facebook', handle: 'PayPal', url: 'https://facebook.com/PayPal', verified: true }
    ],
    officialApps: [
      {
        store: 'google_play',
        appId: 'com.paypal.android.p2pmobile',
        appName: 'PayPal: Send, Shop, Manage',
        publisherName: 'PayPal Mobile',
        iconUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=150&auto=format&fit=crop&q=80'
      }
    ],
    officialPublishers: ['PayPal Mobile', 'PayPal, Inc.']
  },
  'Binance': {
    brandName: 'Binance',
    alternateNames: ['Binance Exchange', 'Binance Global'],
    officialLogoUrl: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=150&auto=format&fit=crop&q=80',
    officialWebsite: 'https://binance.com',
    officialHandles: [
      { platform: 'twitter', handle: '@binance', url: 'https://x.com/binance', verified: true },
      { platform: 'telegram', handle: '@binanceexchange', url: 'https://t.me/binanceexchange', verified: true }
    ],
    officialApps: [
      {
        store: 'google_play',
        appId: 'com.binance.dev',
        appName: 'Binance: Buy Bitcoin & Crypto',
        publisherName: 'Binance Inc.',
        iconUrl: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=150&auto=format&fit=crop&q=80'
      }
    ],
    officialPublishers: ['Binance Inc.', 'Binance Digital']
  },
  'OpenAI': {
    brandName: 'OpenAI',
    alternateNames: ['ChatGPT', 'OpenAI Inc'],
    officialLogoUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=150&auto=format&fit=crop&q=80',
    officialWebsite: 'https://openai.com',
    officialHandles: [
      { platform: 'twitter', handle: '@OpenAI', url: 'https://x.com/OpenAI', verified: true },
      { platform: 'linkedin', handle: 'company/openai', url: 'https://linkedin.com/company/openai', verified: true }
    ],
    officialApps: [
      {
        store: 'google_play',
        appId: 'com.openai.chatgpt',
        appName: 'ChatGPT',
        publisherName: 'OpenAI',
        iconUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=150&auto=format&fit=crop&q=80'
      }
    ],
    officialPublishers: ['OpenAI', 'OpenAI L.L.C.']
  }
};

export function createDefaultAssetForBrand(customName: string): OfficialBrandAsset {
  const clean = customName.trim();
  const cleanId = clean.toLowerCase().replace(/[^a-z0-9]/g, '');

  return {
    brandName: clean,
    alternateNames: [clean, `${clean} Corp`, `${clean} Tech`],
    officialLogoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    officialWebsite: `https://${cleanId || 'company'}.com`,
    officialHandles: [
      { platform: 'twitter', handle: `@${cleanId}`, url: `https://x.com/${cleanId}`, verified: true },
      { platform: 'linkedin', handle: `company/${cleanId}`, url: `https://linkedin.com/company/${cleanId}`, verified: true },
      { platform: 'instagram', handle: `@${cleanId}`, url: `https://instagram.com/${cleanId}`, verified: true }
    ],
    officialApps: [
      {
        store: 'google_play',
        appId: `com.${cleanId}.app`,
        appName: `${clean} Official App`,
        publisherName: `${clean} Inc.`,
        iconUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80'
      }
    ],
    officialPublishers: [`${clean} Inc.`, `${clean} Corporation`]
  };
}
