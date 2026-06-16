import { PAGINATION } from '../constants/index.js';

export function parsePagination(query) {
  const page = Math.max(1, parseInt(query.page) || PAGINATION.DEFAULT_PAGE);
  const limit = Math.min(
    PAGINATION.MAX_LIMIT,
    Math.max(1, parseInt(query.limit) || PAGINATION.DEFAULT_LIMIT)
  );
  const offset = (page - 1) * limit;

  const sort = query.sort || 'created_at';
  const order = (query.order || 'DESC').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  return { page, limit, offset, sort, order };
}

export function formatPagination(total, page, limit) {
  const totalPages = Math.ceil(total / limit);
  return {
    currentPage: page,
    totalPages: Math.max(1, totalPages),
    totalItems: total,
    pageSize: limit,
  };
}

export function paginatedResponse(data, total, page, limit) {
  return {
    data,
    pagination: formatPagination(total, page, limit),
  };
}
