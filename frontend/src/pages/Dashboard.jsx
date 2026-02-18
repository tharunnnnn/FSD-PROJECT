import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);

    // Admin Data
    const [adminStats, setAdminStats] = useState({
        totalEmployees: 0,
        pendingRequests: 0,
        approvedToday: 0,
        recentLeaves: []
    });

    // Employee Data
    const [myLeaves, setMyLeaves] = useState([]);
    const [balance, setBalance] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (user.role === 'admin') {
                    const res = await api.get('/leaves/admin-stats');
                    setAdminStats(res.data);
                } else {
                    // Refresh user profile for latest balance
                    const profileRes = await api.get('/auth/profile');
                    setBalance(profileRes.data.leaveBalance || {});

                    const leavesRes = await api.get('/leaves/my-leaves');
                    setMyLeaves(leavesRes.data.slice(0, 5)); // Recent 5
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user.role]);

    if (loading) {
        return <div>Loading dashboard...</div>;
    }

    if (user.role === 'admin') {
        return (
            <div>
                <div className="dashboard-grid">
                    <div className="card">
                        <div className="stat-label">Total Employees</div>
                        <div className="stat-value">{adminStats.totalEmployees || 0}</div>
                        <div className="mt-4" style={{ color: 'var(--success)', fontSize: '0.875rem' }}>Active Personnel</div>
                    </div>
                    <div className="card" style={{ borderLeft: '4px solid var(--warning)' }}>
                        <div className="stat-label">Pending Requests</div>
                        <div className="stat-value" style={{ color: 'var(--warning)' }}>{adminStats.pendingRequests || 0}</div>
                        <div className="mt-4" style={{ fontSize: '0.875rem' }}>Requires Action</div>
                    </div>
                    <div className="card">
                        <div className="stat-label">Approved Today</div>
                        <div className="stat-value" style={{ color: 'var(--success)' }}>{adminStats.approvedToday || 0}</div>
                        <div className="mt-4" style={{ fontSize: '0.875rem' }}>Leaves Started</div>
                    </div>
                </div>

                <div className="grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                    <div className="card">
                        <h3 className="mb-4">Recent Leave Applications</h3>
                        {adminStats.recentLeaves && adminStats.recentLeaves.length > 0 ? (
                            <table className="w-full">
                                <thead>
                                    <tr>
                                        <th>Employee</th>
                                        <th>Type</th>
                                        <th>Dates</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {adminStats.recentLeaves.map(leave => (
                                        <tr key={leave._id}>
                                            <td>
                                                <div style={{ fontWeight: 500 }}>{leave.user?.name}</div>
                                            </td>
                                            <td>{leave.leaveType}</td>
                                            <td>
                                                {new Date(leave.startDate).toLocaleDateString()}
                                            </td>
                                            <td>
                                                <span className={`badge badge-${leave.status.toLowerCase()}`}>
                                                    {leave.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-center text-muted">No recent activity</p>
                        )}
                        <div className="mt-4 text-center">
                            <Link to="/admin/leaves" className="btn btn-secondary">View All Requests</Link>
                        </div>
                    </div>

                    <div className="card">
                        <h3 className="mb-4">Quick Actions</h3>
                        <div className="d-flex flex-col gap-2">
                            <Link to="/admin/users" className="btn btn-primary w-full">Manage Employees</Link>
                            <Link to="/admin/policies" className="btn btn-secondary w-full">Update Policies</Link>
                            <button className="btn btn-secondary w-full">Generate Report</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Employee Dashboard
    return (
        <div>
            <div className="dashboard-grid">
                {Object.entries(balance).slice(0, 3).map(([key, val]) => (
                    <div className="card" key={key}>
                        <div className="stat-label">{key}</div>
                        <div className="stat-value">{val}</div>
                        <div className="mt-4" style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Days Remaining</div>
                    </div>
                ))}
            </div>

            <div className="card">
                <div className="d-flex justify-between items-center mb-4">
                    <h3>Recent Applications</h3>
                    <Link to="/apply-leave" className="btn btn-primary">Apply New Leave</Link>
                </div>

                {myLeaves.length > 0 ? (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Dates</th>
                                    <th>Days</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myLeaves.map(leave => {
                                    const days = Math.ceil((new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24)) + 1;
                                    return (
                                        <tr key={leave._id}>
                                            <td>{leave.leaveType}</td>
                                            <td>
                                                {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                            </td>
                                            <td>{days} Day(s)</td>
                                            <td>
                                                <span className={`badge badge-${leave.status.toLowerCase()}`}>
                                                    {leave.status}
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-8 text-muted">
                        No leave history found. Start by applying for leave!
                    </div>
                )}

                {myLeaves.length > 0 && (
                    <div className="mt-4 text-center">
                        <Link to="/my-leaves" className="btn btn-secondary">View Full History</Link>
                    </div>
                )}
            </div>

        </div>
    );
};

export default Dashboard;
