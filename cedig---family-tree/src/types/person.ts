export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  surname?: string;
  clanName: string;
  birthPlace: string;
  residence?: string;
  citizenship?: string;
  phone?: string;
  email?: string;
  title?: string;
  employment?: string;
  biography?: string;
  zodiacSign?: string;
  birthYear: number;
  birthDate?: string;
  deathDate?: string;
  gender: 'male' | 'female';
  occupation?: string;
  education?: string;
  awards?: string[];
  notes?: string;
  customFields?: Record<string, unknown>;
  relationshipLabel: 'DIRECT LINE' | 'HEAD OF CLAN' | 'MATRIARCH' | 'DESCENDANT' | 'SPOUSE' | 'RELATIVE';
  verified: boolean;
  pendingOralHistory: boolean;
  fatherId?: string;
  motherId?: string;
  spouseId?: string;
  avatarUrl?: string;
}

export type Gender = 'male' | 'female';

export type RelationshipLabel = 'DIRECT LINE' | 'HEAD OF CLAN' | 'MATRIARCH' | 'DESCENDANT' | 'SPOUSE' | 'RELATIVE';

export type AddingRelationType = 'father' | 'mother' | 'spouse' | 'child' | 'sibling' | 'root' | null;
