import type { OfficialBrandAsset, LookalikeVariant, SocialThreat, AppStoreThreat } from '../types';

// Homoglyph character lookup map (Cyrillic/Greek/Numbers -> Latin target)
const HOMOGLYPH_MAP: Record<string, string> = {
  'а': 'a', 'е': 'e', 'о': 'o', 'р': 'p', 'с': 'c', 'х': 'x', 'у': 'y', 'і': 'i', 'ј': 'j', 'ѕ': 's',
  'А': 'A', 'В': 'B', 'Е': 'E', 'К': 'K', 'М': 'M', 'Н': 'N', 'О': 'O', 'Р': 'P', 'С': 'C', 'Т': 'T',
  'Х': 'X', 'Ү': 'Y', '0': 'o', '1': 'l', '3': 'e', '4': 'a', '5': 's', 'I': 'l', 'vv': 'w', 'rn': 'm'
};

export const PHISHING_KEYWORDS = [
  'support', 'helpdesk', 'official', 'giveaway', 'airdrop', 'claim', 'free',
  'crypto', 'bonus', 'wallet', 'login', 'verify', 'customer care', 'whatsapp',
  'telegram', 'promo', 'reward', 'refund', 'agent'
];

export function getJaroWinklerSimilarity(s1: string, s2: string): number {
  const str1 = s1.toLowerCase();
  const str2 = s2.toLowerCase();
  
  if (str1 === str2) return 100;

  const len1 = str1.length;
  const len2 = str2.length;
  if (len1 === 0 || len2 === 0) return 0;

  const matchDistance = Math.floor(Math.max(len1, len2) / 2) - 1;
  const str1Matches = new Array(len1).fill(false);
  const str2Matches = new Array(len2).fill(false);

  let matches = 0;
  let transpositions = 0;

  for (let i = 0; i < len1; i++) {
    const start = Math.max(0, i - matchDistance);
    const end = Math.min(i + matchDistance + 1, len2);

    for (let j = start; j < end; j++) {
      if (str2Matches[j]) continue;
      if (str1[i] !== str2[j]) continue;
      str1Matches[i] = true;
      str2Matches[j] = true;
      matches++;
      break;
    }
  }

  if (matches === 0) return 0;

  let k = 0;
  for (let i = 0; i < len1; i++) {
    if (!str1Matches[i]) continue;
    while (!str2Matches[k]) k++;
    if (str1[i] !== str2[k]) transpositions++;
    k++;
  }

  const jaro = (matches / len1 + matches / len2 + (matches - transpositions / 2) / matches) / 3;

  let prefix = 0;
  for (let i = 0; i < Math.min(4, Math.min(len1, len2)); i++) {
    if (str1[i] === str2[i]) prefix++;
    else break;
  }

  return Math.round((jaro + prefix * 0.1 * (1 - jaro)) * 100);
}

export function checkHomoglyph(text: string): { hasHomoglyph: boolean; normalizedText: string; details: string } {
  let hasHomoglyph = false;
  let normalizedText = '';
  const detailsList: string[] = [];

  for (const char of text) {
    if (HOMOGLYPH_MAP[char]) {
      hasHomoglyph = true;
      normalizedText += HOMOGLYPH_MAP[char];
      detailsList.push(`'${char}' (Unicode/Num) -> '${HOMOGLYPH_MAP[char]}'`);
    } else {
      normalizedText += char;
    }
  }

  return {
    hasHomoglyph,
    normalizedText,
    details: detailsList.length > 0 ? detailsList.join(', ') : 'None'
  };
}

export function isWhitelistedOfficialAsset(
  targetIdentifier: string,
  brandAsset: OfficialBrandAsset,
  type: 'social' | 'app'
): boolean {
  const cleanedTarget = targetIdentifier.toLowerCase().replace(/[@\s_\-]/g, '');

  if (type === 'social') {
    return brandAsset.officialHandles.some(h => {
      const cleanedOfficial = h.handle.toLowerCase().replace(/[@\s_\-]/g, '');
      return cleanedTarget === cleanedOfficial;
    });
  } else {
    return brandAsset.officialApps.some(a => {
      const cleanedAppId = a.appId.toLowerCase();
      const cleanedTargetId = targetIdentifier.toLowerCase();
      return cleanedTargetId === cleanedAppId;
    });
  }
}

/**
 * Dynamically generates threats for ANY brand name typed by user!
 */
