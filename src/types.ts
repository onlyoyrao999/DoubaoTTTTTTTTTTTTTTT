export interface VideoMetadata {
  name: string;
  size?: number;
  duration?: number;
  durationFormatted: string;
  type?: string;
  url?: string;
  description?: string;
}

export interface TimelineItem {
  timestamp: string;
  timeSec: number;
  title: string;
  actionDetail: string;
  tension: number;
}

export interface CoverDesign {
  shortTitle: string;
  characterExpression: string;
  visualDescription: string;
  promptChinese: string;
  promptEnglish: string;
  badgeText?: string;
  colorTheme?: string;
  styleMode?: 'realistic' | '3d-cartoon';
  hasSensitiveContent?: boolean;
  sensitiveReason?: string;
  cartoon3dPrompt?: string;
  titleSource?: 'voiceover' | 'visual_action' | 'hybrid';
  titleSourceDesc?: string;
  voiceoverQuote?: string;
  visualActionHook?: string;
  characterFidelityMode?: '1to1_faithful' | 'stylized';
  characterTraits1to1?: string;
  doubaoImg2ImgPrompt?: string;
  recommendedFrameTimestamp?: string;
  recommendedFrameReason?: string;
  titlePosition?: 'top' | 'upper_middle' | 'middle' | 'bottom';
  titlePositionReason?: string;
}

export interface ViralTitle {
  title: string;
  hookType: string;
  predictedScore?: number;
}

export interface AnalysisResult {
  summary: string;
  timeline: TimelineItem[];
  coverDesign: CoverDesign;
  viralTitles: ViralTitle[];
  viewerComment: string;
  commentTitle: string;
  dialectAnalysis?: string[];
}

export interface ComplianceCheck {
  isCompliant: boolean;
  violations: string[];
}

export interface ExtractedFrame {
  timestamp: number;
  formattedTime: string;
  dataUrl: string;
  viralScore?: number;
  isRecommendedCover?: boolean;
  viralReason?: string;
  characterDetail?: string;
}
