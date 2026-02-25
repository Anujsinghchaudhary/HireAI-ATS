import { Search, Bell, Menu } from 'lucide-react';
import './Header.css';

export default function Header({ onMenuToggle }) {
    return (
        <header className="app-header">
            <div className="header-left">
                <button className="btn-icon mobile-menu-btn" onClick={onMenuToggle}>
                    <Menu size={20} />
                </button>
                <div className="header-search">
                    <Search size={16} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search jobs, candidates..."
                        className="search-input"
                    />
                </div>
            </div>
            <div className="header-right">
                <button className="header-btn notification-btn">
                    <Bell size={18} />
                    <span className="notification-dot"></span>
                </button>
                <div className="header-divider" />
                <div className="header-profile">
                    <div className="header-avatar">R</div>
                    <span className="header-user-name">Recruiter</span>
                </div>
            </div>
        </header>
    );
}
