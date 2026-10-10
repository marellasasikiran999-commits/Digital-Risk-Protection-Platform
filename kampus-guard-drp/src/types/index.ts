export type PlatformType = 'twitter' | 'linkedin' | 'instagram' | 'facebook' | 'telegram' | 'tiktok' | 'discord';
export type AppStoreType = 'google_play' | 'apple_app_store';
export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'SAFE';

export interface OfficialBrandAsset {
  brandName: string;
  alternateNames: string[];
  officialLogoUrl: string;
  officialWebsite: string;
  officialHandles: {
    platform: PlatformType;
    handle: string;
    url: string;
    verified: boolean;
  }[];
  officialApps: {
    store: AppStoreType;
    appId: string;
    appName: string;
    publisherName: string;
    iconUrl: string;
  }[];
  officialPublishers: string[];
}

export interface SocialThreat {
  id: string;
  platform: PlatformType;
  handle: string;
  accountName: string;
  profileUrl: string;
  avatarUrl: string;
  bio: string;
  followerCount: number;
  postCount: number;
  createdDate: string;
  detectionDate: string;
  
  riskLevel: RiskLevel;
  riskScore: number;
  nameSimilarityScore: number;
  logoSimilarityScore: number;
  hasHomoglyph: boolean;
  homoglyphDetails?: string;
  phishingKeywordsFound: string[];
  
  status: 'FLAGGED' | 'INVESTIGATING' | 'TAKEDOWN_REQUESTED' | 'TAKEN_DOWN' | 'WHITELISTED';
  isOfficial: boolean;
}

export interface AppStoreThreat {
  id: string;
  store: AppStoreType;
  appName: string;
  appId: string;
  storeUrl: string;
  iconUrl: string;
  publisherName: string;
  rating: number;
  downloadsCount: string;
  updatedDate: string;
  descriptionSnippet: string;
  
  riskLevel: RiskLevel;
  riskScore: number;
  nameSimilarityScore: number;
  logoSimilarityScore: number;
  isPublisherMismatch: boolean;
  suspiciousPermissions: string[];
  
  status: 'FLAGGED' | 'INVESTIGATING' | 'TAKEDOWN_REQUESTED' | 'TAKEN_DOWN' | 'WHITELISTED';
  isOfficial: boolean;
}

export interface LookalikeVariant {
  id: string;
  variantName: string;
  technique: 'Homoglyph (Unicode Swap)' | 'Typo (Character Swap)' | 'Affix Insertion' | 'Delimiter Mod' | 'Double Character';
  targetBrand: string;
  similarityScore: number;
  confusableCharacters: { original: string; replaced: string }[];
  riskSeverity: 'HIGH' | 'MEDIUM' | 'LOW';
  activeThreatCount: number;
}
