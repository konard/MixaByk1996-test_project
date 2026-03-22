const { Scenes, Markup } = require('telegraf');
const User = require('../models/User');

const registrationScene = new Scenes.WizardScene(
  'registration',
  async (ctx) => {
    ctx.wizard.state.data = {};
    await ctx.reply(
      'Welcome to MediBot! Let\'s get you registered.\nPlease enter your first name:'
    );
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (!ctx.message || !ctx.message.text) {
      await ctx.reply('Please enter a valid first name:');
      return;
    }
    ctx.wizard.state.data.firstName = ctx.message.text.trim();
    await ctx.reply('Please enter your last name:');
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (!ctx.message || !ctx.message.text) {
      await ctx.reply('Please enter a valid last name:');
      return;
    }
    ctx.wizard.state.data.lastName = ctx.message.text.trim();
    await ctx.reply(
      'Please share your phone number:',
      Markup.keyboard([
        Markup.button.contactRequest('Share Phone Number'),
      ]).oneTime().resize()
    );
    return ctx.wizard.next();
  },
  async (ctx) => {
    let phone;
    if (ctx.message && ctx.message.contact) {
      phone = ctx.message.contact.phone_number;
    } else if (ctx.message && ctx.message.text) {
      phone = ctx.message.text.trim();
    } else {
      await ctx.reply('Please share your phone number:');
      return;
    }

    const phoneRegex = /^\+?[\d\s\-()]{7,15}$/;
    if (!phoneRegex.test(phone)) {
      await ctx.reply('Invalid phone number format. Please try again:');
      return;
    }

    try {
      const user = await User.findOneAndUpdate(
        { telegramId: ctx.from.id },
        {
          telegramId: ctx.from.id,
          firstName: ctx.wizard.state.data.firstName,
          lastName: ctx.wizard.state.data.lastName,
          phone: phone,
        },
        { upsert: true, new: true }
      );

      await ctx.reply(
        `Registration complete!\n\nName: ${user.firstName} ${user.lastName}\nPhone: ${user.phone}\n\nYou can now book appointments using /book`,
        Markup.removeKeyboard()
      );
    } catch (error) {
      console.error('Registration error:', error);
      await ctx.reply(
        'An error occurred during registration. Please try again with /register',
        Markup.removeKeyboard()
      );
    }

    return ctx.scene.leave();
  }
);

registrationScene.command('cancel', async (ctx) => {
  await ctx.reply('Registration cancelled.', Markup.removeKeyboard());
  return ctx.scene.leave();
});

module.exports = registrationScene;
