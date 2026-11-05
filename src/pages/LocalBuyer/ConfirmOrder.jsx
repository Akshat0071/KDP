import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, AlertTriangle } from 'lucide-react';

export default function ConfirmOrder() {
  const navigate = useNavigate();
  const location = useLocation();
  const { option, order } = location.state || {};
  const [ackAlt, setAckAlt] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  if (!option) {
    return (
      <div className="confirm-page">
        <div className="empty-state">
          <h3>No option selected</h3>
          <p>Please go back and select a fulfillment option.</p>
          <button className="btn btn-primary mt-4" onClick={() => navigate('/recommendations')}>Back to Recommendations</button>
        </div>
      </div>
    );
  }

  if (confirmed) {
    return (
      <div className="confirm-page animate-fade-in">
        <div className="confirm-success">
          <CheckCircle size={48} style={{ color: 'var(--color-success)' }} />
          <h2>Order Confirmed</h2>
          <p>PO-2851 has been created successfully. The fulfillment team will process the transfer.</p>
          <div className="confirm-success-details">
            <div className="detail-row"><span>Order ID</span><strong>PO-2851</strong></div>
            <div className="detail-row"><span>Green</span><strong>{option.greenName}</strong></div>
            <div className="detail-row"><span>Source</span><strong>{option.source}</strong></div>
            <div className="detail-row"><span>Quantity</span><strong>1,200 kg</strong></div>
            <div className="detail-row"><span>Expected arrival</span><strong>{option.arrivalDate}</strong></div>
            <div className="detail-row"><span>Estimated total</span><strong>${option.totalDelivered?.toLocaleString()}</strong></div>
          </div>
          <div className="flex gap-3 mt-6">
            <button className="btn btn-secondary" onClick={() => navigate('/orders')}>View Orders</button>
            <button className="btn btn-primary" onClick={() => navigate('/transfers')}>Track Transfer</button>
          </div>
          <div className="sim-note mt-4">Simulated · All estimates — final invoice may vary</div>
        </div>
      </div>
    );
  }

  const canConfirm = !option.isAlternate || ackAlt;
  const bd = option.costBreakdown || {};

  return (
    <div className="confirm-page animate-fade-in">
      <div className="breadcrumb">
        <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Overview</span>
        <span className="sep">/</span>
        <span onClick={() => navigate('/recommendations')} style={{ cursor: 'pointer' }}>Recommendations</span>
        <span className="sep">/</span>
        <span>Confirm Order</span>
      </div>

      <h1 className="page-title mb-6">Review & Confirm Order</h1>

      <div className="confirm-layout">
        <div className="confirm-main">
          {/* Order Summary */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Order Summary</div>
              <span className="badge badge-neutral">Draft · PO-DRAFT-2851</span>
            </div>
            <div className="card-body">
              <div className="confirm-rows">
                <div className="detail-row"><span className="text-secondary">Requested green</span><strong>Gb-04 — Colombia Supremo</strong></div>
                <div className="detail-row"><span className="text-secondary">Selected green</span>
                  <strong>{option.greenId} — {option.greenName}
                    {option.isAlternate && <span className="badge badge-warning" style={{ marginLeft: 8 }}>Alternate</span>}
                  </strong>
                </div>
                <div className="detail-row"><span className="text-secondary">Source</span><strong>{option.source}</strong></div>
                <div className="detail-row"><span className="text-secondary">Quantity</span><strong>1,200 kg</strong></div>
                <div className="detail-row"><span className="text-secondary">Required by</span><strong>Nov 05, 2026</strong></div>
                <div className="detail-row"><span className="text-secondary">Expected arrival</span>
                  <strong style={{ color: 'var(--color-success)' }}>{option.arrivalDate} ✓ before deadline</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="card">
            <div className="card-header"><div className="card-title">Cost Breakdown</div></div>
            <div className="card-body">
              <div className="confirm-cost-table">
                <div className="detail-row"><span className="text-secondary">Bean cost (1,200 kg × ${option.perKg})</span><strong>${bd.bean?.toLocaleString() || '—'}</strong></div>
                <div className="detail-row"><span className="text-secondary">Local handling + QA</span><strong>${bd.handling?.toLocaleString() || '—'}</strong></div>
                <div className="detail-row"><span className="text-secondary">Internal transfer</span><strong>${bd.transfer?.toLocaleString() || '$0'}</strong></div>
                {bd.expedite > 0 && <div className="detail-row"><span className="text-secondary">Expedite / pallet fee</span><strong>${bd.expedite?.toLocaleString()}</strong></div>}
                <div className="divider" />
                <div className="detail-row cost-total-row"><span className="font-semibold">Estimated total</span><strong style={{ fontSize: 20 }}>${option.totalDelivered?.toLocaleString()}</strong></div>
                <div className="detail-row"><span className="text-secondary">Cost per kg</span><strong>${option.perKg}/kg</strong></div>
              </div>
              <div className="sim-note mt-3">Simulated estimate · Final invoice may vary based on actual weights and handling</div>
            </div>
          </div>

          {/* Alternate Warning */}
          {option.isAlternate && (
            <div className="card">
              <div className="card-header">
                <div className="card-title" style={{ color: 'var(--color-warning)' }}>
                  <AlertTriangle size={16} style={{ display: 'inline', marginRight: 8 }} />
                  Substitution Acknowledgement Required
                </div>
              </div>
              <div className="card-body">
                <p className="text-sm text-secondary mb-4">
                  This order uses an approved alternate green ({option.greenId} — {option.greenName}) instead of the originally requested Gb-04 — Colombia Supremo.
                  This is a one-way substitution relationship. Roast profile R-22 applies. Cup-score 83.5 vs 84.0 — within approved tolerance.
                </p>
                <label className="ack-label">
                  <input type="checkbox" checked={ackAlt} onChange={e => setAckAlt(e.target.checked)} />
                  <span>I acknowledge this order uses an approved substitute green and understand the quality implications.</span>
                </label>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="confirm-actions">
            <button className="btn btn-secondary btn-lg" onClick={() => navigate('/recommendations')}>← Back to Options</button>
            <button
              className="btn btn-primary btn-lg"
              disabled={!canConfirm}
              onClick={() => setConfirmed(true)}
            >
              Confirm Order — ${option.totalDelivered?.toLocaleString()}
            </button>
          </div>
        </div>

        {/* Side summary */}
        <div className="confirm-sidebar">
          <div className="card">
            <div className="card-header"><div className="card-title">Selected Option</div></div>
            <div className="card-body">
              <div className="badge badge-recommended mb-4">{option.scenario}</div>
              <div className="font-bold" style={{ fontSize: 'var(--font-size-xl)' }}>{option.greenName}</div>
              <div className="text-xs text-secondary mb-4">{option.source}</div>
              <div className="detail-row"><span className="text-xs text-secondary">Total cost</span><strong>${option.totalDelivered?.toLocaleString()}</strong></div>
              <div className="detail-row"><span className="text-xs text-secondary">Per kg</span><strong>${option.perKg}/kg</strong></div>
              <div className="detail-row"><span className="text-xs text-secondary">Arrival</span><strong>{option.arrivalDate}</strong></div>
              {option.savingsVsBaseline > 0 && (
                <div className="saving-pill">💰 ${option.savingsVsBaseline.toLocaleString()} est. savings</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

