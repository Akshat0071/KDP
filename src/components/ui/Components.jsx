import { Info, TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';

const STATUS_CONFIG = {
  healthy:   { label: 'Healthy',          className: 'badge-success' },
  low:       { label: 'Low Stock',        className: 'badge-warning' },
  critical:  { label: 'Critical',         className: 'badge-critical' },
  incoming:  { label: 'Incoming',         className: 'badge-info' },
  excluded:  { label: 'Excluded',         className: 'badge-critical' },
  feasible:  { label: 'Feasible',         className: 'badge-success' },
  recommended: { label: 'Recommended',   className: 'badge-recommended' },
  'in-transit': { label: 'In Transit',   className: 'badge-info' },
  received:  { label: 'Received',        className: 'badge-success' },
  planned:   { label: 'Planned',         className: 'badge-neutral' },
  delayed:   { label: 'Delayed',         className: 'badge-critical' },
  confirmed: { label: 'Confirmed',       className: 'badge-success' },
  cancelled: { label: 'Cancelled',       className: 'badge-neutral' },
  'awaiting-dispatch': { label: 'Awaiting Dispatch', className: 'badge-warning' },
  draft:     { label: 'Draft',           className: 'badge-neutral' },
  pending:   { label: 'Pending',         className: 'badge-warning' },
  approved:  { label: 'Approved',        className: 'badge-success' },
};

export function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status?.toLowerCase()] || { label: status, className: 'badge-neutral' };
  return <span className={`badge ${cfg.className}`}>{cfg.label}</span>;
}

/**
 * KpiCard with named color variants:
 * colorVariant: 'rose' | 'sage' | 'blue' | 'peach' | 'lavender' | 'amber'
 */
export function KpiCard({ title, value, unit, subtitle, trend, trendPositive, tooltip, icon: Icon, iconBg, colorVariant }) {
  const iconBgMap = {
    rose:     'var(--kpi-rose-icon-bg)',
    sage:     'var(--kpi-sage-icon-bg)',
    blue:     'var(--kpi-blue-icon-bg)',
    peach:    'var(--kpi-peach-icon-bg)',
    lavender: 'var(--kpi-lavender-icon-bg)',
    amber:    'var(--kpi-amber-icon-bg)',
  };
  const resolvedIconBg = iconBg || (colorVariant && iconBgMap[colorVariant]) || 'var(--color-lavender-bg)';
  const cardClass = ['card', 'kpi-card', colorVariant ? `kpi-${colorVariant}` : ''].filter(Boolean).join(' ');

  return (
    <div className={cardClass}>
      <div className="kpi-card-header">
        <span className="kpi-title">{title}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {tooltip && (
            <div className="tooltip-wrap">
              <Info size={12} style={{ color: 'var(--color-text-secondary)', cursor: 'help' }} />
              <span className="tooltip">{tooltip}</span>
            </div>
          )}
          {Icon && (
            <div className="kpi-icon" style={{ background: resolvedIconBg }}>
              <Icon size={14} color="#fff" />
            </div>
          )}
        </div>
      </div>
      <div className="kpi-value">
        {value}
        {unit && <span className="kpi-unit">{unit}</span>}
      </div>
      {subtitle && <div className="kpi-subtitle">{subtitle}</div>}
      {trend !== undefined && (
        <div className={`kpi-trend ${trendPositive ? 'kpi-trend-pos' : 'kpi-trend-neg'}`}>
          {trendPositive
            ? <TrendingUp size={10} />
            : <TrendingDown size={10} />}
          {' '}{trend}
        </div>
      )}
    </div>
  );
}

export function FilterBar({ filters, active, onChange }) {
  return (
    <div className="filter-bar">
      {filters.map(f => (
        <button
          key={f.value}
          className={`filter-btn${active === f.value ? ' active' : ''}`}
          onClick={() => onChange(f.value)}
        >
          {f.label}
          {f.count !== undefined && <span className="filter-count">{f.count}</span>}
        </button>
      ))}
    </div>
  );
}

export function SectionHeader({ title, action, actionLabel, subtitle }) {
  return (
    <div className="section-header-row">
      <div>
        <div className="section-title">{title}</div>
        {subtitle && <div className="text-sm text-secondary mt-1">{subtitle}</div>}
      </div>
      {action && (
        <button className="btn btn-ghost btn-sm" onClick={action}
          style={{ color: 'var(--color-rose-accent)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 2 }}>
          {actionLabel || 'View all'} <ChevronRight size={12} />
        </button>
      )}
    </div>
  );
}