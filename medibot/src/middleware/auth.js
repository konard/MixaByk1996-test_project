const User = require('../models/User');

const authMiddleware = () => async (ctx, next) => {
  const user = await User.findOne({ telegramId: ctx.from.id });
  ctx.state.user = user;
  return next();
};

const requireRegistration = () => async (ctx, next) => {
  if (!ctx.state.user) {
    return ctx.reply('Please register first using /register');
  }
  return next();
};

module.exports = { authMiddleware, requireRegistration };
