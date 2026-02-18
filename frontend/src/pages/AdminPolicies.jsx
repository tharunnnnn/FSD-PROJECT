import { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const AdminPolicies = () => {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newPolicy, setNewPolicy] = useState({ policyName: '', maxDays: '', description: '' });
    const { addToast } = useToast();

    useEffect(() => {
        fetchPolicies();
    }, []);

    const fetchPolicies = async () => {
        try {
            const res = await api.get('/policies');
            setPolicies(res.data);
        } catch (err) {
            addToast('Failed to fetch policies', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/policies', newPolicy);
            addToast('Policy created successfully', 'success');
            setNewPolicy({ policyName: '', maxDays: '', description: '' });
            fetchPolicies();
        } catch (err) {
            addToast(err.response?.data?.message || 'Failed to add policy', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure? This action cannot be undone.')) return;
        try {
            await api.delete(`/policies/${id}`);
            addToast('Policy deleted successfully', 'success');
            setPolicies(policies.filter(p => p._id !== id));
        } catch (err) {
            addToast('Failed to delete policy', 'error');
        }
    };

    return (
        <div className="container">
            <div className="d-flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Leave Policies</h2>
                <button className="btn btn-primary" onClick={() => document.getElementById('new-policy-form').scrollIntoView()}>
                    Add New Policy
                </button>
            </div>

            <div className="grid gap-6">
                <div className="card table-container">
                    {loading ? <p className="text-center py-4">Loading policies...</p> : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Policy Name</th>
                                    <th>Max Days / Year</th>
                                    <th>Description</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {policies.map((policy) => (
                                    <tr key={policy._id}>
                                        <td className="font-bold">{policy.policyName}</td>
                                        <td>{policy.maxDays}</td>
                                        <td className="text-muted text-sm">{policy.description || '-'}</td>
                                        <td>
                                            <button
                                                onClick={() => handleDelete(policy._id)}
                                                className="btn btn-danger"
                                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div id="new-policy-form" className="card max-w-xl">
                    <h3 className="font-bold mb-4">Create New Policy</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Policy Name</label>
                            <input
                                type="text" className="form-control"
                                placeholder="e.g. Remote Work"
                                value={newPolicy.policyName}
                                onChange={(e) => setNewPolicy({ ...newPolicy, policyName: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Default Max Days</label>
                            <input
                                type="number" className="form-control"
                                placeholder="20"
                                value={newPolicy.maxDays}
                                onChange={(e) => setNewPolicy({ ...newPolicy, maxDays: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Description (Optional)</label>
                            <textarea
                                className="form-control"
                                rows="3"
                                value={newPolicy.description}
                                onChange={(e) => setNewPolicy({ ...newPolicy, description: e.target.value })}
                            />
                        </div>
                        <div className="text-right">
                            <button type="submit" className="btn btn-primary">Save Policy</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminPolicies;
