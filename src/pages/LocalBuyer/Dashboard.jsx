import { useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Package, DollarSign, AlertTriangle,
  Truck, TrendingUp, Download, PlusCircle, ChevronRight, Zap, Leaf
} from 'lucide-react';
import {
  BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend, PieChart, Pie
} from 'recharts';
import { KpiCard, StatusBadge, SectionHeader } from '../../components/ui/Components';
import {
  THRESHOLD_CHART_DATA, MONTHLY_SPEND, ORDERS, ALERTS, FULFILLMENT_OPTIONS, GREENS
} from '../../data/mockData';

// ── Custom Tooltip ────────────────────────────────────────────────────────────
function SpendTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-title">{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ color: p.color, marginTop: 2 }}>
          {p.name}: <strong>${p.value}k</strong>
        </div>
      ))}
    </div>
  );
}

// ── Health Donut ──────────────────────────────────────────────────────────────
const HEALTH_DATA = [
  { name: 'Healthy', value: 14, fill: 'var(--color-success)' },
  { name: 'Low',     value: 4,  fill: 'var(--color-warning)' },
  { name: 'Critical',value: 6,  fill: 'var(--color-critical)' },
];
function HealthDonut() {
  return (
    <div className="health-donut-wrap">
      <ResponsiveContainer width={168} height={168}>
        <PieChart>
          <Pie data={HEALTH_DATA} cx="50%" cy="50%" innerRadius={54} outerRadius={76}
            dataKey="value" paddingAngle={3} startAngle={90} endAngle={-270}>
            {HEALTH_DATA.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="health-donut-center">
        <span className="health-pct">58%</span>
        <span className="health-label">Healthy</span>
      </div>
    </div>
  );
}

// ── Alert Item ────────────────────────────────────────────────────────────────
function AlertItem({ alert }) {
  const navigate = useNavigate();
  const sevBg = {
    critical: 'var(--color-critical-bg)',
    warning: 'var(--color-warning-bg)',
    info: 'var(--color-info-bg)',
  };
  return (
    <div className="alert-item">
      <div className={`live-dot ${alert.severity}`} style={{ marginTop: 5 }} />
      <div className="alert-body">
        <div className="alert-message">{alert.message}</div>
        <div className="alert-meta">
          {new Date(alert.timestamp).toLocaleTimeString('en-US',
            { hour: '2-digit', minute: '2-digit' })} &bull; {alert.greenId || alert.type}
        </div>
        <button className="alert-action-link" onClick={() => navigate(alert.actionLink || '/alerts')}>
          {alert.action || 'View'} &rarr;
        </button>
      </div>
      <span className={`badge badge-${alert.severity === 'info' ? 'info' : alert.severity === 'warning' ? 'warning' : 'critical'}`}>
        {alert.severity}
      </span>
    </div>
  );
}

// ── Order Row ────────────────────────────────────────────────────────────────
function OrderRow({ order }) {
  const navigate = useNavigate();
  return (
    <tr onClick={() => navigate('/orders')} style={{ cursor: 'pointer' }}>
      <td><span className="order-id">{order.id}</span></td>
      <td>
        <div className="font-medium">{order.greenId}</div>
        {order.isAlternate && (
          <div className="text-xs text-secondary" style={{ marginTop: 1 }}>
            &rarr; {order.selectedGreenId} (alt)
          </div>
        )}
      </td>
      <td className="font-medium">{(order.qty || 0).toLocaleString()} kg</td>
      <td className="text-secondary">{order.source || '—'}</td>
      <td className="font-semibold">{order.total ? '$' + order.total.toLocaleString() : '—'}</td>
      <td className="text-secondary">{order.expectedDate || '—'}</td>
      <td><StatusBadge status={order.status} /></td>
    </tr>
  );
}

// ── Top Rec Card ──────────────────────────────────────────────────────────────
function TopRecCard({ opt, index }) {
  const navigate = useNavigate();
  return (
    <div
      className="top-rec-card"
      onClick={() => navigate('/recommendations')}
      style={{ cursor: 'pointer', animationDelay: `${index * 80}ms` }}
    >
      <div className="top-rec-header">
        <div className="top-rec-product">
          <span className="top-rec-id">{opt.greenId}</span>
          <span className="top-rec-name text-sm">{opt.greenName}</span>
        </div>
        {index === 0 && <span className="top-rec-best">Best value</span>}
      </div>
      <div className="top-rec-meta">
        <Truck size={11} style={{ marginRight: 4 }} />
        <span>{opt.source}</span>
        {opt.savingsVsBaseline > 0 && <span className="top-rec-saving">Save ${opt.savingsVsBaseline.toLocaleString()}</span>}
      </div>
      <strong className="top-rec-price">{opt.totalDelivered ? '$' + opt.totalDelivered.toLocaleString() : '—'}</strong>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();

  const kpis = [
    {
      title: 'Open Orders',
      value: '12',
      subtitle: '3 awaiting decision',
      trend: '+2 from last week',
      trendPositive: false,
      icon: ShoppingCart,
      colorVariant: 'rose',
      tooltip: 'Orders placed but not yet received',
    },
    {
      title: 'Available Inventory',
      value: '428.6',
      unit: 'MT',
      subtitle: 'Across 12 active greens',
      trend: '+18.2 MT this week',
      trendPositive: true,
      icon: Package,
      colorVariant: 'sage',
      tooltip: 'On-hand minus reservations & commitments',
    },
    {
      title: 'Inventory Value',
      value: '$2.14M',
      subtitle: 'At current landed cost',
      trend: '-$12k from last period',
      trendPositive: false,
      icon: DollarSign,
      colorVariant: 'blue',
      tooltip: 'Total value of available inventory',
    },
    {
      title: 'Below Threshold',
      value: '6',
      subtitle: '2 critical, 4 low',
      trend: '+1 from yesterday',
      trendPositive: false,
      icon: AlertTriangle,
      colorVariant: 'rose',
      tooltip: 'Greens at or below minimum stock threshold',
    },
    {
      title: 'Incoming Inventory',
      value: '3',
      subtitle: '84.5 MT in transit',
      trend: 'Expected within 7 days',
      trendPositive: true,
      icon: Truck,
      colorVariant: 'sage',
      tooltip: 'Transfers dispatched and en route',
    },
    {
      title: 'Est. Savings Available',
      value: '$18.4k',
      subtitle: 'Via smart recommendations',
      trend: '+$3.2k opportunity',
      trendPositive: true,
      icon: TrendingUp,
      colorVariant: 'blue',
      tooltip: 'Estimated savings from optimal fulfillment',
    },
  ];

  return (
    <div className="dashboard">
      {/* ── Page Header ── */}
      <div className="dash-header">
        <div className="dash-greeting">
          <h1 className="page-title">Good morning, Maya — inventory needs 3 decisions today</h1>
          <p className="dash-sub">
            Austin Local — Site 04 &bull; Thu Oct 29 &bull;&nbsp;
            <span className="warn-text">6 greens below threshold</span>
            &nbsp;&bull; <span style={{ color: 'rgba(255,255,255,0.6)' }}>$14.3k est. savings available &bull; $18.4k simulated savings Oct</span>
          </p>
        </div>
        <div className="dash-header-actions">
          <button className="btn btn-secondary btn-sm">
            <Download size={13} /> Export
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/create-order')}>
            <PlusCircle size={15} /> Create Order
          </button>
        </div>
      </div>

      {/* ── KPI Grid ── */}
      <div className="kpi-grid">
        {kpis.map((kpi, i) => (
          <KpiCard key={i} {...kpi} />
        ))}
      </div>

      {/* ── Inventory charts ── */}
      <div className="dashboard-chart-grid">
        <div className="card popular-chart-card">
          <div className="card-header">
            <div>
              <div className="card-title">
                <Leaf size={15} style={{ color: 'var(--color-success)' }} />
                Popular Greens
              </div>
              <div className="text-xs text-secondary">Available stock vs. minimum threshold · Top 5</div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/inventory')}>View Inventory</button>
          </div>
          <div className="card-body popular-chart-body">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={THRESHOLD_CHART_DATA.slice(0, 5)} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                <XAxis dataKey="id" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={42} />
                <Tooltip
                  labelFormatter={id => THRESHOLD_CHART_DATA.find(item => item.id === id)?.name || id}
                  formatter={value => [`${Number(value).toLocaleString()} kg`]}
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                <Bar dataKey="available" name="Available" radius={[4, 4, 0, 0]}>
                  {THRESHOLD_CHART_DATA.slice(0, 5).map(item => (
                    <Cell key={item.id} fill={item.available >= item.threshold ? 'var(--color-success)' : 'var(--color-critical)'} />
                  ))}
                </Bar>
                <Bar dataKey="threshold" name="Minimum" fill="var(--color-border-mid)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="threshold-note">Available stock and each green's minimum, in kg.</p>
          </div>
        </div>

        <div className="card health-chart-card">
          <div className="card-header">
            <div>
              <div className="card-title">
                <Package size={14} style={{ color: 'var(--color-sage-deep)' }} />
                Inventory Health
              </div>
              <div className="text-xs text-secondary">24 active greens · Austin Local</div>
            </div>
          </div>
          <div className="card-body health-chart-body">
            <div className="health-legend health-legend-inline">
              {HEALTH_DATA.map(entry => (
                <div key={entry.name} className="health-legend-row">
                  <span className="legend-dot" style={{ background: entry.fill }} />
                  <span><strong>{entry.value}</strong> {entry.name}</span>
                </div>
              ))}
            </div>
            <HealthDonut />
            <div className="health-summary-line" aria-label="Inventory health distribution">
              {HEALTH_DATA.map(entry => (
                <span key={entry.name} style={{ width: `${(entry.value / 24) * 100}%`, background: entry.fill }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Spend and fulfillment charts ── */}
      <div className="dashboard-secondary-grid">
        {/* Spend chart */}
        <div className="card spend-chart-card">
          <div className="card-header">
            <div>
              <div className="card-title">
                <DollarSign size={14} style={{ color: 'var(--color-blue-accent)' }} />
                Monthly Procurement Spend &amp; Savings
              </div>
              <div className="text-xs text-secondary">All sites · 5 mo. simulated</div>
            </div>
            <div className="text-xs text-secondary">Jan–Oct 2024 · Simulated</div>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={MONTHLY_SPEND} barGap={2} barSize={16}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}k`} />
                <Tooltip content={<SpendTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="spend" name="Spend" fill="var(--color-blue-accent)" radius={[3, 3, 0, 0]} />
                <Bar dataKey="savings" name="Est. savings" fill="var(--color-sage-deep)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="spend-savings-note">
              Oct est. savings $14.2k — 19.5% vs based on item label, not realized
            </div>
          </div>
        </div>

        {/* Fulfillment performance */}
        <div className="card perf-chart-card">
          <div className="card-header">
            <div>
              <div className="card-title">
                <TrendingUp size={14} style={{ color: 'var(--color-rose-accent)' }} />
                Fulfillment Performance
              </div>
              <div className="text-xs text-secondary">Last 90 days · Simulated</div>
            </div>
          </div>
          <div className="card-body">
            {[
              { label: 'On-time fulfillment', val: 92, pct: 92, color: 'var(--color-success)' },
              { label: 'Feasible option found', val: 88, pct: 88, color: 'var(--color-info)' },
              { label: 'Via approved alternate', val: 31, pct: 31, color: 'var(--color-warning)' },
            ].map((stat, i) => (
              <div key={i} style={{ marginBottom: i < 2 ? 16 : 0 }}>
                <div className="perf-stat">
                  <span className="text-sm text-secondary">{stat.label}</span>
                  <span className="perf-val font-bold" style={{ color: stat.color, fontSize: 18 }}>{stat.val}%</span>
                </div>
                <div className="perf-bar-wrap">
                  <div className="perf-bar" style={{ width: `${stat.pct}%`, background: stat.color }} />
                </div>
              </div>
            ))}
            <div className="flex gap-6 mt-4" style={{ borderTop: '1px solid var(--color-border)', paddingTop: 12 }}>
              <div>
                <div className="text-xs text-secondary">Avg lead time</div>
                <div className="font-bold" style={{ fontSize: 20, color: 'var(--color-text-primary)' }}>4.6d</div>
              </div>
              <div>
                <div className="text-xs text-secondary">Avg $/kg</div>
                <div className="font-bold" style={{ fontSize: 20, color: 'var(--color-text-primary)' }}>$4.51</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Orders, recommendations, and alerts ── */}
      <div className="dashboard-bottom-grid">
        {/* Recent Orders */}
        <div className="card recent-orders-card dashboard-orders-panel">
          <div className="card-header">
            <div className="card-title">
              <ShoppingCart size={14} style={{ color: 'var(--color-primary)' }} />
              Recent Orders
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/orders')}
              style={{ color: 'var(--color-rose-accent)', fontWeight: 600 }}>
              View all <ChevronRight size={13} />
            </button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ORDER</th>
                  <th>REQUESTED / SELECTED</th>
                  <th>QTY</th>
                  <th>SOURCE</th>
                  <th>TOTAL</th>
                  <th>ETA</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {ORDERS.slice(0, 5).map(o => <OrderRow key={o.id} order={o} />)}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommendations */}
      <div className="card top-rec-card-container dashboard-recommendations-panel">
        <div className="card-header top-rec-panel-header">
          <div>
            <div className="card-title">
              <Zap size={15} />
              Top Fulfillment Recommendations
            </div>
            <div className="text-xs text-secondary top-rec-panel-subtitle" style={{ marginTop: 2 }}>
              Lowest total delivered cost &bull; Feasible options only
            </div>
          </div>
        </div>
        <div className="card-body top-rec-panel-body">
          <div className="top-rec-grid">
            {FULFILLMENT_OPTIONS.filter(o => o.feasible).slice(0, 2).map((opt, i) => (
              <TopRecCard key={i} opt={opt} index={i} />
            ))}
          </div>
          <button className="btn btn-primary w-full top-rec-cta" onClick={() => navigate('/recommendations')}>
            <PlusCircle size={15} /> Compare All Options
          </button>
        </div>
      </div>

        {/* Alerts */}
        <div className="card alerts-card dashboard-alerts-panel">
          <div className="card-header dashboard-alert-header" style={{ background: 'var(--color-critical-bg)', borderBottom: '1px solid rgba(229,57,85,0.15)' }}>
            <div className="dashboard-alert-heading">
              <div className="card-title" style={{ color: 'var(--color-critical)' }}>
                <AlertTriangle size={14} />
                Alerts Requiring Attention
              </div>
              <span className="badge badge-critical">{ALERTS.filter(a => a.severity === 'critical').length} Critical</span>
            </div>
            <button className="btn btn-ghost btn-sm dashboard-alert-action" onClick={() => navigate('/alerts')}>
              View Alerts <ChevronRight size={13} />
            </button>
          </div>
          <div className="dashboard-alert-list">
            {ALERTS.slice(0, 4).map(a => <AlertItem key={a.id} alert={a} />)}
          </div>
        </div>
      </div>
    </div>
  );
}