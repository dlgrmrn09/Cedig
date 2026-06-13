export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  surname?: string;
  clanName: string;
  birthPlace: string;
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
  relationshipLabel: 'DIRECT LINE' | 'HEAD OF CLAN' | 'MATRIARCH' | 'DESCENDANT' | 'SPOUSE' | 'RELATIVE';
  verified: boolean;
  pendingOralHistory: boolean;
  fatherId?: string;
  motherId?: string;
  spouseId?: string;
}

export type Gender = 'male' | 'female';

export type RelationshipLabel = 'DIRECT LINE' | 'HEAD OF CLAN' | 'MATRIARCH' | 'DESCENDANT' | 'SPOUSE' | 'RELATIVE';

export type AddingRelationType = 'father' | 'mother' | 'spouse' | 'child' | 'sibling' | null;
