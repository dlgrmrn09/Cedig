export function successResponse(res, data, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data,
  });
}

export function successWithPagination(res, data, pagination, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data,
    pagination,
  });
}

export function messageResponse(res, message, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
  });
}
