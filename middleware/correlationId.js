import { v4 as uuidv4 } from 'uuid';

/**
 * Distributed Request Correlation ID Middleware
 * Ensures x-request-id is attached to every incoming request and response header.
 */
export const correlationIdMiddleware = (req, res, next) => {
  const requestId = req.headers['x-request-id'] || req.headers['x-correlation-id'] || uuidv4();
  req.id = requestId;
  req.requestId = requestId;
  req.headers['x-request-id'] = requestId;
  res.setHeader('x-request-id', requestId);
  next();
};

export default correlationIdMiddleware;
