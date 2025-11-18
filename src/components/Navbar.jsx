import { useState } from 'react'

export default function Navbar({ bettor, onCreateBettor }) {
  const [name, setName] = useState('')

  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-3">
        <img src="/flame-icon.svg" alt="logo" className="w-8 h-8" />
        <span className="text-xl font-semibold text-white">FlamesBet</span>
      </div>

      {bettor ? (
        <div className="flex items-center gap-4 text-sm">
          <span className="text-blue-200">Player: <span className="text-white font-medium">{bettor.display_name}</span></span>
          <span className="text-blue-200">Balance: <span className="text-green-400 font-semibold">${Number(bettor.balance || 0).toFixed(2)}</span></span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter a display name"
            className="px-3 py-2 rounded-md bg-slate-800/70 border border-blue-500/30 text-white placeholder:text-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
          <button
            onClick={() => name.trim() && onCreateBettor(name.trim())}
            className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white transition"
          >
            Start
          </button>
        </div>
      )}
    </div>
  )
}
