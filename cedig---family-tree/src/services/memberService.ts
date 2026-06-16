import { api } from '@/src/lib/api';
import type { Person } from '@/src/types/person';

export interface BackendPerson {
  id: string;
  tree_id: string;
  first_name: string;
  last_name: string;
  surname: string | null;
  clan_name: string;
  birth_place: string;
  residence: string | null;
  citizenship: string | null;
  phone: string | null;
  email: string | null;
  title: string | null;
  employment: string | null;
  biography: string | null;
  zodiac_sign: string | null;
  birth_year: number;
  birth_date: string | null;
  death_date: string | null;
  gender: 'male' | 'female';
  occupation: string | null;
  education: string | null;
  awards: string[];
  notes: string | null;
  custom_fields: Record<string, unknown> | null;
  relationship_label: string;
  verified: boolean;
  pending_oral_history: boolean;
  father_id: string | null;
  mother_id: string | null;
  spouse_id: string | null;
  avatar_url: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

function mapPerson(b: BackendPerson): Person {
  return {
    id: b.id,
    firstName: b.first_name,
    lastName: b.last_name,
    surname: b.surname || undefined,
    clanName: b.clan_name,
    birthPlace: b.birth_place,
    residence: b.residence || undefined,
    citizenship: b.citizenship || undefined,
    phone: b.phone || undefined,
    email: b.email || undefined,
    title: b.title || undefined,
    employment: b.employment || undefined,
    biography: b.biography || undefined,
    zodiacSign: b.zodiac_sign || undefined,
    birthYear: b.birth_year,
    birthDate: b.birth_date || undefined,
    deathDate: b.death_date || undefined,
    gender: b.gender,
    occupation: b.occupation || undefined,
    education: b.education || undefined,
    awards: b.awards || [],
    notes: b.notes || undefined,
    customFields: b.custom_fields || undefined,
    relationshipLabel: b.relationship_label as Person['relationshipLabel'],
    verified: b.verified,
    pendingOralHistory: b.pending_oral_history,
    fatherId: b.father_id || undefined,
    motherId: b.mother_id || undefined,
    spouseId: b.spouse_id || undefined,
    avatarUrl: b.avatar_url || undefined,
  };
}

export interface PeopleQueryParams {
  treeId: string;
  search?: string;
  clan?: string;
  gender?: string;
  verified?: string;
  birthYearFrom?: string;
  birthYearTo?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: string;
}

export interface PeoplePaginatedResult {
  people: Person[];
  total: number;
  page: number;
  limit: number;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
  };
}

export async function fetchPeople(params: PeopleQueryParams): Promise<PeoplePaginatedResult> {
  const queryParams: Record<string, string | number | boolean> = {
    treeId: params.treeId,
  };
  if (params.search) queryParams.search = params.search;
  if (params.clan) queryParams.clan = params.clan;
  if (params.gender) queryParams.gender = params.gender;
  if (params.verified) queryParams.verified = params.verified;
  if (params.birthYearFrom) queryParams.birthYearFrom = params.birthYearFrom;
  if (params.birthYearTo) queryParams.birthYearTo = params.birthYearTo;
  if (params.page) queryParams.page = params.page;
  if (params.limit) queryParams.limit = params.limit;
  if (params.sort) queryParams.sort = params.sort;
  if (params.order) queryParams.order = params.order;

  const response = await api.getPaginated<BackendPerson>('/people', queryParams);

  const meta = response.pagination || response.meta;
  const total = meta?.totalItems || response.data.length;

  return {
    people: response.data.map(mapPerson),
    total,
    page: meta?.currentPage || 1,
    limit: meta?.pageSize || 20,
    pagination: meta,
  };
}

export async function fetchAllPeople(treeId: string): Promise<Person[]> {
  let allPeople: Person[] = [];
  let page = 1;
  const limit = 100;
  let hasMore = true;

  while (hasMore) {
    const result = await fetchPeople({ treeId, page, limit });
    allPeople = [...allPeople, ...result.people];
    hasMore = result.people.length === limit;
    page++;
  }

  return allPeople;
}

export async function fetchPersonById(personId: string, treeId: string): Promise<Person | null> {
  try {
    const data = await api.get<BackendPerson>(`/people/${personId}?treeId=${treeId}`);
    return mapPerson(data);
  } catch {
    return null;
  }
}

