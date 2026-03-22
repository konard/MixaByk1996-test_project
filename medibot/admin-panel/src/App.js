import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Appointments from './components/Appointments';
import Doctors from './components/Doctors';
import Clinics from './components/Clinics';
import Schedule from './components/Schedule';

function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="clinics" element={<Clinics />} />
        <Route path="schedule" element={<Schedule />} />
      </Route>
    </Routes>
  );
}

export default App;
