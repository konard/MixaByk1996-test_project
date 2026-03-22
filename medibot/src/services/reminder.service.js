const cron = require('node-cron');
const Appointment = require('../models/Appointment');
const notificationService = require('./notification.service');

class ReminderService {
  constructor() {
    this.jobs = [];
  }

  start() {
    const dailyReminder = cron.schedule('0 9 * * *', async () => {
      await this.sendDayBeforeReminders();
    });

    const hourlyReminder = cron.schedule('0 * * * *', async () => {
      await this.sendHourBeforeReminders();
    });

    const noShowCheck = cron.schedule('0 20 * * *', async () => {
      await this.markNoShows();
    });

    this.jobs.push(dailyReminder, hourlyReminder, noShowCheck);
    console.log('Reminder service started');
  }

  stop() {
    this.jobs.forEach((job) => job.stop());
    this.jobs = [];
  }

  async sendDayBeforeReminders() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

    const appointments = await Appointment.find({
      status: 'scheduled',
      reminderSent: false,
      date: { $gte: tomorrow, $lt: dayAfterTomorrow },
    })
      .populate('userId')
      .populate('doctorId')
      .populate('clinicId');

    for (const apt of appointments) {
      try {
        const dateStr = apt.date.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        });

        const message =
          `Reminder: You have an appointment tomorrow!\n\n` +
          `Doctor: ${apt.doctorId.name}\n` +
          `Specialization: ${apt.doctorId.specialization}\n` +
          `Clinic: ${apt.clinicId.name}\n` +
          `Address: ${apt.clinicId.address}\n` +
          `Date: ${dateStr}\n` +
          `Time: ${apt.time}\n\n` +
          `To cancel, use /myappointments`;

        await notificationService.sendMessage(apt.userId.telegramId, message);

        apt.reminderSent = true;
        await apt.save();
      } catch (error) {
        console.error(`Failed to send reminder for appointment ${apt._id}:`, error.message);
      }
    }
  }

  async sendHourBeforeReminders() {
    const now = new Date();
    const oneHourLater = new Date(now);
    oneHourLater.setHours(oneHourLater.getHours() + 1);

    const twoHoursLater = new Date(now);
    twoHoursLater.setHours(twoHoursLater.getHours() + 2);

    const appointments = await Appointment.find({
      status: 'scheduled',
      date: {
        $gte: new Date(now.toISOString().split('T')[0]),
        $lte: new Date(now.toISOString().split('T')[0] + 'T23:59:59.999Z'),
      },
    })
      .populate('userId')
      .populate('doctorId')
      .populate('clinicId');

    for (const apt of appointments) {
      const [hours, minutes] = apt.time.split(':').map(Number);
      const aptTime = new Date(apt.date);
      aptTime.setHours(hours, minutes, 0, 0);

      const timeDiff = aptTime.getTime() - now.getTime();
      const minutesDiff = timeDiff / (1000 * 60);

      if (minutesDiff > 30 && minutesDiff <= 90) {
        try {
          const message =
            `Your appointment is coming up in about 1 hour!\n\n` +
            `Doctor: ${apt.doctorId.name}\n` +
            `Clinic: ${apt.clinicId.name}\n` +
            `Address: ${apt.clinicId.address}\n` +
            `Time: ${apt.time}`;

          await notificationService.sendMessage(apt.userId.telegramId, message);
        } catch (error) {
          console.error(`Failed to send hour reminder for ${apt._id}:`, error.message);
        }
      }
    }
  }

  async markNoShows() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    await Appointment.updateMany(
      {
        status: 'scheduled',
        date: { $gte: today, $lte: endOfDay },
      },
      { status: 'no-show' }
    );
  }
}

module.exports = new ReminderService();
