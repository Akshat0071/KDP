import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Download, RefreshCw, Leaf, AlertTriangle, X } from 'lucide-react';
import { StatusBadge, KpiCard } from '../../components/ui/Components';
import { LOCAL_INVENTORY, GREENS } from '../../data/mockData';

function getAvailable(item) {
  return Math.max(0, item.onHand - item.reserved);
}

function getGreen(id) {
  return GREENS.find(g => g.id === id) || {};
}

function StockDetailPanel({ item, green, onClose }) {
  if (!item) return null;
  const avail = getAvailable(item);
  const thresholdGap = avail - (green.minThreshold || 0);
  const unitCost = item.unitCost ?? green.unitCost ?? 0;
  const stockValue = avail * unitCost;

  return (
    <aside className="inv-detail-panel">
      <div className="inv-detail-header">
        <div>
          <div className="flex items-center gap-2"><strong>{green.id}</strong><StatusBadge status={item.status} /></div>
          <div className="text-sm text-secondary mt-1">{green.name}</div>
        </div>
        <button className="btn-icon" onClick={onClose} aria-label="Close stock details"><X size={16} /></button>
      </div>
      <div className="inv-detail-body">
        <div className="inv-detail-section">
          <h3>Stock Summary</h3>
          <div className="inv-detail-grid">
            {[
              ['On-Hand', item.onHand],
              ['Reserved', item.reserved],
              ['Available', avail],
              ['Min Threshold', green.minThreshold || 0],
              ['Incoming', item.incoming || 0],
              ['Vs. Threshold', thresholdGap],
            ].map(([label, value]) => (
              <div className="inv-detail-metric" key={label}>
                <span>{label}</span>
                <strong className={label === 'Vs. Threshold' ? (thresholdGap < 0 ? 'text-critical' : 'text-success') : ''}>
                  {label === 'Vs. Threshold' && value > 0 ? '+' : ''}{value.toLocaleString()} kg
                </strong>
              </div>
            ))}
          </div>
        </div>
        <div className="inv-detail-section">
          <h3>Lot Details</h3>
          <div className="inv-lot-card">
            <div className="flex items-center justify-between"><strong>{item.lot}</strong><StatusBadge status={item.status} /></div>
            <p>On-hand: {item.onHand.toLocaleString()} kg · Reserved: {item.reserved.toLocaleString()} kg · Available: {avail.toLocaleString()} kg</p>
            {item.incoming > 0 && <p className="text-info">Incoming {item.incoming.toLocaleString()} kg{item.incomingEta ? ` · ETA ${item.incomingEta}` : ''} · not yet available</p>}
          </div>
        </div>
        <div className="inv-detail-section">
          <h3>Cost</h3>
          <div className="inv-detail-line"><span>Unit cost</span><strong>${unitCost.toFixed(2)}/kg</strong></div>
          <div className="inv-detail-line"><span>Available stock value</span><strong>${stockValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong></div>
        </div>
        {green.alternates?.length > 0 && (
          <div className="inv-detail-section">
            <h3>Approved Alternates</h3>
            <div className="flex gap-2 flex-wrap">{green.alternates.map(id => <span key={id} className="badge badge-info">{id}</span>)}</div>
          </div>
        )}
      </div>
    </aside>
  );
}

export default function Inventory() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [greenFilter, setGreenFilter] = useState('all');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [supplierFilter, setSupplierFilter] = useState('all');
  const [selectedGreenId, setSelectedGreenId] = useState(LOCAL_INVENTORY[1]?.greenId ?? null);

  const filtered = LOCAL_INVENTORY.filter(item => {
    const g = getGreen(item.greenId);
    const matchSearch = !search ||
      item.greenId.toLowerCase().includes(search.toLowerCase()) ||
      g.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.lot.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchGreen = greenFilter === 'all' || item.greenId === greenFilter;
    const matchGrade = gradeFilter === 'all' || g.grade === gradeFilter;
    const matchType = typeFilter === 'all' || g.processing === typeFilter;
    const matchSupplier = supplierFilter === 'all' || item.supplier === supplierFilter;
    return matchSearch && matchStatus && matchGreen && matchGrade && matchType && matchSupplier;
  });
  const selectedItem = LOCAL_INVENTORY.find(item => item.greenId === selectedGreenId);
  const selectedGreen = selectedItem ? getGreen(selectedItem.greenId) : null;
  const attentionItems = LOCAL_INVENTORY.filter(item => getAvailable(item) < getGreen(item.greenId).minThreshold);

  const totalOnHand = LOCAL_INVENTORY.reduce((s, i) => s + i.onHand, 0);
  const totalReserved = LOCAL_INVENTORY.reduce((s, i) => s + i.reserved, 0);
  const totalAvail = LOCAL_INVENTORY.reduce((s, i) => s + getAvailable(i), 0);
  const totalIncoming = LOCAL_INVENTORY.reduce((s, i) => s + (i.incoming || 0), 0);
  const belowThresh = LOCAL_INVENTORY.filter(i => getAvailable(i) < getGreen(i.greenId).minThreshold).length;
  const totalStockValue = LOCAL_INVENTORY.reduce((sum, item) => sum + getAvailable(item) * (item.unitCost ?? getGreen(item.greenId).unitCost ?? 0), 0);
  const grades = [...new Set(LOCAL_INVENTORY.map(item => getGreen(item.greenId).grade))];
  const types = [...new Set(LOCAL_INVENTORY.map(item => getGreen(item.greenId).processing))];
  const suppliers = [...new Set(LOCAL_INVENTORY.map(item => item.supplier).filter(Boolean))];

  const STATUS_FILTERS = [
    { value: 'all', label: 'All Greens' },
    { value: 'healthy', label: 'Healthy' },
    { value: 'low', label: 'Low' },
    { value: 'critical', label: 'Critical' },
  ];

  return (
    <div className="inventory-page animate-fade-in">
      {/* Page Header Banner */}
      <div className="inventory-header-banner">
        <div>
          <h1 className="page-title">Local Inventory — Austin Site 04</h1>
          <p className="header-sub">{LOCAL_INVENTORY.length} active greens · {belowThresh} below minimum threshold · {totalIncoming.toLocaleString()} kg incoming</p>
        </div>
        <div className="flex gap-2" style={{ marginTop: 4 }}>
          <button className="btn btn-secondary btn-sm" style={{ background: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}>
            <RefreshCw size={13} /> Refresh
          </button>
          <button className="btn btn-secondary btn-sm" style={{ background: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}>
            <Download size={13} /> Export
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/create-order')}>
            + Create Order
          </button>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="inv-kpi-row">
        <KpiCard colorVariant="blue" title="On-Hand" value={`${(totalOnHand / 1000).toFixed(1)}t`} subtitle={`${totalOnHand.toLocaleString()} kg total`} />
        <KpiCard colorVariant="amber" title="Reserved" value={`${(totalReserved / 1000).toFixed(1)}t`} subtitle={`${totalReserved.toLocaleString()} kg committed`} />
        <KpiCard colorVariant="sage" title="Available" value={`${(totalAvail / 1000).toFixed(1)}t`} subtitle="On-hand minus reservations" />
        <KpiCard colorVariant="lavender" title="Incoming" value={`${(totalIncoming / 1000).toFixed(1)}t`} subtitle="Not yet available" />
        <KpiCard colorVariant="peach" title="Below Threshold" value={belowThresh} unit="greens" subtitle="Need replenishment" trendPositive={false} />
        <KpiCard colorVariant="rose" title="Total Stock Value" value={`$${(totalStockValue / 1000).toFixed(1)}k`} subtitle="Available stock · simulated" />
      </div>

      {attentionItems.length > 0 && (
        <section className="inv-attention" aria-labelledby="inv-attention-title">
          <div className="inv-attention-header">
            <div className="flex items-center gap-2"><AlertTriangle size={17} /><h2 id="inv-attention-title">Replenishment Attention Required</h2><span className="badge badge-critical">{attentionItems.length} greens</span></div>
            <span className="text-sm text-secondary">Available stock is below minimum threshold</span>
          </div>
          {attentionItems.map(item => {
            const green = getGreen(item.greenId);
            const available = getAvailable(item);
            const deficit = available - green.minThreshold;
            return (
              <div className="inv-attention-row" key={item.greenId}>
                <div className="flex items-center gap-3"><StatusBadge status={item.status} /><strong>{green.id}</strong><span className="text-secondary">{green.name}</span></div>
                <div className="inv-attention-value"><strong>{available.toLocaleString()} kg</strong><span>Available</span></div>
                <div className="inv-attention-value"><strong>{green.minThreshold.toLocaleString()} kg</strong><span>Min threshold</span></div>
                <div className="inv-attention-value deficit"><strong>{deficit.toLocaleString()} kg</strong><span>Deficit</span></div>
                <button className="btn btn-secondary btn-sm" onClick={() => setSelectedGreenId(item.greenId)}>View Details</button>
              </div>
            );
          })}
        </section>
      )}

      {/* Search & Filter */}
      <div className="card inv-table-card">
        <div className="card-header">
          <div className="card-title">
            <Leaf size={14} style={{ color: 'var(--color-sage-deep)' }} />
            Green Bean Stock
          </div>
          <div className="text-xs text-secondary">Select a row to view stock details</div>
        </div>
        <div className="card-body">
          <div className="inv-controls">
            <div className="topbar-search" style={{ maxWidth: 360 }}>
              <Search size={14} className="topbar-search-icon" />
              <input
                placeholder="Search greens, lots…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="form-input"
                style={{ paddingLeft: 34 }}
              />
            </div>
            <div className="inv-filter-selects">
              <select aria-label="Filter by green" className="form-select" value={greenFilter} onChange={e => setGreenFilter(e.target.value)}><option value="all">All Greens</option>{LOCAL_INVENTORY.map(item => <option key={item.greenId} value={item.greenId}>{item.greenId}</option>)}</select>
              <select aria-label="Filter by grade" className="form-select" value={gradeFilter} onChange={e => setGradeFilter(e.target.value)}><option value="all">All Grades</option>{grades.map(grade => <option key={grade} value={grade}>{grade}</option>)}</select>
              <select aria-label="Filter by processing" className="form-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}><option value="all">All Types</option>{types.map(type => <option key={type} value={type}>{type}</option>)}</select>
              <select aria-label="Filter by supplier" className="form-select" value={supplierFilter} onChange={e => setSupplierFilter(e.target.value)}><option value="all">All Suppliers</option>{suppliers.map(supplier => <option key={supplier} value={supplier}>{supplier}</option>)}</select>
              <select aria-label="Filter by status" className="form-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>{STATUS_FILTERS.map(f => <option key={f.value} value={f.value}>{f.label === 'All Greens' ? 'All Statuses' : f.label}</option>)}</select>
            </div>
          </div>

          <div className="inv-content-grid">
          <div className="inv-table-scroll">
            <table className="data-table inv-data-table">
              <thead>
                <tr>
                  <th>GREEN / NAME</th>
                  <th>LOT</th>
                  <th>GRADE</th>
                  <th>ORIGIN / PROCESS</th>
                  <th style={{ textAlign: 'right' }}>ON-HAND</th>
                  <th style={{ textAlign: 'right' }}>RESERVED</th>
                  <th style={{ textAlign: 'right' }}>AVAILABLE</th>
                  <th style={{ textAlign: 'right' }}>INCOMING</th>
                  <th style={{ textAlign: 'right' }}>MIN THRESHOLD</th>
                  <th style={{ textAlign: 'right' }}>VS. THRESHOLD</th>
                  <th style={{ textAlign: 'right' }}>UNIT COST / VALUE</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(item => {
                  const g = getGreen(item.greenId);
                  const avail = getAvailable(item);
                  const isBelow = avail < g.minThreshold;
                  return (
                    <tr
                      key={item.greenId + item.lot}
                      onClick={() => setSelectedGreenId(item.greenId)}
                      className={selectedGreenId === item.greenId ? 'selected' : ''}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>
                        <div className="font-semibold text-sm" style={{ fontFamily: 'monospace' }}>{g.id}</div>
                        <div className="text-xs text-secondary">{g.name}</div>
                      </td>
                      <td><div>{item.lot}</div><div className="text-xs text-secondary">{item.supplier || 'Supplier not assigned'}</div></td>
                      <td className="text-sm">{g.grade}</td>
                      <td><div>{g.origin}</div><div className="text-xs text-secondary">{g.processing}</div></td>
                      <td className="text-sm text-right">{item.onHand.toLocaleString()}</td>
                      <td className="text-sm text-right" style={{ color: item.reserved > 0 ? 'var(--color-warning)' : 'inherit' }}>
                        {item.reserved.toLocaleString()}
                      </td>
                      <td className="text-right">
                        <span className="font-semibold" style={{ color: isBelow ? 'var(--color-critical)' : 'var(--color-success)' }}>
                          {avail.toLocaleString()}
                        </span>
                      </td>
                      <td className="text-right">
                        {item.incoming > 0 ? (
                          <span className="badge badge-info">{item.incoming.toLocaleString()} kg</span>
                        ) : <span className="text-secondary">—</span>}
                      </td>
                      <td className="text-sm text-right text-secondary">{g.minThreshold?.toLocaleString()}<div className="text-xs">kg min</div></td>
                      <td className={`text-sm text-right ${isBelow ? 'text-critical' : 'text-success'}`}>
                        {isBelow ? '' : '+'}{(avail - g.minThreshold).toLocaleString()} kg
                      </td>
                      <td className="text-sm text-right font-medium">
                        <div>${(item.unitCost ?? g.unitCost)?.toFixed(2)}/kg</div>
                        <div className="text-xs text-secondary">${(avail * (item.unitCost ?? g.unitCost)).toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                      </td>
                      <td><StatusBadge status={item.status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <StockDetailPanel item={selectedItem} green={selectedGreen} onClose={() => setSelectedGreenId(null)} />
          </div>
          <div className="inv-table-footer text-xs text-secondary">Showing {filtered.length} of {LOCAL_INVENTORY.length} active greens · Sample data · Simulated <span>Available = On-Hand − Reserved. Incoming is shown separately until received.</span></div>
        </div>
      </div>

    </div>
  );
}
