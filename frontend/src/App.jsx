import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ApplyLeave from './pages/ApplyLeave';
import LeaveHistory from './pages/LeaveHistory';
import AdminLeaves from './pages/AdminLeaves';
import ManageUsers from './pages/ManageUsers';
import AdminPolicies from './pages/AdminPolicies';
import Profile from './pages/Profile';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />

              {/* Employee Routes */}
              <Route path="apply-leave" element={<ProtectedRoute roles={['employee']}><ApplyLeave /></ProtectedRoute>} />
              <Route path="my-leaves" element={<ProtectedRoute roles={['employee']}><LeaveHistory /></ProtectedRoute>} />

              {/* Admin Routes */}
              <Route path="admin/leaves" element={<ProtectedRoute roles={['admin']}><AdminLeaves /></ProtectedRoute>} />
              <Route path="admin/users" element={<ProtectedRoute roles={['admin']}><ManageUsers /></ProtectedRoute>} />
              <Route path="admin/policies" element={<ProtectedRoute roles={['admin']}><AdminPolicies /></ProtectedRoute>} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
