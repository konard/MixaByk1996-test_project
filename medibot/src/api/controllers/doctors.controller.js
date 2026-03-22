const Doctor = require('../../models/Doctor');

const getAll = async (req, res) => {
  try {
    const { clinicId, specialization } = req.query;
    const query = {};
    if (clinicId) query.clinicId = clinicId;
    if (specialization) query.specialization = new RegExp(specialization, 'i');

    const doctors = await Doctor.find(query).populate('clinicId').sort({ name: 1 });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('clinicId');
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const create = async (req, res) => {
  try {
    const doctor = new Doctor(req.body);
    await doctor.save();
    res.status(201).json(doctor);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const update = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const remove = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    res.json({ message: 'Doctor deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getAll, getById, create, update, remove };
