import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { HiHome, HiUser, HiDocumentAdd, HiClipboardList, HiUsers, HiColorSwatch, HiLogout, HiMenu } from 'react-icons/hi';

const Layout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const isActive = (path) => location.pathname === path ? 'active bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50';

    return (
        <div className="d-flex" style={{ minHeight: '100vh', background: 'var(--background)' }}>
            {/* Mobile Toggle */}
            <button
                className="btn btn-secondary md:hidden"
                style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 100, display: window.innerWidth < 768 ? 'flex' : 'none' }}
                onClick={() => setSidebarOpen(!sidebarOpen)}
            >
                <HiMenu className="w-6 h-6" />
            </button>

            {/* Sidebar */}
            <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">L</div>
                        <div>
                            <h2 style={{ color: 'var(--text)', fontWeight: 'bold', fontSize: '1.25rem' }}>LeaveFlow</h2>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>HR System</p>
                        </div>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <div className="px-4 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Menu
                    </div>
                    <Link to="/" className={`nav-link ${isActive('/')}`}>
                        <HiHome className="mr-3 text-lg" /> Dashboard
                    </Link>
                    <Link to="/profile" className={`nav-link ${isActive('/profile')}`}>
                        <HiUser className="mr-3 text-lg" /> My Profile
                    </Link>

                    {user.role === 'employee' && (
                        <>
                            <div className="px-4 mt-6 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Leaves
                            </div>
                            <Link to="/apply-leave" className={`nav-link ${isActive('/apply-leave')}`}>
                                <HiDocumentAdd className="mr-3 text-lg" /> Apply for Leave
                            </Link>
                            <Link to="/my-leaves" className={`nav-link ${isActive('/my-leaves')}`}>
                                <HiClipboardList className="mr-3 text-lg" /> My History
                            </Link>
                        </>
                    )}

                    {user.role === 'admin' && (
                        <>
                            <div className="px-4 mt-6 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Administration
                            </div>
                            <Link to="/admin/leaves" className={`nav-link ${isActive('/admin/leaves')}`}>
                                <HiClipboardList className="mr-3 text-lg" /> Leave Requests
                            </Link>
                            <Link to="/admin/users" className={`nav-link ${isActive('/admin/users')}`}>
                                <HiUsers className="mr-3 text-lg" /> Employees
                            </Link>
                            <Link to="/admin/policies" className={`nav-link ${isActive('/admin/policies')}`}>
                                <HiColorSwatch className="mr-3 text-lg" /> Policies
                            </Link>
                        </>
                    )}
                </nav>

                <div className="sidebar-footer border-t border-slate-200 p-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg border border-indigo-200">
                            {user.name.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <div className="font-semibold text-sm truncate">{user.name}</div>
                            <div className="text-xs text-slate-500 truncate capitalize">{user.role}</div>
                        </div>
                    </div>
                    <button onClick={logout} className="btn btn-secondary w-full flex items-center justify-center gap-2 text-sm">
                        <HiLogout className="text-lg" /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content w-full transition-all duration-300">
                <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">
                            {location.pathname === '/' ? 'Overview' :
                                location.pathname.includes('apply') ? 'New Request' :
                                    location.pathname.includes('history') ? 'My History' :
                                        location.pathname.includes('profile') ? 'My Profile' :
                                            location.pathname.includes('admin/leaves') ? 'Leave Management' :
                                                location.pathname.includes('admin/users') ? 'Directory' :
                                                    location.pathname.includes('admin/policies') ? 'Policy Settings' : 'Dashboard'}
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">Manage your leave and schedule efficiently.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="hidden md:inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-100">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                            System Online
                        </span>
                        <div className="text-right text-sm text-slate-500">
                            {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    </div>
                </header>

                <div className="animate-fade-in space-y-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
