const appointmentService = require('../../services/appointment.service');
const User = require('../../models/User');
const Doctor = require('../../models/Doctor');
const Clinic = require('../../models/Clinic');
const Appointment = require('../../models/Appointment');

const getDashboard = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const [totalUsers, totalDoctors, totalClinics, totalAppointments, stats] =
      await Promise.all([
        User.countDocuments(),
        Doctor.countDocuments(),
        Clinic.countDocuments(),
        Appointment.countDocuments(),
        appointmentService.getStatistics(startOfMonth, endOfMonth),
      ]);

    res.json({
      totalUsers,
      totalDoctors,
      totalClinics,
      totalAppointments,
      monthlyStats: stats,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getStatistics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate are required' });
    }

    const stats = await appointmentService.getStatistics(startDate, endDate);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getDashboard, getStatistics };
