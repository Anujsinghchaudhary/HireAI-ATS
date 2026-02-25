import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Briefcase,
    Users,
    FileSearch,
    Settings,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    LogOut
} from 'lucide-react';
import './Sidebar.css';

const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/jobs', icon: Briefcase, label: 'Jobs' },
    { path: '/candidates', icon: Users, label: 'Candidates' },
    { path: '/resume-analysis', icon: FileSearch, label: 'Resume Analysis' },
    { path: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar({ collapsed, onToggle }) {
    const location = useLocation();

    return (
        <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
            <div className="sidebar-header">
                <div className="sidebar-brand">
                    <div className="brand-icon">
                        <Sparkles size={22} />
                    </div>
                    {!collapsed && (
                        <div className="brand-text">
                            <span className="brand-name">HireAI</span>
                            <span className="brand-tag">Enterprise ATS</span>
                        </div>
                    )}
                </div>
                <button className="sidebar-toggle" onClick={onToggle} aria-label="Toggle sidebar">
                    {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
            </div>

            <nav className="sidebar-nav">
                {navItems.map(({ path, icon: Icon, label }) => (
                    <NavLink
                        key={path}
                        to={path}
                        className={({ isActive }) =>
                            `nav-item ${isActive ? 'nav-item-active' : ''}`
                        }
                        title={collapsed ? label : undefined}
                    >
                        <div className="nav-icon">
                            <Icon size={20} />
                        </div>
                        {!collapsed && <span className="nav-label">{label}</span>}
                        {!collapsed && location.pathname === path && (
                            <div className="nav-indicator" />
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                {!collapsed && (
                    <div className="sidebar-user">
                        <div className="user-avatar">AI</div>
                        <div className="user-info">
                            <span className="user-name">Recruiter</span>
                            <span className="user-role">Admin</span>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
}
