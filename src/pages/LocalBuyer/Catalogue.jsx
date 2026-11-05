import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import { GREENS } from '../../data/mockData';

function GreenDetail({ green, onClose }) {
  if (!green) return null;
  const altGreens = GREENS.filter(g => green.alternates?.includes(g.id));
  const reverseAlts = GREENS.filter(g => g.alternates?.includes(green.id));

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer" onClick={e => e.stopPropagation()}>
        <div className="drawer-header">
          <div>
            <div className="font-semibold" style={{ fontSize: 'var(--font-size-lg)' }}>{green.id} — {green.name}</div>
            <div className="text-xs text-secondary">{green.grade} · {green.processing} · {green.origin}</div>
          </div>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>
        <div className="drawer-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Green ID', val: green.id },
              { label: 'Name', val: green.name },
              { label: 'Grade', val: green.grade },
              { label: 'Origin', val: green.origin },
              { label: 'Processing', val: green.processing },
              { label: 'Unit cost', val: `$${green.unitCost}/kg` },
              { label: 'Min threshold', val: `${green.minThreshold?.toLocaleString()} kg` },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: 8 }}>
                <span className="text-sm text-secondary">{r.label}</span>
                <strong className="text-sm">{r.val}</strong>
              </div>
            ))}
          </div>

          <div className="divider" />
          <div className="text-sm font-semibold mb-3">Approved Alternates (one-way: {green.id} → alt)</div>
          {altGreens.length > 0 ? altGreens.map(a => (
            <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', background: 'var(--color-lavender-bg)', borderRadius: 6, marginBottom: 8 }}>
              <span className="badge badge-info">{a.id}</span>
              <span className="text-sm">{a.name}</span>
              <ArrowRight size={12} style={{ color: 'var(--color-text-secondary)' }} />
              <span className="text-xs text-secondary">${a.unitCost}/kg</span>
            </div>
          )) : <div className="text-sm text-secondary">No approved alternates configured</div>}

          {reverseAlts.length > 0 && (
            <>
              <div className="divider" />
              <div className="text-sm font-semibold mb-3">Reverse relationships (other greens that list {green.id} as alternate)</div>
              {reverseAlts.map(a => (
                <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', background: 'var(--color-warning-bg)', borderRadius: 6, marginBottom: 8 }}>
                  <span className="badge badge-warning">{a.id} → {green.id}</span>
                  <span className="text-xs text-secondary">Reciprocal only if explicitly configured</span>
                </div>
              ))}
            </>
          )}
          <div className="text-xs text-secondary mt-4" style={{ padding: '8px', background: 'var(--color-lavender-bg)', borderRadius: 6 }}>
            Alternate relationships are one-way unless explicitly configured as reciprocal in this catalogue.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Catalogue() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = GREENS.filter(g =>
    !search ||
    g.id.toLowerCase().includes(search.toLowerCase()) ||
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.origin.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1200 }} className="animate-fade-in">
      <div className="breadcrumb">
        <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Overview</span>
        <span className="sep">/</span>
        <span>Green Catalogue</span>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Green Bean Catalogue</h1>
          <div className="text-sm text-secondary mt-1">Reference data and substitution rules · {GREENS.length} greens configured</div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div style={{ marginBottom: 16 }}>
            <div className="topbar-search" style={{ maxWidth: 360 }}>
              <Search size={14} className="topbar-search-icon" />
              <input placeholder="Search greens, origins, grades…" value={search} onChange={e => setSearch(e.target.value)} className="form-input" style={{ paddingLeft: 34 }} />
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>GREEN ID</th>
                  <th>NAME</th>
                  <th>GRADE</th>
                  <th>ORIGIN</th>
                  <th>PROCESSING</th>
                  <th style={{ textAlign: 'right' }}>UNIT COST</th>
                  <th style={{ textAlign: 'right' }}>MIN THRESHOLD</th>
                  <th>APPROVED ALTERNATES</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(g => (
                  <tr key={g.id} onClick={() => setSelected(g)} style={{ cursor: 'pointer' }}>
                    <td><span className="order-id">{g.id}</span></td>
                    <td className="font-medium text-sm">{g.name}</td>
                    <td className="text-sm">{g.grade}</td>
                    <td className="text-sm">{g.origin}</td>
                    <td className="text-sm">{g.processing}</td>
                    <td className="text-sm text-right">${g.unitCost}</td>
                    <td className="text-sm text-right">{g.minThreshold?.toLocaleString()} kg</td>
                    <td>
                      {g.alternates?.length > 0
                        ? g.alternates.map(a => <span key={a} className="badge badge-info" style={{ marginRight: 4 }}>{a}</span>)
                        : <span className="text-secondary text-xs">None</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="sim-note mt-4">
            Alternate relationships are one-way unless explicitly configured as reciprocal. Sample data only.
          </div>
        </div>
      </div>

      {selected && <GreenDetail green={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

