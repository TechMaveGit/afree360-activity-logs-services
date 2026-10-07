/** Bounds for interactive reads; background jobs must process one page at a time. */
export function envInteger(name, fallback, maximum = Number.MAX_SAFE_INTEGER) {
  const raw = process.env[name];
  if (raw === undefined || raw === '') return fallback;
  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value < 1 || value > maximum) {
    throw new Error(`${name} must be an integer between 1 and ${maximum}`);
  }
  return value;
}

export class ReadLimitError extends Error {
  constructor(message, status = 422) {
    super(message);
    this.code = 'READ_LIMIT_EXCEEDED';
    this.status = status;
  }
}

export function pageLimit(value = 10, maximum = envInteger('API_MAX_PAGE_SIZE', 500, 500)) {
  const n = Number(value);
  if (!Number.isSafeInteger(n) || n < 1 || n > maximum) {
    throw new ReadLimitError(`limit must be an integer between 1 and ${maximum}`, 400);
  }
  return n;
}

export function positiveInteger(value, fallback = 1, allowZero = false) {
  const n = Number(value ?? fallback);
  if (!Number.isSafeInteger(n) || n < (allowZero ? 0 : 1)) {
    throw new ReadLimitError('Invalid pagination value', 400);
  }
  return n;
}

export function boundedIds(ids, name = 'ids', maximum = envInteger('INTERNAL_BATCH_MAX_SIZE', 500, 500)) {
  if (!Array.isArray(ids) || ids.length > maximum) {
    throw new ReadLimitError(`${name} must be an array of at most ${maximum} IDs`, 400);
  }
  if (ids.some(id => !['string', 'number'].includes(typeof id) || !String(id).trim())) {
    throw new ReadLimitError(`${name} contains an invalid ID`, 400);
  }
  return [...new Set(ids.map(String))];
}

export async function mapLimit(items, mapper, { concurrency = envInteger('INTERNAL_BATCH_CONCURRENCY', 5, 10), settled = false } = {}) {
  if (!Number.isSafeInteger(concurrency) || concurrency < 1) throw new RangeError('Invalid concurrency');
  if (items.length > envInteger('INTERNAL_ENRICHMENT_MAX_ITEMS', 1000, 10000)) throw new ReadLimitError('Enrichment input is too large; paginate the source query first');
  const results = new Array(items.length);
  let next = 0;
  let failure;
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (next < items.length && !failure) {
      const index = next++;
      try {
        const value = await mapper(items[index], index);
        results[index] = settled ? { status: 'fulfilled', value } : value;
      } catch (reason) {
        if (settled && !isReadError(reason)) results[index] = { status: 'rejected', reason };
        else failure = { reason };
      }
    }
  }));
  if (failure) throw failure.reason;
  return results;
}

export async function forEachChunk(items, size, visit, options) {
  pageLimit(size, 500);
  const chunks = [];
  for (let i = 0; i < items.length; i += size) chunks.push(items.slice(i, i + size));
  return mapLimit(chunks, visit, options);
}

export function rethrowReadError(error) {
  if (isReadError(error)) throw error;
}

/** Apply at the API router, including aliases, before list handlers execute. */
export function validateReadBounds(req, res, next) {
  try {
    for (const key of ['limit', 'page_size', 'pageSize', 'per_page']) if (req.query?.[key] !== undefined) pageLimit(req.query[key]);
    for (const key of ['ids', 'developer_ids']) {
      if (req.query?.[key] !== undefined) boundedIds(Array.isArray(req.query[key]) ? req.query[key] : String(req.query[key]).split(','), key);
    }
    for (const key of ['page', 'offset']) {
      if (req.query?.[key] !== undefined) positiveInteger(req.query[key], 1, key === 'offset');
    }
    if (/\/(?:[^/]*bulk[^/]*|batch|search)(?:\/|$)/.test(req.path)) {
      for (const key of ['ids', 'user_ids', 'userIds', 'plot_ids', 'bookingIds', 'orderIds', 'orderNumbers', 'referenceIds', 'discount_ids']) {
        if (req.body?.[key] !== undefined && req.body[key] !== null) boundedIds(req.body[key], key);
      }
    }
    next();
  } catch (error) {
    if (!error.status) return next(error);
    return res.status(error.status).json({ success: false, code: error.code, message: error.message });
  }
}

function isReadError(error) {
  return ['READ_LIMIT_EXCEEDED', 'BATCH_LOOKUP_FAILED', 'SERVICE_BUSY'].includes(error?.code)
    || ['READ_LIMIT_EXCEEDED', 'BATCH_LOOKUP_FAILED', 'SERVICE_BUSY'].includes(error?.response?.data?.code);
}

export function respondReadError(res, error) {
  if (!isReadError(error)) return false;
  res.status(error.response?.status || error.status || 503).json({
    success: false, code: error.response?.data?.code || error.code,
    message: error.response?.data?.message || error.message
  });
  return true;
}
