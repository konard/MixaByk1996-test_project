const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const appointmentsRoutes = require('./routes/appointments.routes');
const doctorsRoutes = require('./routes/doctors.routes');
const clinicsRoutes = require('./routes/clinics.routes');
const statsRoutes = require('./routes/stats.routes');

const startApiServer = () => {
  const app = express();
  const port = process.env.API_PORT || 3001;

  app.use(cors());
  app.use(express.json());

  app.use('/api/auth', authRoutes);
  app.use('/api/appointments', appointmentsRoutes);
  app.use('/api/doctors', doctorsRoutes);
  app.use('/api/clinics', clinicsRoutes);
  app.use('/api/stats', statsRoutes);

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.listen(port, () => {
    console.log(`API server running on port ${port}`);
  });

  return app;
};

module.exports = { startApiServer };
