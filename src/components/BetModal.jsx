import { useState } from 'react'

export default function BetModal({ open, event, outcome, onClose, onConfirm }) {
  const [amount, setAmount] = useState('10')

  if (!open) return null

  const odds = Number(outcome?.odds || 1)
  const potential = (Number(amount || 0) * odds).toFixed(2)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-slate-900 border border-blue-500/30 rounded-xl p-6 w-[95%] max-w-md">
        <h3 className="text-xl font-semibold text-white mb-1">Place Bet</h3>
        <p className="text-blue-300/70 text-sm mb-4">{event?.title} — {outcome?.name} @ {odds.toFixed(2)}</p>

        <label className="block text-sm text-blue-200 mb-2">Amount</label>
        <input
          type="number"
          min="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full mb-4 px-3 py-2 rounded-md bg-slate-800 border border-blue-500/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        />

        <div className="flex items-center justify-between text-sm mb-4">
          <span className="text-blue-200">Potential payout</span>
          <span className="text-white font-semibold">${potential}</span>
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-slate-700 text-white">Cancel</button>
          <button
            onClick={() => onConfirm(Number(amount))}
            className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
