const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  specialization: {
    type: String,
    required: true,
    trim: true,
  },
  clinicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clinic',
    required: true,
  },
  calendarId: {
    type: String,
    required: true,
  },
  workingHours: {
    start: { type: String, default: '09:00' },
    end: { type: String, default: '18:00' },
    slotDuration: { type: Number, default: 30 },
    daysOff: { type: [Number], default: [0, 6] },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Doctor', doctorSchema);
