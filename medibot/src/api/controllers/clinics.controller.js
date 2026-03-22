const Clinic = require('../../models/Clinic');

const getAll = async (req, res) => {
  try {
    const { city } = req.query;
    const query = {};
    if (city) query.city = new RegExp(city, 'i');

    const clinics = await Clinic.find(query).sort({ name: 1 });
    res.json(clinics);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getById = async (req, res) => {
  try {
    const clinic = await Clinic.findById(req.params.id);
    if (!clinic) {
      return res.status(404).json({ error: 'Clinic not found' });
    }
    res.json(clinic);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const create = async (req, res) => {
  try {
    const clinic = new Clinic(req.body);
    await clinic.save();
    res.status(201).json(clinic);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const update = async (req, res) => {
  try {
    const clinic = await Clinic.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!clinic) {
      return res.status(404).json({ error: 'Clinic not found' });
    }
    res.json(clinic);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const remove = async (req, res) => {
  try {
    const clinic = await Clinic.findByIdAndDelete(req.params.id);
    if (!clinic) {
      return res.status(404).json({ error: 'Clinic not found' });
    }
    res.json({ message: 'Clinic deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getAll, getById, create, update, remove };
