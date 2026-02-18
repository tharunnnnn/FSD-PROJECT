/* eslint-disable no-unused-vars */

// MOCK API IMPLEMENTATION (Replaces Axios/Backend)
// uses localStorage to simulate a database

const USERS_KEY = 'mock_users';
const LEAVES_KEY = 'mock_leaves';
const POLICIES_KEY = 'mock_policies';

// --- DATA ACCESS HELPERS ---
const getUsers = () => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
};

const setUsers = (users) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const getLeaves = () => {
    const data = localStorage.getItem(LEAVES_KEY);
    return data ? JSON.parse(data) : [];
};

const setLeaves = (leaves) => {
    localStorage.setItem(LEAVES_KEY, JSON.stringify(leaves));
};

const getPolicies = () => {
    const data = localStorage.getItem(POLICIES_KEY);
    return data ? JSON.parse(data) : [];
};

const setPolicies = (policies) => {
    localStorage.setItem(POLICIES_KEY, JSON.stringify(policies));
};

// --- INITIAL DATA SEEDING ---
const seedData = () => {
    const users = getUsers();
    if (users.length === 0) {
        const initialUsers = [
            {
                _id: '1',
                name: 'Admin User',
                email: 'admin@example.com',
                password: 'password123',
                role: 'admin',
                department: 'HR',
                position: 'Manager',
                createdAt: new Date().toISOString(),
                leaveBalance: { 'Sick Leave': 10, 'Casual Leave': 5, 'Annual Leave': 15, 'Maternity Leave': 90, 'Paternity Leave': 10, 'Unpaid Leave': 0 }
            },
            {
                _id: '2',
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
                role: 'employee',
                department: 'Engineering',
                position: 'Developer',
                createdAt: new Date().toISOString(),
                leaveBalance: { 'Sick Leave': 10, 'Casual Leave': 5, 'Annual Leave': 15, 'Maternity Leave': 90, 'Paternity Leave': 10, 'Unpaid Leave': 0 }
            }
        ];
        setUsers(initialUsers);
        console.log('Seeded mock users');
    }

    const leaves = getLeaves();
    if (leaves.length === 0) {
        const initialLeaves = [
            {
                _id: '101',
                user: { _id: '2', name: 'John Doe', email: 'john@example.com', position: 'Developer' },
                leaveType: 'Sick Leave',
                startDate: new Date().toISOString(),
                endDate: new Date(Date.now() + 86400000).toISOString(),
                reason: 'Not feeling well',
                status: 'Pending',
                createdAt: new Date().toISOString()
            }
        ];
        setLeaves(initialLeaves);
        console.log('Seeded mock leaves');
    }

    const policies = getPolicies();
    if (policies.length === 0) {
        const initialPolicies = [
            { _id: '1', policyName: 'Sick Leave', maxDays: 10, description: 'For medical issues' },
            { _id: '2', policyName: 'Casual Leave', maxDays: 15, description: 'Personal time off' },
        ];
        setPolicies(initialPolicies);
        console.log('Seeded mock policies');
    }
};

// Initialize only if running in browser/client
if (typeof window !== 'undefined') {
    seedData();
}

// --- MOCK API ---
const mockDelay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

