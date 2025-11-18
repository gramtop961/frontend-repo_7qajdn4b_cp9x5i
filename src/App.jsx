import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import EventCard from './components/EventCard'
import BetModal from './components/BetModal'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function App() {
  const [events, setEvents] = useState([])
  const [bettor, setBettor] = useState(null)
  const [modal, setModal] = useState({ open: false, event: null, outcome: null })
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API}/api/events`)
      if (res.ok) {
        const data = await res.json()
        setEvents(data)
      } else {
        // try seeding
        await fetch(`${API}/api/seed`, { method: 'POST' })
        const retry = await fetch(`${API}/api/events`)
        if (retry.ok) setEvents(await retry.json())
      }
    } catch (e) {
      console.error(e)
    }
  }

  const createBettor = async (displayName) => {
    try {
      const res = await fetch(`${API}/api/bettors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ display_name: displayName })
      })
      const data = await res.json()
      if (res.ok) {
        const profile = await fetch(`${API}/api/bettors/${data.id}`).then(r => r.json())
        setBettor(profile)
      } else {
        alert(data.detail || 'Failed to create bettor')
      }
    } catch (e) {
      alert('Backend not reachable')
    }
  }

  const openBet = (event, outcome) => setModal({ open: true, event, outcome })
  const closeBet = () => setModal({ open: false, event: null, outcome: null })

  const placeBet = async (amount) => {
    if (!bettor) {
      alert('Create a player first')
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/bets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bettor_id: bettor.id,
          event_id: modal.event.id,
          outcome: modal.outcome.name,
          amount: amount
        })
      })
      const data = await res.json()
      if (res.ok) {
        setToast({ type: 'success', message: `Bet placed. Potential payout $${data.potential_payout}` })
        closeBet()
        // refresh bettor balance
        const profile = await fetch(`${API}/api/bettors/${bettor.id}`).then(r => r.json())
        setBettor(profile)
      } else {
        setToast({ type: 'error', message: data.detail || 'Failed to place bet' })
      }
    } catch (e) {
      setToast({ type: 'error', message: 'Backend not reachable' })
    } finally {
      setLoading(false)
      setTimeout(() => setToast(null), 3000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>

      <div className="relative mx-auto max-w-5xl px-6 py-6">
        <Navbar bettor={bettor} onCreateBettor={createBettor} />

        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          {events.length === 0 ? (
            <div className="col-span-2 text-center text-blue-200">No events yet. If this is your first run, they will appear shortly.</div>
          ) : (
            events.map(ev => (
              <EventCard key={ev.id} event={ev} onBet={openBet} />
            ))
          )}
        </div>
      </div>

      <BetModal
        open={modal.open}
        event={modal.event}
        outcome={modal.outcome}
        onClose={closeBet}
        onConfirm={placeBet}
      />

      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded shadow-lg border ${toast.type === 'success' ? 'bg-slate-900/90 border-green-500/40 text-green-200' : 'bg-slate-900/90 border-red-500/40 text-red-200'}`}>
          {toast.message}
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-400 border-t-transparent" />
        </div>
      )}
    </div>
  )
}
