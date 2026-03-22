require('dotenv').config();

const { Telegraf, Scenes, session } = require('telegraf');
const connectDatabase = require('./config/database');
const registrationScene = require('./scenes/registration');
const bookingScene = require('./scenes/booking');
const myAppointmentsScene = require('./scenes/myAppointments');
const { authMiddleware } = require('./middleware/auth');
const { loggingMiddleware } = require('./middleware/logging');
const notificationService = require('./services/notification.service');
const reminderService = require('./services/reminder.service');
const { startApiServer } = require('./api/server');

const bot = new Telegraf(process.env.BOT_TOKEN);

notificationService.setBot(bot);

const stage = new Scenes.Stage([registrationScene, bookingScene, myAppointmentsScene]);

bot.use(session());
bot.use(loggingMiddleware());
bot.use(authMiddleware());
bot.use(stage.middleware());

bot.start(async (ctx) => {
  const welcome =
    `Welcome to MediBot!\n\n` +
    `I can help you book appointments at our clinics.\n\n` +
    `Available commands:\n` +
    `/register - Register as a patient\n` +
    `/book - Book an appointment\n` +
    `/myappointments - View your appointments\n` +
    `/help - Show help message`;

  await ctx.reply(welcome);
});

bot.help(async (ctx) => {
  const helpText =
    `MediBot Commands:\n\n` +
    `/register - Register or update your profile\n` +
    `/book - Book a new appointment\n` +
    `/myappointments - View and manage appointments\n` +
    `/cancel - Cancel current operation\n` +
    `/help - Show this help message`;

  await ctx.reply(helpText);
});

bot.command('register', (ctx) => ctx.scene.enter('registration'));
bot.command('book', (ctx) => ctx.scene.enter('booking'));
bot.command('myappointments', (ctx) => ctx.scene.enter('myAppointments'));

const launch = async () => {
  try {
    await connectDatabase();
    console.log('Database connected');

    reminderService.start();
    console.log('Reminder service started');

    startApiServer();

    await bot.launch();
    console.log('MediBot started successfully');
  } catch (error) {
    console.error('Failed to start bot:', error);
    process.exit(1);
  }
};

process.once('SIGINT', () => {
  reminderService.stop();
  bot.stop('SIGINT');
});

process.once('SIGTERM', () => {
  reminderService.stop();
  bot.stop('SIGTERM');
});

launch();
