export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 50,
};

export const JWT = {
  EXPIRES_IN: "7d",
};

export const UPLOAD = {
  MAX_SIZE_MB: 5,
  ALLOWED_TYPES: /jpeg|jpg|png|webp/,
};
