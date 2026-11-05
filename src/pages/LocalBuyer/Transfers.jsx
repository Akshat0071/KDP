import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Search } from 'lucide-react';
import { TRANSFERS, GREENS, ORDERS } from '../../data/mockData';
import { StatusBadge, KpiCard } from '../../components/ui/Components';

function TransferDetail({ transfer, onClose }) {
  const navigate = useNavigate();
  if (!transfer) return null;
  const green = GREENS.find(g => g.id === transfer.greenId);
  const order = ORDERS.find(o => o.id === transfer.relatedOrder);
  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer" onClick={e => e.stopPropagation()}>
        <div className="drawer-header">
          <div>
            <div className="font-semibold" style={{ fontSize: 'var(--font-size-lg)' }}>Transfer {transfer.id}</div>
            <div className="text-xs text-secondary">{transfer.warehouse} → {transfer.destination}</div>
          </div>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>
        <div className="drawer-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'Green', val: `${transfer.greenId} — ${green?.name}` },
              { label: 'Lot', val: transfer.lot },
              { label: 'Quantity', val: `${transfer.qty.toLocaleString()} kg` },
              { label: 'Dispatch date', val: transfer.dispatchDate },
              { label: 'Expected arrival', val: transfer.expectedArrival },
              { label: 'Status', val: <StatusBadge status={transfer.status.toLowerCase().replace(' ', '-')} /> },
              { label: 'Related order', val: transfer.relatedOrder },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: 10 }}>
                <span className="text-sm text-secondary">{r.label}</span>
                <strong className="text-sm">{r.val}</strong>
              </div>
            ))}
          </div>
          <div className="divider" />
          <div className="text-xs" style={{ padding: '8px 12px', background: 'var(--color-info-bg)', borderRadius: 6, color: 'var(--color-info)' }}>
            Transfers are one-way: Central Warehouse → Local Site only. No warehouse-to-warehouse or local-to-local movements.
          </div>
          {transfer.relatedOrder && (
            <button className="btn btn-secondary btn-sm mt-4 w-full" onClick={() => navigate(`/orders/${transfer.relatedOrder}`)}>
              View Related Order →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Transfers() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = TRANSFERS.filter(t =>
    !search ||
    t.id.toLowerCase().includes(search.toLowerCase()) ||
    t.greenId.toLowerCase().includes(search.toLowerCase()) ||
    t.warehouse.toLowerCase().includes(search.toLowerCase())
  );

  const inTransit = TRANSFERS.filter(t => t.status === 'In Transit').length;
  const planned = TRANSFERS.filter(t => t.status === 'Planned').length;
  const received = TRANSFERS.filter(t => t.status === 'Received').length;
  const totalQty = TRANSFERS.reduce((s, t) => s + t.qty, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1200 }} className="animate-fade-in">
      <div className="breadcrumb">
        <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Overview</span>
        <span className="sep">/</span>
        <span>Transfers & Incoming</span>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="page-title">Transfers & Incoming Inventory</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
        <KpiCard colorVariant="lavender" title="In Transit" value={inTransit} subtitle="Active transfers" />
        <KpiCard colorVariant="amber" title="Planned" value={planned} subtitle="Awaiting dispatch" />
        <KpiCard colorVariant="sage" title="Received" value={received} subtitle="Completed this month" />
        <KpiCard colorVariant="blue" title="Total Incoming" value={`${(totalQty/1000).toFixed(1)}t`} subtitle={`${totalQty.toLocaleString()} kg total`} />
      </div>

      <div className="card">
        <div className="card-body">
          <div className="text-xs text-secondary mb-4" style={{ padding: '8px 12px', background: 'var(--color-info-bg)', borderRadius: 6, border: '1px solid rgba(22,166,209,0.2)' }}>
            ⓘ All transfers are Central Warehouse → Local Site only. Incoming inventory is not available until marked Received.
          </div>
          <div style={{ marginBottom: 16 }}>
            <div className="topbar-search" style={{ maxWidth: 360 }}>
              <Search size={14} className="topbar-search-icon" />
              <input placeholder="Search transfers…" value={search} onChange={e => setSearch(e.target.value)} className="form-input" style={{ paddingLeft: 34 }} />
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>TRANSFER ID</th>
                  <th>FROM (CENTRAL)</th>
                  <th>TO (LOCAL SITE)</th>
                  <th>GREEN</th>
                  <th>LOT</th>
                  <th style={{ textAlign: 'right' }}>QTY (KG)</th>
                  <th>DISPATCH DATE</th>
                  <th>EXP. ARRIVAL</th>
                  <th>STATUS</th>
                  <th>RELATED ORDER</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => {
                  const g = GREENS.find(g => g.id === t.greenId);
                  return (
                    <tr key={t.id} onClick={() => setSelected(t)} style={{ cursor: 'pointer' }}>
                      <td><span className="order-id">{t.id}</span></td>
                      <td className="text-sm">{t.warehouse}</td>
                      <td className="text-sm">{t.destination}</td>
                      <td>
                        <div className="text-sm font-semibold" style={{ fontFamily: 'monospace' }}>{t.greenId}</div>
                        <div className="text-xs text-secondary">{g?.name}</div>
                      </td>
                      <td className="text-xs text-secondary">{t.lot}</td>
                      <td className="text-sm text-right font-semibold">{t.qty.toLocaleString()}</td>
                      <td className="text-xs">{t.dispatchDate}</td>
                      <td className="text-xs font-medium">{t.expectedArrival}</td>
                      <td><StatusBadge status={t.status.toLowerCase().replace(' ', '-')} /></td>
                      <td>
                        <span className="order-id" onClick={e => { e.stopPropagation(); navigate(`/orders/${t.relatedOrder}`); }}>
                          {t.relatedOrder}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="sim-note mt-4">Sample data · Simulated · Incoming stock becomes available only after status changes to Received</div>
        </div>
      </div>

      {selected && <TransferDetail transfer={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
