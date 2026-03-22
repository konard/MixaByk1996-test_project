const { Scenes, Markup } = require('telegraf');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Clinic = require('../models/Clinic');
const appointmentService = require('../services/appointment.service');

const myAppointmentsScene = new Scenes.BaseScene('myAppointments');

myAppointmentsScene.enter(async (ctx) => {
  const user = await User.findOne({ telegramId: ctx.from.id });
  if (!user) {
    await ctx.reply('Please register first using /register');
    return ctx.scene.leave();
  }

  const appointments = await Appointment.find({
    userId: user._id,
    status: 'scheduled',
    date: { $gte: new Date() },
  })
    .populate('doctorId')
    .populate('clinicId')
    .sort({ date: 1 });

  if (appointments.length === 0) {
    await ctx.reply(
      'You have no upcoming appointments.\nUse /book to schedule one.'
    );
    return ctx.scene.leave();
  }

  let message = 'Your upcoming appointments:\n\n';

  appointments.forEach((apt, index) => {
    const dateStr = apt.date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    message +=
      `${index + 1}. ${apt.doctorId.name} (${apt.doctorId.specialization})\n` +
      `   Clinic: ${apt.clinicId.name}\n` +
      `   Date: ${dateStr}\n` +
      `   Time: ${apt.time}\n\n`;
  });

  const buttons = appointments.map((apt, index) => [
    Markup.button.callback(
      `Cancel #${index + 1} - ${apt.doctorId.name}`,
      `cancel_${apt._id}`
    ),
  ]);
  buttons.push([Markup.button.callback('Back to menu', 'back')]);

  await ctx.reply(message, Markup.inlineKeyboard(buttons));
});

myAppointmentsScene.action(/^cancel_(.+)$/, async (ctx) => {
  const appointmentId = ctx.match[1];
  await ctx.answerCbQuery();

  try {
    await appointmentService.cancelAppointment(appointmentId);
    await ctx.editMessageText(
      'Appointment cancelled successfully.\n\nUse /myappointments to view remaining appointments or /book to schedule a new one.'
    );
  } catch (error) {
    console.error('Cancel error:', error);
    await ctx.editMessageText(
      'An error occurred while cancelling. Please try again.'
    );
  }

  return ctx.scene.leave();
});

myAppointmentsScene.action('back', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.editMessageText('Returning to main menu. Use /help to see available commands.');
  return ctx.scene.leave();
});

module.exports = myAppointmentsScene;
