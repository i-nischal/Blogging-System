/**
 * Async handler to eliminate try-catch blocks in controllers
 * Wraps async functions and passes errors to error middleware
 */

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
