export default function EventCard({ event, onBet }) {
  return (
    <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-5 hover:border-blue-400/40 transition">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-blue-300/60">{event.category}</p>
          <h3 className="text-lg font-semibold text-white">{event.title}</h3>
          <p className="text-xs text-blue-300/60">{new Date(event.start_time).toLocaleString()}</p>
        </div>
        <span className="text-xs px-2 py-1 rounded bg-slate-700/80 text-blue-200 border border-blue-500/20">
          {event.status}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {event.outcomes?.map((o) => (
          <button
            key={o.name}
            onClick={() => onBet(event, o)}
            disabled={event.status !== 'open'}
            className="text-left bg-slate-900/40 hover:bg-slate-900/70 disabled:opacity-50 border border-blue-500/20 hover:border-blue-400/40 rounded-lg p-3"
          >
            <p className="text-blue-200 text-sm">{o.name}</p>
            <p className="text-white font-bold">{Number(o.odds).toFixed(2)}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
