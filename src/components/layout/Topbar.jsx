import { Search, Calendar, Bell, MapPin, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Topbar() {
  const navigate = useNavigate();

  return (
    <header className="topbar">
      {/* Site Selector */}
      <div className="site-selector">
        <MapPin size={14} className="site-selector-pin" />
        Austin Local — Site 04
        <ChevronDown size={14} style={{ opacity: 0.5 }} />
      </div>

      {/* Search */}
      <div className="topbar-search">
        <Search size={14} className="topbar-search-icon" />
        <input placeholder="Search greens, lots, orders, transfers…" />
        <span className="topbar-search-kbd">⌘K</span>
      </div>

      <div className="topbar-spacer" />

      {/* Date range */}
      <div className="topbar-date">
        <Calendar size={14} style={{ color: 'var(--color-rose-accent)' }} />
        Oct 1 – Oct 29, 2026
        <ChevronDown size={12} style={{ opacity: 0.5 }} />
      </div>

      {/* Actions */}
      <div className="topbar-actions">
        <button
          className="topbar-icon-btn"
          onClick={() => navigate('/alerts')}
          title="Alerts"
        >
          <Bell size={16} />
          <span className="topbar-notif-dot" />
        </button>
      </div>

      {/* User */}
      <div className="topbar-user">
        <div className="topbar-avatar">MT</div>
        <div className="topbar-user-info">
          <span className="topbar-user-name">Maya Torres</span>
          <span className="topbar-user-role">Local Buyer</span>
        </div>
      </div>
    </header>
  );
}

