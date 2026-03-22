import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/stats/dashboard')
      .then((res) => setData(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (!data) return <div>Failed to load dashboard data.</div>;

  const statusMap = {};
  if (data.monthlyStats?.byStatus) {
    data.monthlyStats.byStatus.forEach((s) => {
      statusMap[s._id] = s.count;
    });
  }

  return (
    <div>
      <h2 style={styles.title}>Dashboard</h2>
      <div style={styles.cards}>
        <div style={{ ...styles.card, borderTop: '4px solid #1a73e8' }}>
          <div style={styles.cardLabel}>Total Patients</div>
          <div style={styles.cardValue}>{data.totalUsers}</div>
        </div>
        <div style={{ ...styles.card, borderTop: '4px solid #34a853' }}>
          <div style={styles.cardLabel}>Total Appointments</div>
          <div style={styles.cardValue}>{data.totalAppointments}</div>
        </div>
        <div style={{ ...styles.card, borderTop: '4px solid #fbbc04' }}>
          <div style={styles.cardLabel}>Doctors</div>
          <div style={styles.cardValue}>{data.totalDoctors}</div>
        </div>
        <div style={{ ...styles.card, borderTop: '4px solid #ea4335' }}>
          <div style={styles.cardLabel}>Clinics</div>
          <div style={styles.cardValue}>{data.totalClinics}</div>
        </div>
      </div>

      <h3 style={styles.subtitle}>This Month</h3>
      <div style={styles.cards}>
        <div style={styles.card}>
          <div style={styles.cardLabel}>Scheduled</div>
          <div style={styles.cardValue}>{statusMap.scheduled || 0}</div>
        </div>
        <div style={styles.card}>
          <div style={styles.cardLabel}>Completed</div>
          <div style={styles.cardValue}>{statusMap.completed || 0}</div>
        </div>
        <div style={styles.card}>
          <div style={styles.cardLabel}>Cancelled</div>
          <div style={styles.cardValue}>{statusMap.cancelled || 0}</div>
        </div>
        <div style={styles.card}>
          <div style={styles.cardLabel}>No-shows</div>
          <div style={styles.cardValue}>{statusMap['no-show'] || 0}</div>
        </div>
      </div>

      {data.monthlyStats?.byDoctor?.length > 0 && (
        <>
          <h3 style={styles.subtitle}>Top Doctors This Month</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Doctor</th>
                <th style={styles.th}>Specialization</th>
                <th style={styles.th}>Appointments</th>
              </tr>
            </thead>
            <tbody>
              {data.monthlyStats.byDoctor.slice(0, 5).map((d) => (
                <tr key={d._id}>
                  <td style={styles.td}>{d.doctorName}</td>
                  <td style={styles.td}>{d.specialization}</td>
                  <td style={styles.td}>{d.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

const styles = {
  title: { marginBottom: '20px', color: '#333' },
  subtitle: { marginTop: '30px', marginBottom: '15px', color: '#555' },
  cards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  cardLabel: { color: '#666', fontSize: '14px', marginBottom: '8px' },
  cardValue: { fontSize: '28px', fontWeight: 'bold', color: '#333' },
  table: {
    width: '100%',
    backgroundColor: '#fff',
    borderCollapse: 'collapse',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  th: {
    textAlign: 'left',
    padding: '12px 16px',
    backgroundColor: '#f5f5f5',
    fontWeight: '600',
    color: '#333',
  },
  td: { padding: '12px 16px', borderTop: '1px solid #eee' },
};

export default Dashboard;
