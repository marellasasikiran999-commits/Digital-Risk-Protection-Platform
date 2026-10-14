export interface ProximityAnalysisResult {
  hasHomoglyphs: boolean;
  uniqueCyrillic: string[];
  hasDigitSubstitution: boolean;
  homoglyphText: string;
}

export interface LexicalAnalysisResult {
  matchedAffixes: string[];
  hasSpecialPunct: boolean;
  endsWithDigits: boolean;
  containsPunctuation: boolean;
  affixCount: number;
}

export interface InstagramEvaluationResult {
  isOfficial: boolean;
  score: number;
  level: 'Safe' | 'Low' | 'Medium' | 'High' | 'Critical';
  verdict: string;
  homoglyph: string;
  similarity: string;
  reasons: string[];
  distance: number;
  factors: Array<{ factor: string; score: number }>;
  takedown: string | null;
}

export interface InstagramEvaluationOptions {
  brandName?: string;
  officialHandles?: string[];
  platform?: string;
}

export declare const WHITELISTED_OFFICIAL_HANDLES: string[];
export declare const HIGH_RISK_AFFIXES: string[];
export declare function calculateLevenshteinDistance(a: string, b: string): number;
export declare function analyzeCharacterProximity(str: string): ProximityAnalysisResult;
export declare function analyzeLexicalPatterns(handle: string): LexicalAnalysisResult;
export declare function evaluateInstagramHandle(
  candidateHandle: string, 
  options?: InstagramEvaluationOptions
): InstagramEvaluationResult;
