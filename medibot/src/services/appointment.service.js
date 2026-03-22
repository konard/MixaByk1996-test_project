const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const calendarService = require('./calendar.service');

class AppointmentService {
  async createAppointment({ userId, doctorId, clinicId, date, time }) {
    const existing = await Appointment.findOne({
      doctorId,
      date: new Date(date),
      time,
      status: 'scheduled',
    });

    if (existing) {
      throw new Error('This time slot is already booked');
    }

    const appointment = new Appointment({
      userId,
      doctorId,
      clinicId,
      date: new Date(date),
      time,
      status: 'scheduled',
    });

    const doctor = await Doctor.findById(doctorId);
    const user = await User.findById(userId);

    if (doctor && user) {
      const googleEventId = await calendarService.createEvent(doctor, appointment, user);
      if (googleEventId) {
        appointment.googleEventId = googleEventId;
      }
    }

    await appointment.save();
    return appointment;
  }

  async cancelAppointment(appointmentId) {
    const appointment = await Appointment.findById(appointmentId).populate('doctorId');

    if (!appointment) {
      throw new Error('Appointment not found');
    }

    if (appointment.status !== 'scheduled') {
      throw new Error('Appointment cannot be cancelled');
    }

    appointment.status = 'cancelled';
    await appointment.save();

    if (appointment.googleEventId && appointment.doctorId) {
      await calendarService.deleteEvent(
        appointment.doctorId.calendarId,
        appointment.googleEventId
      );
    }

    return appointment;
  }

  async rescheduleAppointment(appointmentId, newDate, newTime) {
    const oldAppointment = await this.cancelAppointment(appointmentId);

    const newAppointment = await this.createAppointment({
      userId: oldAppointment.userId,
      doctorId: oldAppointment.doctorId._id || oldAppointment.doctorId,
      clinicId: oldAppointment.clinicId,
      date: newDate,
      time: newTime,
    });

    return newAppointment;
  }

  async getUpcomingAppointments(userId) {
    return Appointment.find({
      userId,
      status: 'scheduled',
      date: { $gte: new Date() },
    })
      .populate('doctorId')
      .populate('clinicId')
      .sort({ date: 1 });
  }

  async getAppointmentsByDateRange(startDate, endDate, filters = {}) {
    const query = {
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
      ...filters,
    };
    return Appointment.find(query)
      .populate('userId')
      .populate('doctorId')
      .populate('clinicId')
      .sort({ date: 1 });
  }

  async getStatistics(startDate, endDate) {
    const total = await Appointment.countDocuments({
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
    });

    const byStatus = await Appointment.aggregate([
      {
        $match: {
          date: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const byDoctor = await Appointment.aggregate([
      {
        $match: {
          date: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      {
        $group: {
          _id: '$doctorId',
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'doctors',
          localField: '_id',
          foreignField: '_id',
          as: 'doctor',
        },
      },
      { $unwind: '$doctor' },
      {
        $project: {
          doctorName: '$doctor.name',
          specialization: '$doctor.specialization',
          count: 1,
        },
      },
      { $sort: { count: -1 } },
    ]);

    const byClinic = await Appointment.aggregate([
      {
        $match: {
          date: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      {
        $group: {
          _id: '$clinicId',
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'clinics',
          localField: '_id',
          foreignField: '_id',
          as: 'clinic',
        },
      },
      { $unwind: '$clinic' },
      {
        $project: {
          clinicName: '$clinic.name',
          city: '$clinic.city',
          count: 1,
        },
      },
      { $sort: { count: -1 } },
    ]);

    return { total, byStatus, byDoctor, byClinic };
  }
}

module.exports = new AppointmentService();
