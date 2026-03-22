const jwt = require('jsonwebtoken');
const Admin = require('../../models/Admin');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getProfile = async (req, res) => {
  res.json(req.admin);
};

const createAdmin = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const admin = new Admin({ email, password, name, role });
    await admin.save();

    res.status(201).json({
      id: admin._id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { login, getProfile, createAdmin };
