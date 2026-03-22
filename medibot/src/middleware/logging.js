const loggingMiddleware = () => async (ctx, next) => {
  const start = Date.now();
  const userId = ctx.from ? ctx.from.id : 'unknown';
  const updateType = ctx.updateType;

  await next();

  const duration = Date.now() - start;
  console.log(`[${new Date().toISOString()}] User: ${userId} | Type: ${updateType} | Duration: ${duration}ms`);
};

module.exports = { loggingMiddleware };
