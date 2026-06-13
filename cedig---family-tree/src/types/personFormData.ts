import type { Person, Gender } from './person';

export interface PersonFormData {
  firstName: string;
  lastName: string;
  surname?: string;
  clanName: string;
  birthPlace: string;
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
    fatherId: person.fatherId,
    motherId: person.motherId,
    spouseId: person.spouseId,
  };
}
