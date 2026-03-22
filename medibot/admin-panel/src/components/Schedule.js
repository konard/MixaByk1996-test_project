import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Schedule() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/doctors').then((res) => setDoctors(res.data));
  }, []);

  const fetchSchedule = async () => {
    if (!selectedDoctor || !selectedDate) return;

    setLoading(true);
    try {
      const res = await api.get('/appointments', {
        params: {
          doctorId: selectedDoctor,
          startDate: selectedDate,
          endDate: selectedDate,
          limit: 100,
        },
      });
      setAppointments(res.data.appointments);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSchedule();
  }, [selectedDoctor, selectedDate]);

  const timeSlots = [];
  for (let h = 8; h < 20; h++) {
    timeSlots.push(`${String(h).padStart(2, '0')}:00`);
    timeSlots.push(`${String(h).padStart(2, '0')}:30`);
  }

  const getAppointmentForSlot = (time) => {
    return appointments.find((apt) => apt.time === time && apt.status === 'scheduled');
  };

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>Schedule</h2>

      <div style={styles.controls}>
        <select
          value={selectedDoctor}
          onChange={(e) => setSelectedDoctor(e.target.value)}
          style={styles.select}
        >
          <option value="">Select Doctor</option>
          {doctors.map((doc) => (
            <option key={doc._id} value={doc._id}>
              {doc.name} - {doc.specialization}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={styles.input}
        />
      </div>

      {selectedDoctor && selectedDate && (
        <div style={styles.scheduleGrid}>
          {loading ? (
            <div>Loading schedule...</div>
          ) : (
            timeSlots.map((time) => {
              const apt = getAppointmentForSlot(time);
              return (
                <div
                  key={time}
                  style={{
                    ...styles.slot,
                    backgroundColor: apt ? '#e3f2fd' : '#fff',
                    borderLeft: apt ? '4px solid #1a73e8' : '4px solid #e0e0e0',
                  }}
                >
                  <div style={styles.slotTime}>{time}</div>
                  {apt ? (
                    <div style={styles.slotInfo}>
                      <strong>
                        {apt.userId?.firstName} {apt.userId?.lastName}
                      </strong>
                      <span style={styles.slotStatus}>{apt.status}</span>
                    </div>
                  ) : (
                    <div style={styles.slotEmpty}>Available</div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  controls: {
    display: 'flex',
    gap: '15px',
    marginBottom: '20px',
  },
  select: {
    padding: '10px 12px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    minWidth: '250px',
  },
  input: {
    padding: '10px 12px',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  scheduleGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  slot: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    borderRadius: '4px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  },
  slotTime: {
    fontWeight: '600',
    width: '70px',
    color: '#333',
  },
  slotInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  slotStatus: {
    fontSize: '12px',
    color: '#1a73e8',
    backgroundColor: '#bbdefb',
    padding: '2px 8px',
    borderRadius: '10px',
  },
  slotEmpty: {
    color: '#999',
    fontSize: '14px',
  },
};

export default Schedule;
