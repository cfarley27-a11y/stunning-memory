import { computeMetrics } from '../metrics.js';

function Stat({ label, value, hint }) {
  return (
    <div className="stat">
      <div className="stat-value">{value === null ? '—' : `${value}%`}</div>
      <div className="stat-label">{label}</div>
      {hint && <div className="stat-hint">{hint}</div>}
    </div>
  );
}

export default function StatsBar({ applications }) {
  const m = computeMetrics(applications);

  if (m.total === 0) return null;

  return (
    <div className="stats-bar">
      <div className="stat">
        <div className="stat-value">{m.total}</div>
        <div className="stat-label">Total Applications</div>
      </div>
      <Stat label="Response Rate" value={m.responseRate} hint="Moved past Applied" />
      <Stat label="Interview Rate" value={m.interviewRate} hint="Reached an interview" />
      <Stat label="Offer Rate" value={m.offerRate} hint="Of all applications" />
      <Stat label="Win Rate" value={m.winRate} hint="Of decided outcomes" />
    </div>
  );
}
