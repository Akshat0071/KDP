import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { ORDERS, GREENS, TRANSFERS } from '../../data/mockData';
import { StatusBadge, KpiCard } from '../../components/ui/Components';

const STATUS_OPTIONS = ['all', 'in-transit', 'recommended', 'feasible', 'excluded', 'received'];

function Timeline({ status }) {
  const steps = [
    { key: 'created', label: 'Created' },
    { key: 'reviewed', label: 'Recs Reviewed' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'transfer', label: 'Transfer in Progress' },
    { key: 'received', label: 'Received' },
  ];
  const activeIdx = status === 'In Transit' ? 3 : status === 'Received' ? 4 : status === 'Recommended' ? 1 : 2;

  return (
    <div className="order-timeline">
      {steps.map((s, i) => (
        <div key={s.key} className={`timeline-step${i <= activeIdx ? ' done' : ''}`}>
          <div className="timeline-dot" />
          {i < steps.length - 1 && <div className="timeline-line" />}
          <div className="timeline-label">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

function OrderDetail({ order }) {
  const navigate = useNavigate();
  if (!order) return null;
  const green = GREENS.find(g => g.id === order.greenId);
  const selGreen = GREENS.find(g => g.id === order.selectedGreenId);
  const transfer = TRANSFERS.find(t => t.relatedOrder === order.id);

  return (
    <div className="order-detail">
      <div className="card mb-4">
        <div className="card-header">
          <div>
            <div className="text-xs text-secondary mb-1" style={{ fontFamily: 'monospace' }}>{order.id}</div>
            <div className="card-title">{green?.name} ({order.greenId})</div>
          </div>
          <StatusBadge status={order.status.toLowerCase().replace(' ', '-')} />
        </div>
        <div className="card-body">
          <Timeline status={order.status} />
          <div className="divider" />
          <div className="order-detail-rows">
            <div className="detail-row"><span className="text-secondary text-sm">Requested green</span><strong>{order.greenId} — {green?.name}</strong></div>
            {selGreen && selGreen.id !== order.greenId && (
              <div className="detail-row">
                <span className="text-secondary text-sm">Selected green</span>
                <strong>{order.selectedGreenId} — {selGreen?.name} <span className="badge badge-warning">Alternate</span></strong>
              </div>
            )}
            <div className="detail-row"><span className="text-secondary text-sm">Quantity</span><strong>{order.qty?.toLocaleString()} kg</strong></div>
            <div className="detail-row"><span className="text-secondary text-sm">Source</span><strong>{order.source || '—'}</strong></div>
            <div className="detail-row"><span className="text-secondary text-sm">Required by</span><strong>{order.requiredDate}</strong></div>
            <div className="detail-row"><span className="text-secondary text-sm">Expected arrival</span><strong>{order.expectedDate || '—'}</strong></div>
            <div className="detail-row"><span className="text-secondary text-sm">Total cost</span><strong>{order.total ? `$${order.total.toLocaleString()}` : '—'}</strong></div>
            <div className="detail-row"><span className="text-secondary text-sm">Created</span><strong>{order.createdAt}</strong></div>
          </div>
        </div>
      </div>
      {transfer && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">Related Transfer</div>
            <StatusBadge status={transfer.status.toLowerCase().replace(' ', '-')} />
          </div>
          <div className="card-body">
            <div className="detail-row"><span className="text-secondary text-sm">Transfer ID</span><strong>{transfer.id}</strong></div>
            <div className="detail-row"><span className="text-secondary text-sm">From</span><strong>{transfer.warehouse}</strong></div>
            <div className="detail-row"><span className="text-secondary text-sm">To</span><strong>{transfer.destination}</strong></div>
            <div className="detail-row"><span className="text-secondary text-sm">Expected arrival</span><strong>{transfer.expectedArrival}</strong></div>
            <button className="btn btn-secondary btn-sm mt-4" onClick={() => navigate('/transfers')}>
              Track Transfer →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Orders() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState(id ? ORDERS.find(o => o.id === id) : null);

  const filtered = ORDERS.filter(o => {
    const g = GREENS.find(g => g.id === o.greenId);
    const matchSearch = !search || o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.greenId.toLowerCase().includes(search.toLowerCase()) ||
      g?.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status.toLowerCase().replace(' ', '-') === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusCounts = {
    total: ORDERS.length,
    'In Transit': ORDERS.filter(o => o.status === 'In Transit').length,
    Confirmed: ORDERS.filter(o => o.status === 'Confirmed').length,
    Received: ORDERS.filter(o => o.status === 'Received').length,
    Excluded: ORDERS.filter(o => o.status === 'Excluded').length,
  };

  return (
    <div className="orders-page animate-fade-in">
      <div className="breadcrumb">
        <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Overview</span>
        <span className="sep">/</span>
        <span>Orders</span>
      </div>
      <h1 className="page-title mb-6">Orders</h1>

      {/* KPIs */}
      <div className="orders-kpi-row">
        <KpiCard colorVariant="blue" title="Total Orders" value={statusCounts.total} subtitle="All statuses" />
        <KpiCard colorVariant="lavender" title="In Transit" value={statusCounts['In Transit']} subtitle="Active transfers" />
        <KpiCard colorVariant="sage" title="Confirmed" value={statusCounts.Confirmed || 0} subtitle="Awaiting dispatch" />
        <KpiCard colorVariant="rose" title="Received" value={statusCounts.Received || 0} subtitle="Completed" />
        <KpiCard title="Excluded / Infeasible" value={statusCounts.Excluded} subtitle="Need attention" trendPositive={false} />
      </div>

      <div className="orders-layout">
        {/* Table */}
        <div className="card" style={{ flex: 1 }}>
          <div className="card-body">
            <div className="inv-controls mb-4">
              <div className="topbar-search" style={{ maxWidth: 320 }}>
                <Search size={14} className="topbar-search-icon" />
                <input
                  placeholder="Search orders…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: 34 }}
                />
              </div>
              <div className="flex gap-2">
                {STATUS_OPTIONS.map(s => (
                  <button key={s} className={`filter-btn${statusFilter === s ? ' active' : ''}`} onClick={() => setStatusFilter(s)}>
                    {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ORDER ID</th>
                    <th>REQUESTED GREEN</th>
                    <th>SELECTED</th>
                    <th>QTY</th>
                    <th>SOURCE</th>
                    <th>TOTAL</th>
                    <th>REQ. DATE</th>
                    <th>EXP. DATE</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(o => {
                    const g = GREENS.find(g => g.id === o.greenId);
                    const sg = GREENS.find(g => g.id === o.selectedGreenId);
                    return (
                      <tr key={o.id} onClick={() => setSelected(o)} style={{ cursor: 'pointer', background: selected?.id === o.id ? 'rgba(216,63,121,0.05)' : '' }}>
                        <td><span className="order-id">{o.id}</span></td>
                        <td className="text-sm">{o.greenId}<div className="text-xs text-secondary">{g?.name}</div></td>
                        <td className="text-sm">
                          {o.selectedGreenId || '—'}
                          {o.isAlternate && <span className="badge badge-warning" style={{ marginLeft: 6 }}>alt</span>}
                        </td>
                        <td className="text-sm">{o.qty?.toLocaleString()} kg</td>
                        <td className="text-xs text-secondary">{o.source || '—'}</td>
                        <td className="font-semibold text-sm">{o.total ? `$${o.total.toLocaleString()}` : '—'}</td>
                        <td className="text-xs">{o.requiredDate}</td>
                        <td className="text-xs">{o.expectedDate || '—'}</td>
                        <td><StatusBadge status={o.status.toLowerCase().replace(' ', '-')} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Order Detail */}
        {selected && (
          <div style={{ width: 380, flexShrink: 0 }}>
            <OrderDetail order={selected} />
          </div>
        )}
      </div>
    </div>
  );
}
