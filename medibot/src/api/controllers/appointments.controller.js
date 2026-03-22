const Appointment = require('../../models/Appointment');
const appointmentService = require('../../services/appointment.service');

const getAll = async (req, res) => {
  try {
    const { status, startDate, endDate, doctorId, clinicId, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (doctorId) query.doctorId = doctorId;
    if (clinicId) query.clinicId = clinicId;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [appointments, total] = await Promise.all([
      Appointment.find(query)
        .populate('userId')
        .populate('doctorId')
        .populate('clinicId')
        .sort({ date: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Appointment.countDocuments(query),
    ]);

    res.json({
      appointments,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('userId')
      .populate('doctorId')
      .populate('clinicId');

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    if (status === 'cancelled') {
      await appointmentService.cancelAppointment(req.params.id);
    } else {
      appointment.status = status;
      await appointment.save();
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const remove = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json({ message: 'Appointment deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getAll, getById, updateStatus, remove };
