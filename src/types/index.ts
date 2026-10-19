export interface MemoryImage {
  id: string;
  title: string;
  date: string;
  caption: string;
  imageUrl: string;
  fallbackGradient: string;
}

export interface LoveReason {
  id: number;
  icon: string;
  title: string;
  description: string;
}

export interface BirthdayConfig {
  partnerName: string;
  senderName: string;
  birthDate: string; // YYYY-MM-DD
  anniversaryDate: string; // YYYY-MM-DD
  mainHeadline: string;
  loveMessageTitle: string;
  loveMessageBody: string;
  envelopeLetterBody?: string;
  customSongUrl?: string;
  customSongTitle: string;
}
