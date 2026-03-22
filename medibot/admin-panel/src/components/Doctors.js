import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: '',
    specialization: '',
    clinicId: '',
    calendarId: '',
    workingHours: { start: '09:00', end: '18:00', slotDuration: 30, daysOff: [0, 6] },
  });

  const fetchDoctors = async () => {
    const res = await api.get('/doctors');
    setDoctors(res.data);
  };

  const fetchClinics = async () => {
    const res = await api.get('/clinics');
    setClinics(res.data);
  };

  useEffect(() => {
    fetchDoctors();
    fetchClinics();
  }, []);

  const resetForm = () => {
    setForm({
      name: '',
      specialization: '',
      clinicId: '',
      calendarId: '',
      workingHours: { start: '09:00', end: '18:00', slotDuration: 30, daysOff: [0, 6] },
    });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/doctors/${editing}`, form);
      } else {
        await api.post('/doctors', form);
      }
      fetchDoctors();
      resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (doctor) => {
    setForm({
      name: doctor.name,
      specialization: doctor.specialization,
      clinicId: doctor.clinicId?._id || doctor.clinicId,
      calendarId: doctor.calendarId,
      workingHours: doctor.workingHours,
    });
    setEditing(doctor._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      await api.delete(`/doctors/${id}`);
      fetchDoctors();
    }
  };

  return (
    <div>
      <div style={styles.header}>
        <h2>Doctors</h2>
        <button onClick={() => setShowForm(!showForm)} style={styles.addBtn}>
          {showForm ? 'Cancel' : 'Add Doctor'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGrid}>
            <div style={styles.field}>
              <label style={styles.label}>Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Specialization</label>
              <input
                type="text"
                value={form.specialization}
                onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Clinic</label>
              <select
                value={form.clinicId}
                onChange={(e) => setForm({ ...form, clinicId: e.target.value })}
                style={styles.input}
                required
              >
                <option value="">Select Clinic</option>
                {clinics.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Google Calendar ID</label>
              <input
                type="text"
                value={form.calendarId}
                onChange={(e) => setForm({ ...form, calendarId: e.target.value })}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Working Hours Start</label>
              <input
                type="time"
                value={form.workingHours.start}
                onChange={(e) =>
                  setForm({ ...form, workingHours: { ...form.workingHours, start: e.target.value } })
                }
                style={styles.input}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Working Hours End</label>
              <input
                type="time"
                value={form.workingHours.end}
                onChange={(e) =>
                  setForm({ ...form, workingHours: { ...form.workingHours, end: e.target.value } })
                }
                style={styles.input}
              />
            </div>
          </div>
          <button type="submit" style={styles.submitBtn}>
            {editing ? 'Update' : 'Create'} Doctor
          </button>
        </form>
      )}

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Specialization</th>
            <th style={styles.th}>Clinic</th>
            <th style={styles.th}>Working Hours</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doc) => (
            <tr key={doc._id}>
              <td style={styles.td}>{doc.name}</td>
              <td style={styles.td}>{doc.specialization}</td>
              <td style={styles.td}>{doc.clinicId?.name}</td>
              <td style={styles.td}>
                {doc.workingHours?.start} - {doc.workingHours?.end}
              </td>
              <td style={styles.td}>
                <button onClick={() => handleEdit(doc)} style={styles.editBtn}>Edit</button>
                <button onClick={() => handleDelete(doc._id)} style={styles.deleteBtn}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  addBtn: { padding: '10px 20px', backgroundColor: '#1a73e8', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  form: { backgroundColor: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
  field: { marginBottom: '10px' },
  label: { display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' },
  input: { width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' },
  submitBtn: { marginTop: '15px', padding: '10px 20px', backgroundColor: '#34a853', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  table: { width: '100%', backgroundColor: '#fff', borderCollapse: 'collapse', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  th: { textAlign: 'left', padding: '12px 16px', backgroundColor: '#f5f5f5', fontWeight: '600' },
  td: { padding: '12px 16px', borderTop: '1px solid #eee' },
  editBtn: { padding: '4px 10px', backgroundColor: '#1a73e8', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px', fontSize: '12px' },
  deleteBtn: { padding: '4px 10px', backgroundColor: '#ea4335', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
};

export default Doctors;
