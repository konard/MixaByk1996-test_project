const { Scenes, Markup } = require('telegraf');
const Clinic = require('../models/Clinic');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const appointmentService = require('../services/appointment.service');
const calendarService = require('../services/calendar.service');

const bookingScene = new Scenes.WizardScene(
  'booking',
  async (ctx) => {
    const user = await User.findOne({ telegramId: ctx.from.id });
    if (!user) {
      await ctx.reply('Please register first using /register');
      return ctx.scene.leave();
    }
    ctx.wizard.state.data = { userId: user._id };

    const clinics = await Clinic.find({});
    if (clinics.length === 0) {
      await ctx.reply('No clinics available at the moment. Please try later.');
      return ctx.scene.leave();
    }

    const buttons = clinics.map((clinic) => [
      Markup.button.callback(`${clinic.name} - ${clinic.city}`, `clinic_${clinic._id}`),
    ]);

    await ctx.reply('Select a clinic:', Markup.inlineKeyboard(buttons));
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (!ctx.callbackQuery) {
      await ctx.reply('Please select a clinic from the list above.');
      return;
    }

    const clinicId = ctx.callbackQuery.data.replace('clinic_', '');
    ctx.wizard.state.data.clinicId = clinicId;
    await ctx.answerCbQuery();

    const doctors = await Doctor.find({ clinicId }).populate('clinicId');
    if (doctors.length === 0) {
      await ctx.reply('No doctors available at this clinic. Please try another clinic.');
      return ctx.scene.leave();
    }

    const buttons = doctors.map((doc) => [
      Markup.button.callback(`${doc.name} - ${doc.specialization}`, `doctor_${doc._id}`),
    ]);

    await ctx.editMessageText('Select a doctor:', Markup.inlineKeyboard(buttons));
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (!ctx.callbackQuery) {
      await ctx.reply('Please select a doctor from the list above.');
      return;
    }

    const doctorId = ctx.callbackQuery.data.replace('doctor_', '');
    ctx.wizard.state.data.doctorId = doctorId;
    await ctx.answerCbQuery();

    const doctor = await Doctor.findById(doctorId);
    const today = new Date();
    const dates = [];

    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayOfWeek = date.getDay();

      if (!doctor.workingHours.daysOff.includes(dayOfWeek)) {
        dates.push(date);
      }
    }

    const buttons = dates.slice(0, 10).map((date) => {
      const dateStr = date.toISOString().split('T')[0];
      const label = date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
      return [Markup.button.callback(label, `date_${dateStr}`)];
    });

    await ctx.editMessageText('Select a date:', Markup.inlineKeyboard(buttons));
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (!ctx.callbackQuery) {
      await ctx.reply('Please select a date from the list above.');
      return;
    }

    const dateStr = ctx.callbackQuery.data.replace('date_', '');
    ctx.wizard.state.data.date = dateStr;
    await ctx.answerCbQuery();

    const { doctorId } = ctx.wizard.state.data;
    const availableSlots = await calendarService.getAvailableSlots(doctorId, dateStr);

    if (availableSlots.length === 0) {
      await ctx.editMessageText(
        'No available slots for this date. Please select another date or press /book to start over.'
      );
      return ctx.scene.leave();
    }

    const buttons = [];
    const row = [];
    availableSlots.forEach((slot, index) => {
      row.push(Markup.button.callback(slot, `time_${slot}`));
      if ((index + 1) % 3 === 0 || index === availableSlots.length - 1) {
        buttons.push([...row]);
        row.length = 0;
      }
    });

    await ctx.editMessageText(
      `Available slots for ${dateStr}:`,
      Markup.inlineKeyboard(buttons)
    );
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (!ctx.callbackQuery) {
      await ctx.reply('Please select a time slot from the list above.');
      return;
    }

    const time = ctx.callbackQuery.data.replace('time_', '');
    ctx.wizard.state.data.time = time;
    await ctx.answerCbQuery();

    const { userId, doctorId, clinicId, date } = ctx.wizard.state.data;

    try {
      const appointment = await appointmentService.createAppointment({
        userId,
        doctorId,
        clinicId,
        date,
        time,
      });

      const doctor = await Doctor.findById(doctorId);
      const clinic = await Clinic.findById(clinicId);

      await ctx.editMessageText(
        `Appointment confirmed!\n\n` +
        `Doctor: ${doctor.name}\n` +
        `Specialization: ${doctor.specialization}\n` +
        `Clinic: ${clinic.name}\n` +
        `Address: ${clinic.address}\n` +
        `Date: ${date}\n` +
        `Time: ${time}\n\n` +
        `You will receive a reminder before your appointment.\n` +
        `To view your appointments, use /myappointments`
      );
    } catch (error) {
      console.error('Booking error:', error);
      await ctx.editMessageText(
        'An error occurred while booking. Please try again with /book'
      );
    }

    return ctx.scene.leave();
  }
);

bookingScene.command('cancel', async (ctx) => {
  await ctx.reply('Booking cancelled.');
  return ctx.scene.leave();
});

module.exports = bookingScene;
