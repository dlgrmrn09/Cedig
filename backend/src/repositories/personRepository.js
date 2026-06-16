import prisma from '../config/prisma.js';

export async function findById(id) {
  return prisma.person.findUnique({ where: { id } });
}

export async function findByTreeId(treeId, options = {}) {
  const { clan, search, gender, verified, birthYearFrom, birthYearTo, page, limit, sort, order } = options;
  const pg = Math.max(1, parseInt(page) || 1);
  const lim = Math.min(100, Math.max(1, parseInt(limit) || 20));
  const skip = (pg - 1) * lim;

  const where = { treeId };

  if (clan) where.clanName = clan;
  if (gender) where.gender = gender;
  if (verified === 'true') where.verified = true;
  else if (verified === 'false') where.verified = false;
  if (birthYearFrom) where.birthYear = { ...where.birthYear, gte: parseInt(birthYearFrom) };
  if (birthYearTo) where.birthYear = { ...where.birthYear, lte: parseInt(birthYearTo) };

  if (search) {
    const term = search.trim();
    where.OR = [
      { firstName: { contains: term, mode: 'insensitive' } },
      { lastName: { contains: term, mode: 'insensitive' } },
      { clanName: { contains: term, mode: 'insensitive' } },
      { biography: { contains: term, mode: 'insensitive' } },
      { occupation: { contains: term, mode: 'insensitive' } },
      { birthPlace: { contains: term, mode: 'insensitive' } },
    ];
  }

  const allowedSortFields = ['firstName', 'lastName', 'birthYear', 'createdAt', 'clanName', 'gender'];
  const sortField = allowedSortFields.includes(sort) ? sort : 'createdAt';
  const sortOrder = order === 'ASC' ? 'asc' : 'desc';

  const [people, total] = await Promise.all([
    prisma.person.findMany({
      where,
      orderBy: { [sortField]: sortOrder },
      take: lim,
      skip,
    }),
    prisma.person.count({ where }),
  ]);

  return { people, total, page: pg, limit: lim };
}

export async function create(data) {
  return prisma.person.create({
    data: {
      treeId: data.treeId,
      firstName: data.firstName,
      lastName: data.lastName,
      surname: data.surname || null,
      clanName: data.clanName || '',
      birthPlace: data.birthPlace || '',
      residence: data.residence || '',
      citizenship: data.citizenship || '',
      phone: data.phone || '',
      email: data.email || '',
      title: data.title || '',
      employment: data.employment || '',
      biography: data.biography || null,
      zodiacSign: data.zodiacSign || null,
      birthYear: data.birthYear || 1980,
      birthDate: data.birthDate || null,
      deathDate: data.deathDate || null,
      gender: data.gender,
      occupation: data.occupation || null,
      education: data.education || null,
      awards: data.awards || [],
      avatarUrl: data.avatarUrl || null,
      notes: data.notes || null,
      customFields: data.customFields || null,
      relationshipLabel: data.relationshipLabel || 'RELATIVE',
      verified: data.verified || false,
      pendingOralHistory: data.pendingOralHistory || false,
      fatherId: data.fatherId || null,
      motherId: data.motherId || null,
      spouseId: data.spouseId || null,
      createdBy: data.createdBy || null,
    },
  });
}

export async function update(id, fields) {
  const fieldMap = {
    firstName: 'firstName', lastName: 'lastName', clanName: 'clanName',
    birthPlace: 'birthPlace', residence: 'residence', citizenship: 'citizenship',
    phone: 'phone', email: 'email', title: 'title', employment: 'employment',
    zodiacSign: 'zodiacSign', birthYear: 'birthYear',
    birthDate: 'birthDate', deathDate: 'deathDate',
    occupation: 'occupation', education: 'education',
    biography: 'biography', notes: 'notes', customFields: 'customFields',
    relationshipLabel: 'relationshipLabel',
    verified: 'verified', pendingOralHistory: 'pendingOralHistory',
    fatherId: 'fatherId', motherId: 'motherId', spouseId: 'spouseId',
    awards: 'awards', surname: 'surname', avatarUrl: 'avatarUrl',
    first_name: 'firstName', last_name: 'lastName', clan_name: 'clanName',
    birth_place: 'birthPlace', residence: 'residence',
    phone: 'phone', email: 'email', title: 'title', employment: 'employment',
    birth_year: 'birthYear', birth_date: 'birthDate',
    death_date: 'deathDate', spouse_id: 'spouseId', father_id: 'fatherId',
    mother_id: 'motherId', relationship_label: 'relationshipLabel',
    pending_oral_history: 'pendingOralHistory',
    custom_fields: 'customFields',
  };

  const data = {};
  for (const [key, value] of Object.entries(fields)) {
    const dbField = fieldMap[key] || key;
    if (value !== undefined) {
      data[dbField] = value;
    }
  }

  if (Object.keys(data).length === 0) return findById(id);

  data.updatedAt = new Date();

  return prisma.person.update({
    where: { id },
    data,
  });
}

export async function deleteById(id) {
  await prisma.person.updateMany({
    where: {
      OR: [
        { fatherId: id },
        { motherId: id },
        { spouseId: id },
      ],
    },
    data: { fatherId: null, motherId: null, spouseId: null },
  });

  await prisma.person.delete({ where: { id } });
}

export async function countByTreeId(treeId) {
  return prisma.person.count({ where: { treeId } });
}