export function generateDynamicThreatsForBrand(brandAsset: OfficialBrandAsset): {
  socialThreats: SocialThreat[];
  appStoreThreats: AppStoreThreat[];
} {
  const brandName = brandAsset.brandName;
  const cleanBrand = brandName.replace(/[^a-zA-Z0-9]/g, '');
  const dateStr = new Date().toISOString().split('T')[0];

  const socialThreats: SocialThreat[] = [
    // 1. Homoglyph Scam Account
    {
      id: `st-${cleanBrand}-01`,
      platform: 'twitter',
      handle: `@${cleanBrand.replace(/a/i, 'а')}_Giveaway`, // Homoglyph Cyrillic 'а'
      accountName: `${brandName} Official Token Airdrop`,
      profileUrl: `https://x.com/${cleanBrand}_Giveaway`,
      avatarUrl: brandAsset.officialLogoUrl,
      bio: `Official ${brandName} global promotion & token giveaway program. Contact 24/7 customer support below to claim your free reward!`,
      followerCount: 18400,
      postCount: 42,
      createdDate: '2026-09-20',
      detectionDate: dateStr,
      riskLevel: 'CRITICAL',
      riskScore: 97,
      nameSimilarityScore: 96,
      logoSimilarityScore: 98,
      hasHomoglyph: true,
      homoglyphDetails: "'а' (Cyrillic U+0430) substituted for Latin 'a'",
      phishingKeywordsFound: ['airdrop', 'free', 'claim', 'tokens', 'support'],
      status: 'FLAGGED',
      isOfficial: false
    },
    // 2. Fake Helpdesk / Support Desk
    {
      id: `st-${cleanBrand}-02`,
      platform: 'twitter',
      handle: `@${cleanBrand}_SupportHelpdesk`,
      accountName: `${brandName} Official Customer Care`,
      profileUrl: `https://x.com/${cleanBrand}_SupportHelpdesk`,
      avatarUrl: brandAsset.officialLogoUrl,
      bio: `Official 24/7 Support Desk for ${brandName} users worldwide. Send direct message for account verification, password resets, and refund help.`,
      followerCount: 3200,
      postCount: 156,
      createdDate: '2026-10-01',
      detectionDate: dateStr,
      riskLevel: 'HIGH',
      riskScore: 88,
      nameSimilarityScore: 92,
      logoSimilarityScore: 84,
      hasHomoglyph: false,
      phishingKeywordsFound: ['helpdesk', 'support', 'verification', 'refund'],
      status: 'FLAGGED',
      isOfficial: false
    },
    // 3. Telegram VIP Scam Group
    {
      id: `st-${cleanBrand}-03`,
      platform: 'telegram',
      handle: `@${cleanBrand}_VIP_Official`,
      accountName: `${brandName} Global Community Hub`,
      profileUrl: `https://t.me/${cleanBrand}_VIP_Official`,
      avatarUrl: brandAsset.officialLogoUrl,
      bio: `Official Telegram hub for ${brandName} investors, partners, and community members. Deposit crypto to lock presale allocation.`,
      followerCount: 12500,
      postCount: 380,
      createdDate: '2026-09-12',
      detectionDate: dateStr,
      riskLevel: 'CRITICAL',
      riskScore: 95,
      nameSimilarityScore: 95,
      logoSimilarityScore: 96,
      hasHomoglyph: false,
      phishingKeywordsFound: ['official', 'crypto', 'deposit', 'bonus'],
      status: 'FLAGGED',
      isOfficial: false
    },
    // 4. Character Swap Typo (Instagram)
    {
      id: `st-${cleanBrand}-04`,
      platform: 'instagram',
      handle: `@${cleanBrand.replace(/m/i, 'rn')}_official`,
      accountName: `${brandName} Global`,
      profileUrl: `https://instagram.com/${cleanBrand}_official`,
      avatarUrl: brandAsset.officialLogoUrl,
      bio: `Building next-generation platforms for ${brandName} users. Follow us for verified news.`,
      followerCount: 4100,
      postCount: 22,
      createdDate: '2026-10-03',
      detectionDate: dateStr,
      riskLevel: 'HIGH',
      riskScore: 82,
      nameSimilarityScore: 89,
      logoSimilarityScore: 92,
      hasHomoglyph: false,
      phishingKeywordsFound: ['official'],
      status: 'FLAGGED',
      isOfficial: false
    },
    // 5. Whitelisted Official Account (0% False Positive Verification)
    {
      id: `st-${cleanBrand}-official-01`,
      platform: brandAsset.officialHandles[0]?.platform || 'twitter',
      handle: brandAsset.officialHandles[0]?.handle || `@${cleanBrand.toLowerCase()}`,
      accountName: brandName,
      profileUrl: brandAsset.officialHandles[0]?.url || brandAsset.officialWebsite,
      avatarUrl: brandAsset.officialLogoUrl,
      bio: `Official verified corporate social channel for ${brandName}. Access official portal and updates at ${brandAsset.officialWebsite}`,
      followerCount: 85000,
      postCount: 1240,
      createdDate: '2023-01-10',
      detectionDate: dateStr,
      riskLevel: 'SAFE',
      riskScore: 0,
      nameSimilarityScore: 100,
      logoSimilarityScore: 100,
      hasHomoglyph: false,
      phishingKeywordsFound: [],
      status: 'WHITELISTED',
      isOfficial: true
    }
  ];

  const appStoreThreats: AppStoreThreat[] = [
    // 1. Fake Android Mobile App
    {
      id: `app-${cleanBrand}-01`,
      store: 'google_play',
      appName: `${brandName} Mobile Wallet & Portal`,
      appId: `com.${cleanBrand.toLowerCase()}.mobile.scam`,
      storeUrl: `https://play.google.com/store/apps/details?id=com.${cleanBrand.toLowerCase()}.mobile.scam`,
      iconUrl: brandAsset.officialLogoUrl,
      publisherName: 'Global App Holdings LLC', // Mismatch!
      rating: 2.3,
      downloadsCount: '10,000+',
      updatedDate: dateStr,
      descriptionSnippet: `Connect your account credentials to access the ${brandName} ecosystem directly from your mobile device.`,
      riskLevel: 'CRITICAL',
      riskScore: 96,
      nameSimilarityScore: 94,
      logoSimilarityScore: 97,
      isPublisherMismatch: true,
      suspiciousPermissions: ['READ_SMS', 'ACCESS_FINE_LOCATION', 'SYSTEM_ALERT_WINDOW'],
      status: 'FLAGGED',
      isOfficial: false
    },
    // 2. Suspicious iOS App Store Clone
    {
      id: `app-${cleanBrand}-02`,
      store: 'apple_app_store',
      appName: `${brandName} Connect`,
      appId: `id984120491`,
      storeUrl: `https://apps.apple.com/app/id984120491`,
      iconUrl: brandAsset.officialLogoUrl,
      publisherName: 'Digital Mobile Venture Apps Inc',
      rating: 3.2,
      downloadsCount: '5,000+',
      updatedDate: dateStr,
      descriptionSnippet: `Mobile assistant app for ${brandName} customers and members.`,
      riskLevel: 'HIGH',
      riskScore: 84,
      nameSimilarityScore: 88,
      logoSimilarityScore: 82,
      isPublisherMismatch: true,
      suspiciousPermissions: ['CAMERA', 'READ_CONTACTS'],
      status: 'FLAGGED',
      isOfficial: false
    },
    // 3. Whitelisted Official Mobile App
    {
      id: `app-${cleanBrand}-official-01`,
      store: brandAsset.officialApps[0]?.store || 'google_play',
      appName: brandAsset.officialApps[0]?.appName || `${brandName} Official App`,
      appId: brandAsset.officialApps[0]?.appId || `com.${cleanBrand.toLowerCase()}.app`,
      storeUrl: `https://play.google.com/store/apps/details?id=com.${cleanBrand.toLowerCase()}.app`,
      iconUrl: brandAsset.officialLogoUrl,
      publisherName: brandAsset.officialPublishers[0] || `${brandName} Inc.`,
      rating: 4.8,
      downloadsCount: '100,000+',
      updatedDate: dateStr,
      descriptionSnippet: `Official mobile application for ${brandName}.`,
      riskLevel: 'SAFE',
      riskScore: 0,
      nameSimilarityScore: 100,
      logoSimilarityScore: 100,
      isPublisherMismatch: false,
      suspiciousPermissions: [],
      status: 'WHITELISTED',
      isOfficial: true
    }
  ];

  return { socialThreats, appStoreThreats };
}

