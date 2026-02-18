import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('employee');
    const { register } = useAuth(); // Note: register function in AuthContext needs to accept role
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Assuming register accepts role as 4th argument or within object
            // wait, AuthContext.register(name, email, password)
            // I need to update AuthContext to handle role
            await register(name, email, password, role);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="d-flex items-center justify-between" style={{ minHeight: '100vh', padding: '2rem' }}>
            <div className="card" style={{ maxWidth: '400px', width: '100%', margin: '0 auto' }}>
                <h2 className="text-center mb-4">Register</h2>
                {error && <div className="badge badge-rejected mb-4 text-center" style={{ display: 'block' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Name</label>
                        <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Role (For Demo)</label>
                        <select className="form-control" value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="employee">Employee</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Register</button>
                </form>
                <p className="mt-4 text-center">
                    Already have an account? <a href="/login" style={{ color: 'var(--primary)' }}>Login</a>
                </p>
            </div>
        </div>
    );
};

export default Register;
