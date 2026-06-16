import type { Person, Gender } from './person';

export interface PersonFormData {
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
  birthYear: number;
  birthDate?: string;
  deathDate?: string;
  gender: Gender;
  zodiacSign?: string;
  occupation?: string;
  education?: string;
  biography?: string;
  notes?: string;
  awards?: string[];
  customFields?: Record<string, unknown>;
  fatherId?: string;
  motherId?: string;
  spouseId?: string;
}

export function personToFormData(person: Person): PersonFormData {
  return {
    firstName: person.firstName,
    lastName: person.lastName,
    surname: person.surname,
    clanName: person.clanName,
    birthPlace: person.birthPlace,
    residence: person.residence,
    citizenship: person.citizenship,
    phone: person.phone,
    email: person.email,
    title: person.title,
    employment: person.employment,
    birthYear: person.birthYear,
    birthDate: person.birthDate,
    deathDate: person.deathDate,
    gender: person.gender,
    zodiacSign: person.zodiacSign,
    occupation: person.occupation,
    education: person.education,
    biography: person.biography,
    notes: person.notes,
    awards: person.awards,
    customFields: person.customFields,
    fatherId: person.fatherId,
    motherId: person.motherId,
    spouseId: person.spouseId,
  };
}
