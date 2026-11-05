import { useNavigate } from 'react-router-dom';
import { AlertTriangle, XCircle, Info, Clock, CheckCircle } from 'lucide-react';
import { ALERTS } from '../../data/mockData';

const SEV_ICONS = {
  critical: <XCircle size={16} style={{ color: 'var(--color-critical)' }} />,
  warning: <AlertTriangle size={16} style={{ color: 'var(--color-warning)' }} />,
  info: <Info size={16} style={{ color: 'var(--color-info)' }} />,
};

const SEV_BG = {
  critical: 'var(--color-critical-bg)',
  warning: 'var(--color-warning-bg)',
  info: 'var(--color-info-bg)',
};

export default function AlertsActivity() {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1000 }} className="animate-fade-in">
      <div className="breadcrumb">
        <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Overview</span>
        <span className="sep">/</span>
        <span>Alerts & Activity</span>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="page-title">Alerts & Activity</h1>
        <div className="flex gap-2">
          <span className="badge badge-critical">{ALERTS.filter(a => a.severity === 'critical').length} Critical</span>
          <span className="badge badge-warning">{ALERTS.filter(a => a.severity === 'warning').length} Warning</span>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Active Alerts</div>
          <div className="text-xs text-secondary">Navigate directly from any alert to the affected item</div>
        </div>
        <div>
          {ALERTS.map(alert => (
            <div
              key={alert.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 16,
                padding: '16px 20px',
                borderBottom: '1px solid var(--color-border)',
                background: 'transparent',
                transition: 'background var(--transition-fast)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = SEV_BG[alert.severity]}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ marginTop: 2 }}>{SEV_ICONS[alert.severity]}</div>
              <div style={{ flex: 1 }}>
                <div className="font-medium text-sm" style={{ marginBottom: 4 }}>{alert.message}</div>
                <div className="text-xs text-secondary">
                  {new Date(alert.timestamp).toLocaleString('en-US', {
                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                  &nbsp;·&nbsp;{alert.type.replace(/_/g, ' ')}
                </div>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => navigate(alert.actionLink)}
              >
                {alert.action} →
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Recent Activity</div>
        </div>
        <div className="card-body">
          {[
            { icon: <CheckCircle size={14} />, color: 'var(--color-success)', text: 'PO-2838 marked Received — Gc-11 2,000 kg', time: '2h ago' },
            { icon: <Clock size={14} />, color: 'var(--color-info)', text: 'Transfer TR-501 dispatched from WH-02 Dallas', time: '4h ago' },
            { icon: <AlertTriangle size={14} />, color: 'var(--color-warning)', text: 'Gf-22 stock fell below 2,000 kg threshold', time: '6h ago' },
            { icon: <XCircle size={14} />, color: 'var(--color-critical)', text: 'PO-2839 evaluation: no feasible option found', time: '8h ago' },
            { icon: <CheckCircle size={14} />, color: 'var(--color-success)', text: 'Gc-14 approved as alternate to Gb-04 in Catalogue', time: '1d ago' },
          ].map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ color: a.color }}>{a.icon}</span>
              <span className="text-sm" style={{ flex: 1 }}>{a.text}</span>
              <span className="text-xs text-secondary">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="sim-note">Sample data · Simulated</div>
    </div>
  );
}

