export interface MediaItem {
  id: string;
  personId: string;
  title: string;
  description: string;
  type: 'photo' | 'document' | 'certificate';
  url: string;
  fileSize: number | null;
  mimeType: string | null;
  uploadedAt: string;
  version: number;
}

export type MediaType = 'photo' | 'document' | 'certificate';

export interface ScrapbookPic {
  id?: string;
  url: string;
  label: string;
  year: string;
  isDynamic?: boolean;
}

export interface DocumentItem {
  id: string;
  title: string;
  desc: string;
  fileType: string;
  size: string;
  url: string;
  isDynamic?: boolean;
}
