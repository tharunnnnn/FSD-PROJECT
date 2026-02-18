import { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const AdminLeaves = () => {
    const [leaves, setLeaves] = useState([]);
    const [filteredLeaves, setFilteredLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All'); // All, Pending, Approved, Rejected
    const { addToast } = useToast();

    useEffect(() => {
        fetchLeaves();
    }, []);

    useEffect(() => {
        if (filter === 'All') {
            setFilteredLeaves(leaves);
        } else {
            setFilteredLeaves(leaves.filter(leave => leave.status === filter));
        }
    }, [filter, leaves]);

    const fetchLeaves = async () => {
        try {
            const res = await api.get('/leaves/all-leaves');
            setLeaves(res.data);
        } catch (err) {
            addToast(err.response?.data?.message || 'Failed to fetch leaves', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await api.put(`/leaves/${id}/status`, { status });
            addToast(`Leave request ${status.toLowerCase()} successfully`, 'success');

            // Optimistic update
            setLeaves(leaves.map(leave =>
                leave._id === id ? { ...leave, status } : leave
            ));
        } catch (err) {
            addToast(err.response?.data?.message || 'Update failed', 'error');
        }
    };

    return (
        <div className="container">
            <div className="d-flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Leave Management</h2>
                <div className="d-flex gap-2">
                    {['All', 'Pending', 'Approved', 'Rejected'].map(status => (
                        <button
                            key={status}
                            className={`btn ${filter === status ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setFilter(status)}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="text-center py-8">Loading requests...</div>
            ) : (
                <div className="card table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Role</th>
                                <th>Leave Type</th>
                                <th>Duration</th>
                                <th>Reason</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLeaves.length === 0 ? (
                                <tr><td colSpan="7" className="text-center py-4">No requests found.</td></tr>
                            ) : (
                                filteredLeaves.map((leave) => {
                                    const days = Math.ceil((new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24)) + 1;
                                    return (
                                        <tr key={leave._id}>
                                            <td>
                                                <div className="font-medium">{leave.user?.name || 'Unknown'}</div>
                                                <div className="text-muted text-xs">{leave.user?.email}</div>
                                            </td>
                                            <td>{leave.user?.position || 'Employee'}</td>
                                            <td>
                                                <div className="font-medium">{leave.leaveType}</div>
                                                <div className="text-muted text-xs">{days} Day(s)</div>
                                            </td>
                                            <td>
                                                <div className="text-sm">
                                                    {new Date(leave.startDate).toLocaleDateString()}
                                                    <br />
                                                    <span className="text-muted">to</span> {new Date(leave.endDate).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td style={{ maxWidth: '200px' }}>
                                                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={leave.reason}>
                                                    {leave.reason}
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`badge badge-${leave.status.toLowerCase()}`}>
                                                    {leave.status}
                                                </span>
                                            </td>
                                            <td>
                                                {leave.status === 'Pending' && (
                                                    <div className="d-flex gap-2">
                                                        <button
                                                            className="btn btn-primary"
                                                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', background: 'var(--success)' }}
                                                            onClick={() => handleStatusUpdate(leave._id, 'Approved')}
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            className="btn btn-danger"
                                                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                                                            onClick={() => handleStatusUpdate(leave._id, 'Rejected')}
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminLeaves;
