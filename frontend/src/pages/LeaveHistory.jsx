import { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const LeaveHistory = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            const res = await api.get('/leaves/my-leaves');
            setLeaves(res.data);
        } catch (err) {
            addToast(err.response?.data?.message || 'Failed to fetch history', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this request?')) return;
        try {
            await api.delete(`/leaves/${id}`);
            addToast('Request cancelled successfully', 'success');
            setLeaves(leaves.filter(leave => leave._id !== id));
        } catch (err) {
            addToast(err.response?.data?.message || 'Failed to cancel request', 'error');
        }
    };

    return (
        <div className="container">
            <h2 className="text-xl font-bold mb-6">My Leave Application History</h2>

            {loading ? (
                <div className="text-center py-8">Loading history...</div>
            ) : (
                <div className="card table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Submitted On</th>
                                <th>Leave Type</th>
                                <th>Dates</th>
                                <th>Duration</th>
                                <th>Reason</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaves.length === 0 ? (
                                <tr><td colSpan="7" className="text-center py-4 text-muted">No applications found.</td></tr>
                            ) : (
                                leaves.map((leave) => {
                                    const days = Math.ceil((new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24)) + 1;
                                    return (
                                        <tr key={leave._id}>
                                            <td>{new Date(leave.createdAt).toLocaleDateString()}</td>
                                            <td>{leave.leaveType}</td>
                                            <td>
                                                {new Date(leave.startDate).toLocaleDateString()} <br />
                                                <span className="text-muted text-xs">to</span> {new Date(leave.endDate).toLocaleDateString()}
                                            </td>
                                            <td>{days} Day(s)</td>
                                            <td style={{ maxWidth: '250px' }}>
                                                <div title={leave.reason} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
                                                    <button
                                                        className="btn btn-danger"
                                                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                                                        onClick={() => handleCancel(leave._id)}
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                                {leave.status !== 'Pending' && <span className="text-muted text-xs">-</span>}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default LeaveHistory;
