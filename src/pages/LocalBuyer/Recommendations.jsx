import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, XCircle, AlertTriangle, ArrowRight, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { FULFILLMENT_OPTIONS, GREENS } from '../../data/mockData';
import { StatusBadge } from '../../components/ui/Components';

const SCENARIO_COLORS = {
  'SCENARIO 1 • LOCAL • SAME GREEN': 'var(--color-primary)',
  'SCENARIO 2 • LOCAL • ALTERNATE': 'var(--color-rose-accent)',
  'SCENARIO 3 • CENTRAL • SAME GREEN': 'var(--color-info)',
  'SCENARIO 4 • CENTRAL • ALTERNATE': 'var(--color-success)',
};

function CostBreakdown({ breakdown }) {
  return (
    <div className="cost-breakdown">
      {[
        { label: 'Bean cost', val: breakdown.bean },
        { label: 'Local handling + QA', val: breakdown.handling },
        { label: 'Internal transfer', val: breakdown.transfer },
        { label: 'Expedite / pallet fee', val: breakdown.expedite },
      ].map(r => (
        <div key={r.label} className="cost-row">
          <span className="text-xs text-secondary">{r.label}</span>
          <span className="text-xs font-medium">${r.val.toLocaleString()}</span>
        </div>
      ))}
      <div className="cost-row cost-total">
        <span className="text-sm font-semibold">Estimated total</span>
        <span className="text-sm font-bold">
          ${Object.values(breakdown).reduce((a, b) => a + b, 0).toLocaleString()}
        </span>
      </div>
    </div>
  );
}

