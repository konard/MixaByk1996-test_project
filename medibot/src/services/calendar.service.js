const { calendar } = require('../config/calendar');
const Doctor = require('../models/Doctor');

class CalendarService {
  async getAvailableSlots(doctorId, dateStr) {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) throw new Error('Doctor not found');

    const date = new Date(dateStr);
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    let busySlots = [];
    try {
      const response = await calendar.freebusy.query({
        requestBody: {
          timeMin: startOfDay.toISOString(),
          timeMax: endOfDay.toISOString(),
          items: [{ id: doctor.calendarId }],
        },
      });
      busySlots = response.data.calendars[doctor.calendarId]?.busy || [];
    } catch (error) {
      console.error('Google Calendar API error:', error.message);
    }

    const { start, end, slotDuration } = doctor.workingHours;
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);

    const slots = [];
    let currentHour = startHour;
    let currentMin = startMin;

    while (
      currentHour < endHour ||
      (currentHour === endHour && currentMin < endMin)
    ) {
      const slotStart = new Date(date);
      slotStart.setHours(currentHour, currentMin, 0, 0);

      const slotEnd = new Date(slotStart);
      slotEnd.setMinutes(slotEnd.getMinutes() + slotDuration);

      const isBusy = busySlots.some((busy) => {
        const busyStart = new Date(busy.start);
        const busyEnd = new Date(busy.end);
        return slotStart < busyEnd && slotEnd > busyStart;
      });

      if (!isBusy) {
        const timeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
        slots.push(timeStr);
      }

      currentMin += slotDuration;
      if (currentMin >= 60) {
        currentHour += Math.floor(currentMin / 60);
        currentMin = currentMin % 60;
      }
    }

    return slots;
  }

  async createEvent(doctor, appointment, user) {
    const [hours, minutes] = appointment.time.split(':').map(Number);
    const startTime = new Date(appointment.date);
    startTime.setHours(hours, minutes, 0, 0);

    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + doctor.workingHours.slotDuration);

    try {
      const event = await calendar.events.insert({
        calendarId: doctor.calendarId,
        requestBody: {
          summary: `Appointment: ${user.firstName} ${user.lastName}`,
          description: `Patient: ${user.firstName} ${user.lastName}\nPhone: ${user.phone}`,
          start: { dateTime: startTime.toISOString() },
          end: { dateTime: endTime.toISOString() },
        },
      });
      return event.data.id;
    } catch (error) {
      console.error('Error creating calendar event:', error.message);
      return null;
    }
  }

  async deleteEvent(calendarId, eventId) {
    try {
      await calendar.events.delete({
        calendarId,
        eventId,
      });
    } catch (error) {
      console.error('Error deleting calendar event:', error.message);
    }
  }
}

module.exports = new CalendarService();
