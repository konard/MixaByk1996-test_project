import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filters, setFilters] = useState({ status: '', startDate: '', endDate: '' });
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (filters.status) params.status = filters.status;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const res = await api.get('/appointments', { params });
      setAppointments(res.data.appointments);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/appointments/${id}/status`, { status });
      fetchAppointments(pagination.page);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFilter = (e) => {
    e.preventDefault();
    fetchAppointments(1);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const statusColors = {
    scheduled: '#1a73e8',
    completed: '#34a853',
    cancelled: '#ea4335',
    'no-show': '#fbbc04',
  };

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>Appointments</h2>

      <form onSubmit={handleFilter} style={styles.filterBar}>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          style={styles.select}
        >
          <option value="">All Statuses</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="no-show">No-show</option>
        </select>
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          style={styles.input}
        />
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          style={styles.input}
        />
        <button type="submit" style={styles.filterBtn}>Filter</button>
      </form>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Patient</th>
                <th style={styles.th}>Doctor</th>
                <th style={styles.th}>Clinic</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Time</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((apt) => (
                <tr key={apt._id}>
                  <td style={styles.td}>
                    {apt.userId?.firstName} {apt.userId?.lastName}
                  </td>
                  <td style={styles.td}>{apt.doctorId?.name}</td>
                  <td style={styles.td}>{apt.clinicId?.name}</td>
                  <td style={styles.td}>{formatDate(apt.date)}</td>
                  <td style={styles.td}>{apt.time}</td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.badge,
                        backgroundColor: statusColors[apt.status] || '#999',
                      }}
                    >
                      {apt.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {apt.status === 'scheduled' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(apt._id, 'completed')}
                          style={{ ...styles.actionBtn, backgroundColor: '#34a853' }}
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => handleStatusChange(apt._id, 'cancelled')}
                          style={{ ...styles.actionBtn, backgroundColor: '#ea4335' }}
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={styles.pagination}>
            <button
              onClick={() => fetchAppointments(pagination.page - 1)}
              disabled={pagination.page <= 1}
              style={styles.pageBtn}
            >
              Previous
            </button>
            <span>
              Page {pagination.page} of {pagination.pages} ({pagination.total} total)
            </span>
            <button
              onClick={() => fetchAppointments(pagination.page + 1)}
              disabled={pagination.page >= pagination.pages}
              style={styles.pageBtn}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  filterBar: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  select: { padding: '8px 12px', borderRadius: '4px', border: '1px solid #ddd' },
  input: { padding: '8px 12px', borderRadius: '4px', border: '1px solid #ddd' },
  filterBtn: {
    padding: '8px 16px',
    backgroundColor: '#1a73e8',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  table: {
    width: '100%',
    backgroundColor: '#fff',
    borderCollapse: 'collapse',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  th: {
    textAlign: 'left',
    padding: '12px 16px',
    backgroundColor: '#f5f5f5',
    fontWeight: '600',
  },
  td: { padding: '12px 16px', borderTop: '1px solid #eee' },
  badge: {
    color: '#fff',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
  },
  actionBtn: {
    color: '#fff',
    border: 'none',
    padding: '4px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '5px',
    fontSize: '12px',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '15px',
    marginTop: '20px',
  },
  pageBtn: {
    padding: '8px 16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: '#fff',
  },
};

export default Appointments;
