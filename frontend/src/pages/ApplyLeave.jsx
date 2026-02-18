import { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const ApplyLeave = () => {
    const [leaveTypes, setLeaveTypes] = useState(['Sick Leave', 'Casual Leave', 'Annual Leave', 'Maternity Leave', 'Paternity Leave', 'Unpaid Leave']);
    const [formData, setFormData] = useState({
        leaveType: '',
        startDate: '',
        endDate: '',
        reason: '',
    });
    const [balance, setBalance] = useState({});
    const [loading, setLoading] = useState(false);
    const [balanceLoading, setBalanceLoading] = useState(true);
    const { addToast } = useToast();

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const res = await api.get('/auth/profile');
                setBalance(res.data.leaveBalance || {});
            } catch (err) {
                addToast('Failed to fetch leave balance', 'error');
            } finally {
                setBalanceLoading(false);
            }
        };
        fetchBalance();
    }, [addToast]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const getDays = () => {
        if (!formData.startDate || !formData.endDate) return 0;
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return diffDays > 0 ? diffDays : 0;
    };

    const djangoDate = new Date().toISOString().split('T')[0];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const days = getDays();
        if (days <= 0) {
            addToast('End date must be after start date', 'error');
            setLoading(false);
            return;
        }

        if (formData.leaveType && balance[formData.leaveType] < days && formData.leaveType !== 'Unpaid Leave') {
            addToast(`Insufficient balance for ${formData.leaveType}. You have ${balance[formData.leaveType]} days.`, 'error');
            setLoading(false);
            return;
        }

        try {
            await api.post('/leaves', formData);
            addToast('Leave application submitted successfully!', 'success');
            setFormData({ leaveType: '', startDate: '', endDate: '', reason: '' });
        } catch (err) {
            addToast(err.response?.data?.message || 'Failed to submit application', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container max-w-2xl mx-auto">
            <div className="card">
                <h2 className="text-xl font-bold mb-6">New Leave Application</h2>

                {/* Balance Overview Mini */}
                {!balanceLoading && (
                    <div className="d-flex gap-4 mb-6 overflow-x-auto pb-2">
                        {Object.entries(balance).slice(0, 3).map(([key, val]) => (
                            <div key={key} className="bg-slate-50 p-3 rounded border text-center min-w-[100px]">
                                <div className="text-xs text-muted uppercase font-bold">{key.split(' ')[0]}</div>
                                <div className="text-lg font-bold text-primary">{val}</div>
                            </div>
                        ))}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Leave Type</label>
                        <select name="leaveType" className="form-control" value={formData.leaveType} onChange={handleChange} required>
                            <option value="">Select Type</option>
                            {leaveTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type} {balance[type] !== undefined ? `(${balance[type]} days left)` : ''}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="d-flex gap-4">
                        <div className="form-group w-full">
                            <label className="form-label">From Date</label>
                            <input type="date" name="startDate" min={djangoDate} className="form-control" value={formData.startDate} onChange={handleChange} required />
                        </div>
                        <div className="form-group w-full">
                            <label className="form-label">To Date</label>
                            <input type="date" name="endDate" min={formData.startDate || djangoDate} className="form-control" value={formData.endDate} onChange={handleChange} required />
                        </div>
                    </div>

                    {getDays() > 0 && (
                        <div className="mb-4 text-sm text-primary font-medium bg-indigo-50 p-2 rounded">
                            Duration: {getDays()} Day(s)
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">Reason</label>
                        <textarea name="reason" className="form-control" rows="4" placeholder="Please provide a valid reason..." value={formData.reason} onChange={handleChange} required></textarea>
                    </div>

                    <div className="text-right">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit Application'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ApplyLeave;
