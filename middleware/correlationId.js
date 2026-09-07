import crypto from 'crypto';

/**
 * Distributed Request Correlation ID Middleware
 * Uses Node.js native crypto.randomUUID() — zero external package dependencies.
 * Ensures x-request-id is attached to every incoming request and response header.
 */
export const correlationIdMiddleware = (req, res, next) => {
  const requestId = req.headers['x-request-id'] || req.headers['x-correlation-id'] || crypto.randomUUID();
  req.id = requestId;
  req.requestId = requestId;
  req.headers['x-request-id'] = requestId;
  res.setHeader('x-request-id', requestId);
  next();
};

export default correlationIdMiddleware;