export async function createPerson(
  treeId: string,
  person: Omit<Person, 'id' | 'verified' | 'pendingOralHistory'>,
): Promise<Person> {
  const payload = {
    treeId,
    firstName: person.firstName,
    lastName: person.lastName,
    surname: person.surname,
    clanName: person.clanName,
    birthPlace: person.birthPlace || '',
    residence: person.residence || '',
    citizenship: person.citizenship || '',
    phone: person.phone || '',
    email: person.email || '',
    title: person.title || '',
    employment: person.employment || '',
    biography: person.biography,
    zodiacSign: person.zodiacSign,
    birthYear: person.birthYear,
    birthDate: person.birthDate,
    deathDate: person.deathDate,
    gender: person.gender,
    occupation: person.occupation,
    education: person.education,
    awards: person.awards || [],
    notes: person.notes,
    customFields: person.customFields || null,
    relationshipLabel: person.relationshipLabel,
    fatherId: person.fatherId || null,
    motherId: person.motherId || null,
    spouseId: person.spouseId || null,
    avatarUrl: person.avatarUrl || null,
  };
  const data = await api.post<BackendPerson>('/people', payload);
  return mapPerson(data);
}

export async function updatePerson(
  treeId: string,
  personId: string,
  updates: Partial<Person>,
): Promise<Person> {
  const payload: Record<string, unknown> = { treeId };
  if (updates.firstName !== undefined) payload.firstName = updates.firstName;
  if (updates.lastName !== undefined) payload.lastName = updates.lastName;
  if (updates.surname !== undefined) payload.surname = updates.surname;
  if (updates.clanName !== undefined) payload.clanName = updates.clanName;
  if (updates.birthPlace !== undefined) payload.birthPlace = updates.birthPlace;
  if (updates.residence !== undefined) payload.residence = updates.residence;
  if (updates.citizenship !== undefined) payload.citizenship = updates.citizenship;
  if (updates.phone !== undefined) payload.phone = updates.phone;
  if (updates.email !== undefined) payload.email = updates.email;
  if (updates.title !== undefined) payload.title = updates.title;
  if (updates.employment !== undefined) payload.employment = updates.employment;
  if (updates.biography !== undefined) payload.biography = updates.biography;
  if (updates.zodiacSign !== undefined) payload.zodiacSign = updates.zodiacSign;
  if (updates.birthYear !== undefined) payload.birthYear = updates.birthYear;
  if (updates.birthDate !== undefined) payload.birthDate = updates.birthDate;
  if (updates.deathDate !== undefined) payload.deathDate = updates.deathDate;
  if (updates.gender !== undefined) payload.gender = updates.gender;
  if (updates.occupation !== undefined) payload.occupation = updates.occupation;
  if (updates.education !== undefined) payload.education = updates.education;
  if (updates.awards !== undefined) payload.awards = updates.awards;
  if (updates.notes !== undefined) payload.notes = updates.notes;
  if (updates.customFields !== undefined) payload.customFields = updates.customFields;
  if (updates.relationshipLabel !== undefined) payload.relationshipLabel = updates.relationshipLabel;
  if (updates.verified !== undefined) payload.verified = updates.verified;
  if (updates.pendingOralHistory !== undefined) payload.pendingOralHistory = updates.pendingOralHistory;
  if (updates.fatherId !== undefined) payload.fatherId = updates.fatherId || null;
  if (updates.motherId !== undefined) payload.motherId = updates.motherId || null;
  if (updates.spouseId !== undefined) payload.spouseId = updates.spouseId || null;

  const data = await api.put<BackendPerson>(`/people/${personId}`, payload);
  return mapPerson(data);
}

export async function deletePerson(treeId: string, personId: string): Promise<void> {
  await api.delete(`/people/${personId}?treeId=${treeId}`);
}

export async function searchPeople(treeId: string, query: string): Promise<Person[]> {
  try {
    const result = await fetchPeople({ treeId, search: query, limit: 50 });
    return result.people;
  } catch {
    return [];
  }
}

export async function fetchAncestors(treeId: string, personId: string): Promise<Person[]> {
  try {
    const person = await fetchPersonById(personId, treeId);
    if (!person) return [];

    const allPeople = await fetchAllPeople(treeId);
    const ancestors: Person[] = [];
    const visited = new Set<string>();

    function trace(parentId: string | undefined) {
      if (!parentId || visited.has(parentId)) return;
      visited.add(parentId);
      const parent = allPeople.find((p) => p.id === parentId);
      if (parent) {
        ancestors.push(parent);
        trace(parent.fatherId);
        trace(parent.motherId);
      }
    }

    trace(person.fatherId);
    trace(person.motherId);
    return ancestors;
  } catch {
    return [];
  }
}

export async function fetchDescendants(treeId: string, personId: string): Promise<Person[]> {
  try {
    const allPeople = await fetchAllPeople(treeId);
    const descendants: Person[] = [];
    const visited = new Set<string>();

    function trace(currentId: string) {
      const children = allPeople.filter(
        (p) => p.fatherId === currentId || p.motherId === currentId,
      );
      for (const child of children) {
        if (!visited.has(child.id)) {
          visited.add(child.id);
          descendants.push(child);
          trace(child.id);
        }
      }
    }

    trace(personId);
    return descendants;
  } catch {
    return [];
  }
}
