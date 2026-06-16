import asyncHandler from 'express-async-handler';
import * as personService from '../services/personService.js';
import { successResponse, successWithPagination, messageResponse } from '../utils/response.js';

function formatPerson(p) {
  return {
    id: p.id,
    tree_id: p.treeId,
    first_name: p.firstName,
    last_name: p.lastName,
    surname: p.surname || null,
    clan_name: p.clanName,
    birth_place: p.birthPlace || '',
    residence: p.residence || '',
    citizenship: p.citizenship || '',
    phone: p.phone || '',
    email: p.email || '',
    title: p.title || '',
    employment: p.employment || '',
    biography: p.biography || null,
    zodiac_sign: p.zodiacSign || null,
    birth_year: p.birthYear,
    birth_date: p.birthDate || null,
    death_date: p.deathDate || null,
    gender: p.gender,
    occupation: p.occupation || null,
    education: p.education || null,
    awards: p.awards || [],
    avatar_url: p.avatarUrl || null,
    notes: p.notes || null,
    custom_fields: p.customFields || null,
    relationship_label: p.relationshipLabel,
    verified: p.verified,
    pending_oral_history: p.pendingOralHistory,
    father_id: p.fatherId || null,
    mother_id: p.motherId || null,
    spouse_id: p.spouseId || null,
    created_by: p.createdBy || null,
    created_at: p.createdAt,
    updated_at: p.updatedAt,
  };
}

export const getPeople = asyncHandler(async (req, res) => {
  console.log('[DATA] GET /people', { userId: req.user?.id, query: req.query });
  const { people, total, page, limit } = await personService.getPeople(
    req.params.treeId || req.query.treeId,
    req.user.id,
    req.query
  );
  successWithPagination(res, people.map(formatPerson), {
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalItems: total,
    pageSize: limit,
  });
});

export const getPersonById = asyncHandler(async (req, res) => {
  const treeId = req.query.treeId;
  const person = await personService.getPersonById(req.params.id, treeId, req.user.id);
  successResponse(res, formatPerson(person));
});

export const createPerson = asyncHandler(async (req, res) => {
  console.log('[DATA] POST /people', { userId: req.user?.id, treeId: req.body.treeId, name: `${req.body.firstName} ${req.body.lastName}` });
  const { person, activity } = await personService.createPerson(
    req.body.treeId,
    req.user.id,
    req.body
  );
  successResponse(res, formatPerson(person), 201);
});

export const updatePerson = asyncHandler(async (req, res) => {
  console.log('[DATA] PUT /people/:id', { userId: req.user?.id, personId: req.params.id, treeId: req.body.treeId });
  const person = await personService.updatePerson(
    req.params.id,
    req.body.treeId,
    req.user.id,
    req.body
  );
  successResponse(res, formatPerson(person));
});

export const deletePerson = asyncHandler(async (req, res) => {
  const treeId = req.query.treeId || req.body?.treeId;
  console.log('[DATA] DELETE /people/:id', { userId: req.user?.id, personId: req.params.id, treeId });
  await personService.deletePerson(req.params.id, treeId, req.user.id);
  messageResponse(res, 'Person deleted successfully');
});
