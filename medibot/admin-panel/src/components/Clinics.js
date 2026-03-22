import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Clinics() {
  const [clinics, setClinics] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: '',
    address: '',
    city: '',
    phone: '',
    workingHours: { start: '08:00', end: '20:00', daysOff: [0] },
  });

  const fetchClinics = async () => {
    const res = await api.get('/clinics');
    setClinics(res.data);
  };

  useEffect(() => {
    fetchClinics();
  }, []);

  const resetForm = () => {
    setForm({
      name: '',
      address: '',
      city: '',
      phone: '',
      workingHours: { start: '08:00', end: '20:00', daysOff: [0] },
    });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/clinics/${editing}`, form);
      } else {
        await api.post('/clinics', form);
      }
      fetchClinics();
      resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (clinic) => {
    setForm({
      name: clinic.name,
      address: clinic.address,
      city: clinic.city,
      phone: clinic.phone,
      workingHours: clinic.workingHours,
    });
    setEditing(clinic._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this clinic?')) {
      await api.delete(`/clinics/${id}`);
      fetchClinics();
    }
  };

  return (
    <div>
      <div style={styles.header}>
        <h2>Clinics</h2>
        <button onClick={() => setShowForm(!showForm)} style={styles.addBtn}>
          {showForm ? 'Cancel' : 'Add Clinic'}
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
              <label style={styles.label}>City</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Address</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Phone</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
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
            {editing ? 'Update' : 'Create'} Clinic
          </button>
        </form>
      )}

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>City</th>
            <th style={styles.th}>Address</th>
            <th style={styles.th}>Phone</th>
            <th style={styles.th}>Hours</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clinics.map((clinic) => (
            <tr key={clinic._id}>
              <td style={styles.td}>{clinic.name}</td>
              <td style={styles.td}>{clinic.city}</td>
              <td style={styles.td}>{clinic.address}</td>
              <td style={styles.td}>{clinic.phone}</td>
              <td style={styles.td}>
                {clinic.workingHours?.start} - {clinic.workingHours?.end}
              </td>
              <td style={styles.td}>
                <button onClick={() => handleEdit(clinic)} style={styles.editBtn}>Edit</button>
                <button onClick={() => handleDelete(clinic._id)} style={styles.deleteBtn}>Delete</button>
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

export default Clinics;
