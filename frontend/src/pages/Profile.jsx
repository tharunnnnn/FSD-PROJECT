import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/auth/profile');
                setProfile(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchProfile();
    }, []);

    if (!profile) return <div>Loading profile...</div>;

    return (
        <div className="container max-w-3xl">
            <div className="card mb-6">
                <div className="d-flex items-center gap-6 mb-6">
                    <div className="w-24 h-24 rounded-full bg-primary text-white flex items-center justify-center text-4xl font-bold">
                        {profile.name.charAt(0)}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">{profile.name}</h2>
                        <div className="text-muted">{profile.role} • {profile.department}</div>
                        <div className="mt-2 badge badge-approved">Active Employee</div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="form-group">
                        <label className="text-xs text-muted font-bold uppercase">Email Address</label>
                        <div className="p-2 bg-slate-50 rounded border">{profile.email}</div>
                    </div>
                    <div className="form-group">
                        <label className="text-xs text-muted font-bold uppercase">Position</label>
                        <div className="p-2 bg-slate-50 rounded border">{profile.position}</div>
                    </div>
                    <div className="form-group">
                        <label className="text-xs text-muted font-bold uppercase">Joined Date</label>
                        <div className="p-2 bg-slate-50 rounded border">{new Date(profile.createdAt).toLocaleDateString()}</div>
                    </div>
                </div>
            </div>

            <div className="card">
                <h3 className="font-bold mb-4">Leave Balance Overview</h3>
                {profile.leaveBalance ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.entries(profile.leaveBalance).map(([key, val]) => (
                            <div key={key} className="p-4 border rounded bg-slate-50 text-center">
                                <div className="text-2xl font-bold text-primary">{val}</div>
                                <div className="text-xs text-muted uppercase mt-1">{key}</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted">Balance not available.</p>
                )}
            </div>
        </div>
    );
};

export default Profile;