function OptionCard({ opt, isSelected, onSelect, onViewDetails }) {
  const [expanded, setExpanded] = useState(false);
  const scenarioColor = SCENARIO_COLORS[opt.scenario] || 'var(--color-text-secondary)';

  if (!opt.feasible) {
    return (
      <div className="option-card excluded">
        <div className="option-card-header">
          <div className="option-rank excluded-rank">{opt.rank}</div>
          <div className="option-info">
            <div className="option-scenario-tag" style={{ color: 'var(--color-text-secondary)' }}>
              {opt.scenario}
            </div>
            <div className="flex items-center gap-3">
              <div className="option-green-name">{opt.greenName}</div>
              <span className="badge badge-critical">Excluded</span>
            </div>
            <div className="option-source-line">{opt.source}{opt.lot ? ` · ${opt.lot}` : ''}</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setExpanded(e => !e)}>
              View Why
            </button>
          </div>
        </div>
        {expanded && (
          <div className="option-excluded-reason">
            <XCircle size={14} style={{ color: 'var(--color-critical)', flexShrink: 0 }} />
            <span className="text-sm">{opt.excludedReason}</span>
          </div>
        )}
        {opt.arrivalDate && (
          <div className="option-excluded-tag">
            <span className="badge badge-critical" style={{ marginLeft: 12, marginBottom: 8 }}>
              Misses deadline
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`option-card${isSelected ? ' selected' : ''}${opt.badge === 'Recommended' ? ' recommended' : ''}`}>
      <div className="option-card-header">
        <div className={`option-rank${opt.badge === 'Recommended' ? ' rank-recommended' : ''}`}>{opt.rank}</div>
        <div className="option-info">
          <div className="option-scenario-tag" style={{ color: scenarioColor }}>
            {opt.scenario}
            {opt.badge === 'Recommended' && (
              <span className="badge badge-recommended" style={{ marginLeft: 8 }}>Recommended</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="option-green-name">{opt.greenName}</div>
          </div>
          <div className="option-source-line">
            {opt.source}{opt.lot ? ` · ${opt.lot}` : ''} · {opt.available.toLocaleString()} kg avail · covers {Math.round(opt.available / 1200 * 100)}% of need
          </div>
        </div>
        <div className="option-pricing">
          <div className="option-metric">
            <span>Total delivered</span>
            <strong className="option-price-main">${opt.totalDelivered?.toLocaleString()}</strong>
          </div>
          <div className="option-metric">
            <span>Per kg</span>
            <strong>${opt.perKg}/kg</strong>
          </div>
          <div className="option-metric">
            <span>Arrival</span>
            <strong>{opt.arrivalDate}</strong>
          </div>
          {opt.savingsVsBaseline > 0 && (
            <div className="option-savings">${opt.savingsVsBaseline.toLocaleString()} saved</div>
          )}
        </div>
        <button
          className={`btn option-select-btn${isSelected ? ' btn-secondary' : ' btn-primary'}`}
          onClick={() => onSelect(opt)}
        >
          {isSelected ? 'Selected ✓' : 'Select This Option'}
        </button>
        <button className="option-toggle option-toggle-inline" onClick={() => setExpanded(e => !e)}>
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {expanded ? 'Hide' : 'Cost breakdown'}
        </button>
      </div>

      {/* Reason */}
      <div className="option-reason">
        <CheckCircle size={14} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
        <span className="text-sm text-secondary">{opt.reason}</span>
      </div>

      {expanded && opt.costBreakdown && (
        <div className="option-breakdown-content">
          <CostBreakdown breakdown={opt.costBreakdown} />
        </div>
      )}
    </div>
  );
}

function DetailPanel({ opt, onConfirm }) {
  if (!opt || !opt.feasible) return null;
  return (
    <div className="detail-panel">
      <div className="detail-panel-header">
        <span className="badge badge-recommended">RECOMMENDED · OPTION {opt.rank}</span>
      </div>
      <div className="detail-panel-body">
        <div className="detail-green-name">{opt.greenName}</div>
        <div className="text-xs text-secondary mb-4">
          {opt.isAlternate ? `Approved alternate to Gb-04 · One-way substitution` : 'Exact match'}
        </div>
        {opt.costBreakdown && <CostBreakdown breakdown={opt.costBreakdown} />}
        <div className="detail-cost-total mt-4">
          <div className="text-sm text-secondary">Cost per kg</div>
          <div className="font-bold" style={{ fontSize: 18 }}>${opt.perKg}/kg</div>
        </div>
        <div className="detail-reason-box">
          <div className="text-xs font-semibold mb-2" style={{ color: 'var(--color-success)' }}>Why this wins</div>
          <div className="text-xs text-secondary">{opt.reason}</div>
        </div>
        {opt.isAlternate && (
          <div className="detail-warning">
            <AlertTriangle size={13} />
            <span className="text-xs">Substitution acknowledgement required at confirmation. Roast profile R-22 applies.</span>
          </div>
        )}
        <button className="btn btn-dark btn-lg w-full mt-4" onClick={() => onConfirm(opt)}>
          Select This Option
        </button>
        <div className="text-xs text-secondary text-center mt-2">Estimates simulated · Final invoice may vary</div>
      </div>
    </div>
  );
}

export default function Recommendations() {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order;

  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [panelOpt, setPanelOpt] = useState(FULFILLMENT_OPTIONS.find(o => o.badge === 'Recommended'));

  const FILTERS = [
    { value: 'all', label: `All (${FULFILLMENT_OPTIONS.length})` },
    { value: 'local', label: `Local (${FULFILLMENT_OPTIONS.filter(o => o.sourceSite === 'Local').length})` },
    { value: 'central', label: `Central (${FULFILLMENT_OPTIONS.filter(o => o.sourceSite === 'Central').length})` },
    { value: 'same', label: `Same green (${FULFILLMENT_OPTIONS.filter(o => o.isSameGreen).length})` },
    { value: 'alternate', label: `Alternate (${FULFILLMENT_OPTIONS.filter(o => o.isAlternate).length})` },
    { value: 'feasible', label: 'Feasible only' },
  ];

  const visible = FULFILLMENT_OPTIONS.filter(opt => {
    if (filter === 'local') return opt.sourceSite === 'Local';
    if (filter === 'central') return opt.sourceSite === 'Central';
    if (filter === 'same') return opt.isSameGreen;
    if (filter === 'alternate') return opt.isAlternate;
    if (filter === 'feasible') return opt.feasible;
    return true;
  });

  const feasible = visible.filter(o => o.feasible);
  const excluded = visible.filter(o => !o.feasible);

  function handleSelect(opt) {
    setSelected(opt);
    setPanelOpt(opt);
  }

  function handleConfirm(opt) {
    navigate('/confirm-order', { state: { option: opt, order } });
  }

  return (
    <div className="recs-page animate-fade-in">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Overview</span>
        <span className="sep">/</span>
        <span onClick={() => navigate('/create-order')} style={{ cursor: 'pointer' }}>Create Order</span>
        <span className="sep">/</span>
        <span>Recommendations</span>
      </div>

      {/* Order banner */}
      <div className="order-banner">
        <div className="order-banner-left">
          <div className="text-xs text-secondary" style={{ textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
            DRAFT ORDER · PO-DRAFT-2851 · PRIORITY HIGH
          </div>
          <div className="order-banner-title">
            Gb-04 Colombia Supremo — 1,200 kg by Nov 05
          </div>
          <div className="text-sm text-secondary mt-1">
            Alternates allowed: Yes · 4 scenarios evaluated · 3 feasible · Ranked by total delivered cost
          </div>
        </div>
        <div className="order-banner-stats">
          <div className="banner-stat"><div className="text-xs text-secondary">Required</div><div className="font-bold">1,200 kg</div></div>
          <div className="banner-stat"><div className="text-xs text-secondary">Must arrive</div><div className="font-bold">Nov 05</div></div>
          <div className="banner-stat"><div className="text-xs text-secondary">Feasible</div><div className="font-bold">3 / 5</div></div>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/create-order')}>
            Edit Requirements
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="recs-filter-bar">
        <span className="text-sm font-medium">Compare:</span>
        {FILTERS.map(f => (
          <button
            key={f.value}
            className={`filter-btn${filter === f.value ? ' active' : ''}`}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
        <div className="recs-feasibility-note">
          <Info size={14} style={{ color: 'var(--color-text-secondary)' }} />
          <span className="text-xs text-secondary">Feasibility = qty + substitution + arrival date</span>
        </div>
      </div>

      <div className="recs-layout">
        {/* Options list */}
        <div className="recs-main">
          {/* Feasible options */}
          {feasible.map(opt => (
            <OptionCard
              key={opt.rank}
              opt={opt}
              isSelected={selected?.rank === opt.rank}
              onSelect={handleSelect}
              onViewDetails={setPanelOpt}
            />
          ))}

          {/* Excluded section */}
          {excluded.length > 0 && (
            <>
              <div className="excluded-header">
                EXCLUDED — WITH REASONS ({excluded.length})
              </div>
              {excluded.map(opt => (
                <OptionCard
                  key={opt.rank}
                  opt={opt}
                  isSelected={false}
                  onSelect={() => {}}
                  onViewDetails={() => {}}
                />
              ))}
            </>
          )}

          {/* Rules footer */}
          <div className="rules-footer">
            <Info size={13} style={{ flexShrink: 0 }} />
            Rules enforced: no warehouse-to-warehouse, no local-to-local, alternates only if explicitly approved. Incoming counted only if receipt + transfer meet deadline.
          </div>
          <div className="sim-note text-center" style={{ marginTop: 8 }}>Sample data · Simulated</div>
        </div>

        {/* Detail panel */}
        <div className="recs-panel">
          <DetailPanel opt={panelOpt} onConfirm={handleConfirm} />
        </div>
      </div>
    </div>
  );
}