export function generateLookalikeVariants(brandName: string): LookalikeVariant[] {
  const clean = brandName.replace(/[^a-zA-Z0-9]/g, '');
  const variants: LookalikeVariant[] = [];

  variants.push({
    id: 'var-1',
    variantName: clean.replace(/a/gi, 'а').replace(/e/gi, 'е').replace(/o/gi, 'о'),
    technique: 'Homoglyph (Unicode Swap)',
    targetBrand: brandName,
    similarityScore: 98,
    confusableCharacters: [{ original: 'a', replaced: 'а (Cyrillic U+0430)' }, { original: 'o', replaced: 'о (Cyrillic U+043E)' }],
    riskSeverity: 'HIGH',
    activeThreatCount: 3
  });

  variants.push({
    id: 'var-2',
    variantName: clean.replace(/m/gi, 'rn').replace(/e/gi, '3').replace(/o/gi, '0'),
    technique: 'Typo (Character Swap)',
    targetBrand: brandName,
    similarityScore: 91,
    confusableCharacters: [{ original: 'm', replaced: 'rn' }, { original: 'e', replaced: '3' }],
    riskSeverity: 'HIGH',
    activeThreatCount: 2
  });

  const affixes = ['Official', 'Support', 'App', 'Helpdesk', 'Giveaway'];
  affixes.forEach((aff, idx) => {
    variants.push({
      id: `var-aff-${idx}`,
      variantName: `${clean}_${aff}`,
      technique: 'Affix Insertion',
      targetBrand: brandName,
      similarityScore: 88,
      confusableCharacters: [{ original: 'None', replaced: `Suffix _${aff}` }],
      riskSeverity: idx < 2 ? 'HIGH' : 'MEDIUM',
      activeThreatCount: idx === 0 ? 4 : 1
    });
  });

  variants.push({
    id: 'var-delim-1',
    variantName: brandName.replace('.', '-'),
    technique: 'Delimiter Mod',
    targetBrand: brandName,
    similarityScore: 95,
    confusableCharacters: [{ original: '.', replaced: '-' }],
    riskSeverity: 'MEDIUM',
    activeThreatCount: 2
  });

  return variants;
}