const api = {
    get: async (url) => {
        await mockDelay();
        const users = getUsers();
        const leaves = getLeaves();
        const policies = getPolicies();
        const token = localStorage.getItem('token');

        if (url === '/auth/profile') {
            if (!token) throw { response: { status: 401, data: { message: 'Unauthorized' } } };
            const user = users.find(u => u._id === token);
            if (!user) throw { response: { status: 404, data: { message: 'User not found' } } };
            return { data: { ...user, createdAt: user.createdAt || new Date().toISOString() } };
        }

        if (url === '/leaves/admin-stats') {
            // Admin check based on token implementation
            const pending = leaves.filter(l => l.status === 'Pending').length;

            // Check if approved today
            const today = new Date().toDateString();
            const approvedToday = leaves.filter(l =>
                l.status === 'Approved' &&
                new Date(l.startDate).toDateString() === today // Simplification: using start date as approval date proxy or just counting active leaves
            ).length;

            return {
                data: {
                    totalEmployees: users.filter(u => u.role === 'employee').length,
                    pendingRequests: pending,
                    approvedToday: approvedToday, // This might be loose in mock
                    recentLeaves: leaves.slice(0, 5)
                }
            };
        }

        if (url === '/leaves/my-leaves') {
            const userLeaves = leaves.filter(l => l.user._id === token);
            return { data: userLeaves };
        }

        if (url === '/leaves/all-leaves') {
            return { data: leaves };
        }

        if (url === '/users') {
            const safeUsers = users.map(u => ({
                ...u,
                createdAt: u.createdAt || new Date().toISOString(),
                department: u.department || 'General'
            }));
            return { data: safeUsers };
        }

        if (url === '/policies') {
            return { data: policies };
        }

        return { data: {} };
    },

    post: async (url, data) => {
        await mockDelay();
        const users = getUsers();
        let leaves = getLeaves();
        let policies = getPolicies();

        if (url === '/auth/login') {
            const user = users.find(u => u.email === data.email && u.password === data.password);
            if (user) {
                return { data: { token: user._id, ...user } }; // Token is just ID
            }
            throw { response: { status: 401, data: { message: 'Invalid credentials' } } };
        }

        if (url === '/auth/register') {
            if (users.find(u => u.email === data.email)) {
                throw { response: { status: 400, data: { message: 'User already exists' } } };
            }
            const newUser = {
                _id: Date.now().toString(),
                name: data.name,
                email: data.email,
                password: data.password,
                role: data.role || 'employee',
                position: 'New Hire',
                leaveBalance: { 'Sick Leave': 10, 'Casual Leave': 5, 'Annual Leave': 15, 'Maternity Leave': 90, 'Paternity Leave': 10, 'Unpaid Leave': 0 }
            };
            users.push(newUser);
            setUsers(users);
            return { data: { token: newUser._id, ...newUser } };
        }

        if (url === '/leaves') {
            const token = localStorage.getItem('token');
            const user = users.find(u => u._id === token);
            if (!user) throw { response: { status: 401 } };

            const newLeave = {
                _id: Date.now().toString(),
                user: { _id: user._id, name: user.name, email: user.email, position: user.position },
                leaveType: data.leaveType,
                startDate: data.startDate,
                endDate: data.endDate,
                reason: data.reason,
                status: 'Pending'
            };
            leaves.unshift(newLeave);
            setLeaves(leaves);
            return { data: newLeave };
        }

        if (url === '/policies') {
            const newPolicy = {
                _id: Date.now().toString(),
                policyName: data.policyName,
                maxDays: data.maxDays,
                description: data.description
            };
            policies.push(newPolicy);
            setPolicies(policies);
            return { data: newPolicy };
        }

        return { data: {} };
    },

    put: async (url, data) => {
        await mockDelay();
        let leaves = getLeaves();
        let users = getUsers();

        // Regex for /leaves/:id/status
        const statusMatch = url.match(/\/leaves\/([^\/]+)\/status/);
        if (statusMatch) {
            const leaveId = statusMatch[1];
            const leaveIndex = leaves.findIndex(l => l._id === leaveId);

            if (leaveIndex > -1) {
                const leave = leaves[leaveIndex];
                const oldStatus = leave.status;
                const newStatus = data.status;

                // Handle Balance Deduction if Approving
                if (newStatus === 'Approved' && oldStatus !== 'Approved') {
                    const userIndex = users.findIndex(u => u._id === leave.user._id);
                    if (userIndex > -1) {
                        const user = users[userIndex];
                        const start = new Date(leave.startDate);
                        const end = new Date(leave.endDate);
                        const diffTime = Math.abs(end - start);
                        const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

                        // Basic balance check and deduction
                        if (user.leaveBalance && user.leaveBalance[leave.leaveType] !== undefined) {
                            user.leaveBalance[leave.leaveType] -= days;
                            setUsers(users);
                        }
                    }
                }

                leaves[leaveIndex].status = newStatus;
                setLeaves(leaves);
                return { data: leaves[leaveIndex] };
            }
        }
        return { data: {} };
    },

    delete: async (url) => {
        await mockDelay();
        let leaves = getLeaves();
        let policies = getPolicies();

        // Delete Policy
        if (url.startsWith('/policies/')) {
            const id = url.split('/').pop();
            const newPolicies = policies.filter(p => p._id !== id);
            setPolicies(newPolicies);
            return { data: { message: 'Deleted' } };
        }

        // Delete/Cancel Leave
        if (url.startsWith('/leaves/')) {
            const id = url.split('/').pop();
            const newLeaves = leaves.filter(l => l._id !== id);
            setLeaves(newLeaves);
            return { data: { message: 'Deleted' } };
        }

        return { data: {} };
    }
};

export default api;
