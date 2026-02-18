import { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users');
            setUsers(res.data);
        } catch (err) {
            addToast('Failed to fetch users', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="d-flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Employee Directory</h2>
                <div className="text-muted text-sm">{users.length} Active Users</div>
            </div>

            {loading ? (
                <div className="text-center py-8">Loading directory...</div>
            ) : (
                <div className="card table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Role</th>
                                <th>Department</th>
                                <th>Status</th>
                                <th>Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td>
                                        <div className="font-medium">{user.name}</div>
                                        <div className="text-muted text-xs">{user.email}</div>
                                    </td>
                                    <td>
                                        <span className={`badge ${user.role === 'admin' ? 'badge-approved' : 'bg-slate-100 text-slate-600'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>{user.department || 'General'}</td>
                                    <td>
                                        <span className="badge badge-approved">Active</span>
                                    </td>
                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;
