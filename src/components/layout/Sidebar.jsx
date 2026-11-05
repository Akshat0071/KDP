import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, PlusCircle, Star, ShoppingCart,
  Truck, BookOpen, Bell, BarChart2, ChevronDown, Warehouse
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Overview', icon: LayoutDashboard },
  { to: '/inventory', label: 'Local Inventory', icon: Package },
  { to: '/create-order', label: 'Create Order', icon: PlusCircle },
  { to: '/recommendations', label: 'Recommendations', icon: Star },
  { to: '/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/transfers', label: 'Transfers & Incoming', icon: Truck },
  { to: '/catalogue', label: 'Green Catalogue', icon: BookOpen },
  { to: '/alerts', label: 'Alerts & Activity', icon: Bell, badge: 4 },
  { to: '/analytics', label: 'Analytics', icon: BarChart2 },
];

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">K</div>
        <div className="sidebar-logo-text">
          <div className="sidebar-logo-name">KDP GreenSource</div>
          <div className="sidebar-logo-sub">Enterprise Inventory</div>
        </div>
      </div>

      {/* Workspace selector */}
      <div className="workspace-selector">
        <div className="workspace-label">Workspace</div>
        <div className="workspace-name">
          Local Buyer
          <ChevronDown size={14} style={{ opacity: 0.6 }} />
        </div>
      </div>

      {/* Navigation */}
      <nav className="nav-section">
        {NAV_ITEMS.map(({ to, label, icon: Icon, badge }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            title={label}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <Icon size={16} />
            {label}
            {badge && <span className="nav-badge">{badge}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Central Workspace future scope */}
      <div className="sidebar-footer">
        <div className="central-workspace-card">
          <div className="central-workspace-label">Central Workspace</div>
          <div className="central-workspace-desc">
            Future scope — 3 warehouses conceptual preview
          </div>
          <button
            className="btn-view-concept"
            onClick={() => navigate('/central-warehouse')}
          >
            View Concept
          </button>
        </div>
        <div className="sim-note-sidebar">Sample data · Simulation</div>
      </div>
    </aside>
  );
}

