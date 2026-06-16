export function buildSearchQuery(searchTerm, searchableFields, tableAlias = '') {
  if (!searchTerm || !searchTerm.trim()) {
    return { clause: '', params: [] };
  }

  const term = searchTerm.trim();
  const prefix = tableAlias ? `${tableAlias}.` : '';

  const conditions = searchableFields.map(
    (field) => `LOWER(${prefix}${field}) LIKE LOWER($1)`
  );

  return {
    clause: `AND (${conditions.join(' OR ')})`,
    params: [`%${term}%`],
  };
}
