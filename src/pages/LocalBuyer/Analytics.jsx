import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, PieChart, Pie, Cell
} from 'recharts';
import { KpiCard } from '../../components/ui/Components';
import { MONTHLY_SPEND, ANALYTICS_DATA, THRESHOLD_CHART_DATA } from '../../data/mockData';

const SPEND_BY_GREEN = [
  { name: 'Gb-04', spend: 98 }, { name: 'Gc-11', spend: 82 },
  { name: 'Ga-17', spend: 74 }, { name: 'Gf-22', spend: 61 },
  { name: 'Ge-31', spend: 55 }, { name: 'Gh-08', spend: 42 },
];

const ALT_DATA = [
  { name: 'Same Green', value: 69, fill: 'var(--color-primary)' },
  { name: 'Approved Alt', value: 31, fill: 'var(--color-rose-accent)' },
];

export default function Analytics() {
  const navigate = useNavigate();
  const d = ANALYTICS_DATA;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1400 }} className="animate-fade-in">
      <div className="breadcrumb">
        <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Overview</span>
        <span className="sep">/</span>
        <span>Analytics</span>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Procurement Analytics</h1>
          <div className="text-sm text-secondary mt-1">Performance evaluation for fulfillment recommendations · Simulated data</div>
        </div>
        <div className="flex gap-2">
          <select className="form-select" style={{ width: 160 }}><option>Oct 2026</option><option>Sep 2026</option></select>
          <select className="form-select" style={{ width: 160 }}><option>Austin Local — Site 04</option></select>
        </div>
      </div>

      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 16 }}>
        <KpiCard title="Total Procurement Spend" value="$412k" subtitle="October 2026 · simulated" />
        <KpiCard title="Avg Cost per kg" value={`$${d.avgCostPerKg}`} subtitle="vs $4.68 baseline" trend="-$0.50" trendPositive={true} />
        <KpiCard title="Est. Savings vs Baseline" value={`$${(d.estimatedSavings/1000).toFixed(1)}k`} subtitle="Simulated · not realized" trend="+$2.1k" trendPositive={true} />
        <KpiCard title="On-Time Fulfillment" value={`${d.onTimeRate}%`} subtitle="Orders arrived ≤ required date" />
        <KpiCard title="Feasible Option Rate" value={`${d.feasibleRate}%`} subtitle="Requests with viable option" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
        <KpiCard title="Avg Lead Time" value={`${d.avgLeadTime}d`} subtitle="Order-to-receipt" />
        <KpiCard title="Via Approved Alternate" value={`${d.altFulfillmentRate}%`} subtitle="Orders fulfilled w/ alt green" />
        <KpiCard title="Below Threshold Greens" value={d.belowThreshold} subtitle="Active alerts" trendPositive={false} />
        <KpiCard title="Stockout Events" value={d.stockoutFrequency} subtitle="Month to date" trendPositive={false} />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Monthly Spend trend */}
        <div className="card">
          <div className="card-header"><div className="card-title">Monthly Spend & Est. Savings Trend</div></div>
          <div className="card-body" style={{ paddingTop: 8 }}>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={MONTHLY_SPEND}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="spend" stroke="var(--color-primary)" strokeWidth={2} dot={false} name="Spend ($k)" />
                <Line type="monotone" dataKey="savings" stroke="var(--color-success)" strokeWidth={2} dot={false} name="Est. Savings ($k)" />
              </LineChart>
            </ResponsiveContainer>
            <div className="sim-note mt-2">Estimated savings vs. cost baseline — simulated, not realized financial benefit</div>
          </div>
        </div>

        {/* Spend by green */}
        <div className="card">
          <div className="card-header"><div className="card-title">Spend by Green (Oct 2026)</div></div>
          <div className="card-body" style={{ paddingTop: 8 }}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={SPEND_BY_GREEN} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} axisLine={false} tickLine={false} width={48} />
                <Tooltip contentStyle={{ fontSize: 12 }} formatter={v => [`$${v}k`, 'Spend']} />
                <Bar dataKey="spend" fill="var(--color-rose-accent)" radius={[0,3,3,0]} maxBarSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alt usage */}
        <div className="card">
          <div className="card-header"><div className="card-title">Fulfillment Mix — Same vs Alternate</div></div>
          <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <div style={{ position: 'relative', width: 130, height: 130 }}>
              <ResponsiveContainer width={130} height={130}>
                <PieChart>
                  <Pie data={ALT_DATA} cx="50%" cy="50%" innerRadius={40} outerRadius={58} dataKey="value" paddingAngle={2}>
                    {ALT_DATA.map((e, i) => <Cell key={i} fill={e.fill} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
                <div className="font-bold" style={{ fontSize: 16 }}>31%</div>
                <div className="text-xs text-secondary">Alt</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {ALT_DATA.map(d => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="legend-dot" style={{ background: d.fill, width: 10, height: 10, borderRadius: '50%', display: 'inline-block' }} />
                  <span className="text-sm">{d.value}% {d.name}</span>
                </div>
              ))}
              <div className="text-xs text-secondary">Alternate greens may offer lower cost when approved</div>
            </div>
          </div>
        </div>

        {/* Stockout / threshold */}
        <div className="card">
          <div className="card-header"><div className="card-title">Inventory Below Threshold (Stock Status)</div></div>
          <div className="card-body" style={{ paddingTop: 8 }}>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={THRESHOLD_CHART_DATA.slice(0,5)}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="id" tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12 }} />
                <Bar dataKey="available" name="Available (kg)" radius={[3,3,0,0]} maxBarSize={36}>
                  {THRESHOLD_CHART_DATA.slice(0,5).map((e, i) => (
                    <Cell key={i} fill={e.status === 'healthy' ? 'var(--color-success)' : e.status === 'low' ? 'var(--color-warning)' : 'var(--color-critical)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="sim-note text-center" style={{ padding: '12px', background: 'var(--color-lavender-bg)', borderRadius: 8 }}>
        All metrics are simulated and for demonstration only. Estimated savings are projected, not realized financial results.
      </div>
    </div>
  );
}

