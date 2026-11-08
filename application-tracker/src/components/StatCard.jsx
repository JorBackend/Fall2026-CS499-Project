export default function StatCard({ label, value, detail, tone = 'blue', icon, variant = 'fill' }) {
  return (
    <article className={`stat-card ${variant} tone-${tone}`}>
      <div className="stat-label-row">
        {icon && <span className={`icon-chip tone-${tone}`}>{icon}</span>}
        <p className="stat-label">{label}</p>
      </div>
      <p className={variant === 'feature' ? 'stat-feature' : 'stat-value'}>{value}</p>
      {detail && <p className="stat-detail">{detail}</p>}
    </article>
  )
}
