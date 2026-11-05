import { useNavigate } from 'react-router-dom';
import { Warehouse, Package, Truck, AlertTriangle } from 'lucide-react';
import { KpiCard } from '../../components/ui/Components';
import { WAREHOUSE_INVENTORY, GREENS } from '../../data/mockData';

const WAREHOUSES = [
  { id: 'WH-02', name: 'WH-02 Dallas', region: 'South Central', onHand: 18400, reserved: 1600, incoming: 2200, pending: 3 },
  { id: 'WH-01', name: 'WH-01 Chicago', region: 'Midwest', onHand: 12100, reserved: 800, incoming: 1400, pending: 1 },
  { id: 'WH-03', name: 'WH-03 Portland', region: 'Pacific Northwest', onHand: 9300, reserved: 800, incoming: 4000, pending: 2 },
];

export default function CentralWarehouse() {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1400 }} className="animate-fade-in">
      {/* Future scope banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--color-primary) 0%, #2a1f26 100%)',
        border: '2px dashed rgba(22,166,209,0.4)',
        borderRadius: 'var(--border-radius-lg)',
        padding: '24px 32px',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        gap: 24,
      }}>
        <Warehouse size={40} style={{ color: 'var(--color-blue-accent)', flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-blue-accent)', marginBottom: 4 }}>
            FUTURE SCOPE — CONCEPTUAL DESIGN
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Central Warehouse Manager Experience</div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)' }}>
            This workspace is a conceptual preview for 3 independent central warehouses (WH-01, WH-02, WH-03).
            It is not part of the Local Buyer MVP. Transfers flow one-way: Central → Local only.
            No warehouse-to-warehouse movements.
          </div>
        </div>
        <button className="btn btn-secondary" style={{ flexShrink: 0 }} onClick={() => navigate('/')}>
          ← Return to Local Buyer
        </button>
      </div>

      {/* Warehouse selector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
        {WAREHOUSES.map(wh => {
          const whStk = WAREHOUSE_INVENTORY.find(w => w.shortId === wh.id)?.stock || [];
          const avail = wh.onHand - wh.reserved;
          return (
            <div key={wh.id} className="card" style={{ transition: 'box-shadow var(--transition-base)' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow-card)'}
            >
              <div className="card-header">
                <div>
                  <div className="font-bold" style={{ fontSize: 18 }}>{wh.name}</div>
                  <div className="text-xs text-secondary">{wh.region}</div>
                </div>
                <div className="badge badge-info">{wh.pending} pending requests</div>
              </div>
              <div className="card-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {[
                    { l: 'On-Hand', v: `${(wh.onHand/1000).toFixed(1)}t` },
                    { l: 'Reserved', v: `${(wh.reserved/1000).toFixed(1)}t` },
                    { l: 'Available', v: `${(avail/1000).toFixed(1)}t`, hi: true },
                    { l: 'Incoming', v: `${(wh.incoming/1000).toFixed(1)}t` },
                  ].map(k => (
                    <div key={k.l} style={{ padding: 12, background: k.hi ? 'var(--color-success-bg)' : 'var(--color-lavender-bg)', borderRadius: 6 }}>
                      <div className="text-xs text-secondary">{k.l}</div>
                      <div className="font-bold" style={{ fontSize: 18 }}>{k.v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 16 }}>
                  <div className="text-xs font-semibold text-secondary mb-2">GREENS IN STOCK ({whStk.length})</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {whStk.map(s => {
                      const g = GREENS.find(g => g.id === s.greenId);
                      return (
                        <div key={s.greenId} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: 'var(--color-white)', border: '1px solid var(--color-border)', borderRadius: 20, fontSize: 12 }}>
                          <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{s.greenId}</span>
                          <span className="text-secondary">{s.available?.toLocaleString() || '—'} kg</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Future scope: Fulfillment Queue */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Pending Local Fulfillment Requests</div>
            <div className="text-xs text-secondary">Conceptual — future scope MVP</div>
          </div>
          <span className="badge badge-info">Future Scope</span>
        </div>
        <div className="card-body">
          <table className="data-table">
            <thead>
              <tr>
                <th>REQUEST ID</th>
                <th>LOCAL SITE</th>
                <th>GREEN</th>
                <th>QTY NEEDED</th>
                <th>REQUIRED BY</th>
                <th>WAREHOUSE</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: 'REQ-3201', site: 'Austin — Site 04', green: 'Gb-04', qty: 1200, by: 'Nov 05', wh: 'WH-02 Dallas', status: 'Pending Allocation' },
                { id: 'REQ-3198', site: 'Denver — Site 06', green: 'Gc-11', qty: 800, by: 'Nov 08', wh: 'WH-01 Chicago', status: 'Dispatch Ready' },
                { id: 'REQ-3195', site: 'Seattle — Site 02', green: 'Ge-31', qty: 600, by: 'Nov 10', wh: 'WH-03 Portland', status: 'In Transit' },
              ].map(r => (
                <tr key={r.id}>
                  <td><span className="order-id">{r.id}</span></td>
                  <td className="text-sm">{r.site}</td>
                  <td className="text-sm font-semibold" style={{ fontFamily: 'monospace' }}>{r.green}</td>
                  <td className="text-sm">{r.qty.toLocaleString()} kg</td>
                  <td className="text-sm">{r.by}</td>
                  <td className="text-sm">{r.wh}</td>
                  <td><span className="badge badge-info">{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="sim-note text-center">
        Central Warehouse workspace is future scope. This is a conceptual design preview only. Sample data · Simulated.
      </div>
    </div>
  );
}

