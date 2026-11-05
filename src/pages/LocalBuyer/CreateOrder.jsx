import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, AlertTriangle } from 'lucide-react';
import { GREENS, LOCAL_INVENTORY } from '../../data/mockData';

const PRIORITIES = ['Low', 'Normal', 'High', 'Critical'];

export default function CreateOrder() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    greenId: '',
    quantity: '',
    requiredDate: '',
    priority: 'Normal',
    allowAlternates: 'yes',
    constraints: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  function validate() {
    const errs = {};
    if (!form.greenId) errs.greenId = 'Please select a green bean';
    if (!form.quantity || isNaN(form.quantity) || +form.quantity <= 0) errs.quantity = 'Enter a valid quantity in kg';
    if (!form.requiredDate) errs.requiredDate = 'Required delivery date is needed';
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    setTimeout(() => navigate('/recommendations', { state: { order: form } }), 800);
  }

  const selectedGreen = GREENS.find(g => g.id === form.greenId);
  const localStock = LOCAL_INVENTORY.find(i => i.greenId === form.greenId);
  const available = localStock ? Math.max(0, localStock.onHand - localStock.reserved) : null;

  return (
    <div className="create-order-page animate-fade-in">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Overview</span>
        <span className="sep">/</span>
        <span>Create Order</span>
      </div>

      <div className="create-order-layout">
        {/* Form */}
        <div className="create-order-main">
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">New Fulfillment Request</div>
                <div className="text-xs text-secondary mt-1">
                  All 4 fulfillment scenarios will be evaluated automatically · Simulated data
                </div>
              </div>
              <span className="badge badge-neutral">Draft</span>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit} noValidate>
                <div className="order-form-grid">
                  {/* Green Bean */}
                  <div className="form-group col-span-2">
                    <label className="form-label">
                      Requested Green Bean <span className="required">*</span>
                    </label>
                    <select
                      className={`form-select${errors.greenId ? ' error' : ''}`}
                      value={form.greenId}
                      onChange={e => { set('greenId', e.target.value); setErrors(er => ({ ...er, greenId: '' })); }}
                    >
                      <option value="">Select a green bean…</option>
                      {GREENS.map(g => (
                        <option key={g.id} value={g.id}>
                          {g.id} — {g.name} ({g.grade}, {g.origin})
                        </option>
                      ))}
                    </select>
                    {errors.greenId && <div className="form-error">{errors.greenId}</div>}
                    {selectedGreen && (
                      <div className="form-hint">
                        Processing: {selectedGreen.processing} · Unit cost: ${selectedGreen.unitCost}/kg
                        {available !== null && ` · Local available: ${available.toLocaleString()} kg`}
                      </div>
                    )}
                  </div>

                  {/* Quantity */}
                  <div className="form-group">
                    <label className="form-label">
                      Required Quantity (kg) <span className="required">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      className={`form-input${errors.quantity ? ' error' : ''}`}
                      value={form.quantity}
                      onChange={e => { set('quantity', e.target.value); setErrors(er => ({ ...er, quantity: '' })); }}
                      placeholder="e.g. 1200"
                    />
                    {errors.quantity && <div className="form-error">{errors.quantity}</div>}
                    {form.quantity && available !== null && +form.quantity > available && (
                      <div className="form-hint" style={{ color: 'var(--color-warning)' }}>
                        ⚠ Local available ({available.toLocaleString()} kg) insufficient — central or alternate options will be evaluated
                      </div>
                    )}
                  </div>

                  {/* Required Date */}
                  <div className="form-group">
                    <label className="form-label">
                      Required Delivery Date <span className="required">*</span>
                    </label>
                    <input
                      type="date"
                      className={`form-input${errors.requiredDate ? ' error' : ''}`}
                      value={form.requiredDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={e => { set('requiredDate', e.target.value); setErrors(er => ({ ...er, requiredDate: '' })); }}
                    />
                    {errors.requiredDate && <div className="form-error">{errors.requiredDate}</div>}
                    <div className="form-hint">Hard constraint — options arriving after this date are excluded</div>
                  </div>

                  {/* Priority */}
                  <div className="form-group">
                    <label className="form-label">Priority</label>
                    <div className="priority-selector">
                      {PRIORITIES.map(p => (
                        <button
                          key={p}
                          type="button"
                          className={`priority-btn priority-${p.toLowerCase()}${form.priority === p ? ' active' : ''}`}
                          onClick={() => set('priority', p)}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Allow Alternates */}
                  <div className="form-group">
                    <label className="form-label">Allow Approved Alternates?</label>
                    <div className="toggle-group">
                      <button
                        type="button"
                        className={`toggle-btn${form.allowAlternates === 'yes' ? ' active' : ''}`}
                        onClick={() => set('allowAlternates', 'yes')}
                      >
                        Yes — evaluate approved alternates
                      </button>
                      <button
                        type="button"
                        className={`toggle-btn${form.allowAlternates === 'no' ? ' active active-no' : ''}`}
                        onClick={() => set('allowAlternates', 'no')}
                      >
                        No — exact match only
                      </button>
                    </div>
                    {form.allowAlternates === 'yes' && selectedGreen?.alternates?.length > 0 && (
                      <div className="form-hint">
                        Approved alternates: {selectedGreen.alternates.join(', ')} · One-way substitution applies
                      </div>
                    )}
                    {form.allowAlternates === 'yes' && selectedGreen && selectedGreen.alternates?.length === 0 && (
                      <div className="form-hint" style={{ color: 'var(--color-warning)' }}>
                        No approved alternates configured for this green
                      </div>
                    )}
                  </div>

                  {/* Constraints */}
                  <div className="form-group col-span-2">
                    <label className="form-label">Business / Quality Constraints</label>
                    <input
                      type="text"
                      className="form-input"
                      value={form.constraints}
                      onChange={e => set('constraints', e.target.value)}
                      placeholder="e.g. Must be lot-certified, no blending, cup-score ≥ 83…"
                    />
                  </div>

                  {/* Notes */}
                  <div className="form-group col-span-2">
                    <label className="form-label">Notes</label>
                    <textarea
                      className="form-textarea"
                      rows={3}
                      value={form.notes}
                      onChange={e => set('notes', e.target.value)}
                      placeholder="Optional context for this order…"
                    />
                  </div>
                </div>

                {/* Business Rules Notice */}
                <div className="rules-notice">
                  <Info size={14} style={{ flexShrink: 0, color: 'var(--color-info)' }} />
                  <div className="text-xs text-secondary">
                    <strong>Business rules applied automatically:</strong> No local-to-local or warehouse-to-warehouse transfers.
                    Alternates only when explicitly approved in catalogue. Incoming stock counts only if receipt + transfer meet your deadline.
                    Single-source rule — no split orders.
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
                    {submitting ? 'Finding options…' : '⚡ Find Best Fulfillment Options'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Sidebar info panel */}
        <div className="create-order-sidebar">
          <div className="card">
            <div className="card-header"><div className="card-title">Evaluation Process</div></div>
            <div className="card-body">
              <div className="eval-steps">
                {[
                  { n: 1, label: 'Local exact match', desc: 'Check same green at your site' },
                  { n: 2, label: 'Local approved alternates', desc: 'Check approved subs at your site' },
                  { n: 3, label: 'Central exact match', desc: 'Check all 3 central warehouses' },
                  { n: 4, label: 'Central approved alternates', desc: 'Check approved subs at warehouses' },
                  { n: 5, label: 'Rank by total cost', desc: 'Lowest delivered cost wins' },
                ].map(s => (
                  <div key={s.n} className="eval-step">
                    <div className="eval-step-n">{s.n}</div>
                    <div>
                      <div className="text-sm font-semibold">{s.label}</div>
                      <div className="text-xs text-secondary">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-xs text-secondary mt-4" style={{ padding: '8px 12px', background: 'var(--color-lavender-bg)', borderRadius: 6 }}>
                Delivery date is a hard constraint. Options that cannot arrive on time are excluded and shown with reasons.
              </div>
            </div>
          </div>

          {selectedGreen && (
            <div className="card">
              <div className="card-header"><div className="card-title">Selected Green Info</div></div>
              <div className="card-body">
                <div className="green-info-row"><span className="text-secondary text-sm">ID</span><span className="font-medium">{selectedGreen.id}</span></div>
                <div className="green-info-row"><span className="text-secondary text-sm">Name</span><span className="font-medium">{selectedGreen.name}</span></div>
                <div className="green-info-row"><span className="text-secondary text-sm">Grade</span><span className="font-medium">{selectedGreen.grade}</span></div>
                <div className="green-info-row"><span className="text-secondary text-sm">Origin</span><span className="font-medium">{selectedGreen.origin}</span></div>
                <div className="green-info-row"><span className="text-secondary text-sm">Processing</span><span className="font-medium">{selectedGreen.processing}</span></div>
                <div className="green-info-row"><span className="text-secondary text-sm">Unit cost</span><span className="font-semibold">${selectedGreen.unitCost}/kg</span></div>
                {available !== null && (
                  <div className="green-info-row">
                    <span className="text-secondary text-sm">Local available</span>
                    <span className="font-semibold" style={{ color: available > 0 ? 'var(--color-success)' : 'var(--color-critical)' }}>
                      {available.toLocaleString()} kg
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

