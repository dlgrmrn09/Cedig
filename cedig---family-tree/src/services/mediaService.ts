import { api } from '@/src/lib/api';
import type { MediaItem } from '@/src/types/media';

export interface BackendMedia {
  id: string;
  personId: string;
  treeId: string;
  title: string;
  description: string;
  type: 'photo' | 'document' | 'certificate';
  url: string;
  fileKey: string | null;
  fileSize: number | null;
  mimeType: string | null;
  version: number;
  uploadedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

function mapMedia(b: BackendMedia): MediaItem {
  return {
    id: b.id,
    personId: b.personId,
    title: b.title,
    description: b.description,
    type: b.type,
    url: b.url,
    fileSize: b.fileSize,
    mimeType: b.mimeType,
    uploadedAt: b.createdAt ? b.createdAt.replace('T', ' ').substring(0, 16) : '',
    version: b.version,
  };
}

export async function fetchMediaForTree(treeId: string): Promise<MediaItem[]> {
  const response = await api.getPaginated<BackendMedia>(`/media/tree/${treeId}`);
  return (response.data || []).map(mapMedia);
}

export async function fetchMediaForPerson(personId: string, treeId: string): Promise<MediaItem[]> {
  try {
    const data = await api.get<BackendMedia[]>(`/media/person/${personId}?treeId=${treeId}`);
    return (Array.isArray(data) ? data : []).map(mapMedia);
  } catch {
    return [];
  }
}

export async function createMedia(
  treeId: string,
  media: {
    personId: string;
    title: string;
    description?: string;
    type: 'photo' | 'document' | 'certificate';
    url: string;
    file?: File;
  },
): Promise<MediaItem> {
  if (media.file) {
    const formData = new FormData();
    formData.append('file', media.file);
    formData.append('personId', media.personId);
    formData.append('treeId', treeId);
    formData.append('title', media.title);
    formData.append('description', media.description || '');
    formData.append('type', media.type);

    if (media.url) {
      formData.append('url', media.url);
    }

    const data = await api.upload<BackendMedia>('/media', formData);
    return mapMedia(data);
  }

  const payload = {
    personId: media.personId,
    treeId,
    title: media.title,
    description: media.description || '',
    type: media.type,
    url: media.url,
  };

  const data = await api.post<BackendMedia>('/media', payload);
  return mapMedia(data);
}

export async function deleteMedia(mediaId: string, treeId: string): Promise<void> {
  await api.delete(`/media/${mediaId}?treeId=${treeId}`);
}
