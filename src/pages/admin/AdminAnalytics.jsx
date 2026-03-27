import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function AdminAnalytics() {
  const [visits, setVisits] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ today: 0, week: 0, month: 0, total: 0 })

  useEffect(() => {
    // Record this admin visit
    recordVisit()
    fetchVisits()
  }, [])

  const recordVisit = async () => {
    try {
      await supabase.from('site_visits').insert([{
        page: window.location.pathname,
        referrer: document.referrer || 'direct',
        user_agent: navigator.userAgent.substring(0, 200),
        visited_at: new Date().toISOString(),
      }])
    } catch (e) {}
  }

  const fetchVisits = async () => {
    setLoading(true)
    try {
      const { data } = await supabase
        .from('site_visits')
        .select('*')
        .order('visited_at', { ascending: false })
        .limit(200)

      if (data) {
        setVisits(data)
        const now = new Date()
        const today = data.filter(v => new Date(v.visited_at).toDateString() === now.toDateString()).length
        const week = data.filter(v => (now - new Date(v.visited_at)) < 7 * 86400000).length
        const month = data.filter(v => (now - new Date(v.visited_at)) < 30 * 86400000).length
        setStats({ today, week, month, total: data.length })
      }
    } catch (e) {}
    setLoading(false)
  }

  // Group by day for chart
  const byDay = {}
  visits.slice(0, 100).forEach(v => {
    const day = new Date(v.visited_at).toLocaleDateString('en-AE', { month: 'short', day: 'numeric' })
    byDay[day] = (byDay[day] || 0) + 1
  })
  const chartData = Object.entries(byDay).slice(0, 7).reverse()
  const maxVal = Math.max(...chartData.map(([, v]) => v), 1)

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '80px', color: 'rgba(250,248,243,0.3)' }}>
      <div style={{ color: 'var(--gold)', fontSize: '16px', letterSpacing: '2px' }}>Loading analytics...</div>
    </div>
  )

  return (
    <div>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '2px', marginBottom: '32px', background: 'rgba(201,168,76,0.06)' }}>
        {[['Today', stats.today], ['This Week', stats.week], ['This Month', stats.month], ['All Time', stats.total]].map(([label, val]) => (
          <div key={label} style={{ background: '#0d0d0d', padding: '28px 32px' }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '44px', fontWeight: 300, color: 'var(--gold)' }}>{val}</div>
            <div style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(250,248,243,0.3)', marginTop: '4px' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      {chartData.length > 0 && (
        <div style={{ background: '#111', border: '1px solid rgba(201,168,76,0.08)', padding: '28px', marginBottom: '32px' }}>
          <div style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '24px' }}>Visits — Last 7 Days</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '120px' }}>
            {chartData.map(([day, count]) => (
              <div key={day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: 500 }}>{count}</div>
                <div style={{ width: '100%', background: 'var(--gold)', height: `${(count / maxVal) * 80}px`, minHeight: '4px', opacity: 0.8, transition: 'height 0.5s' }} />
                <div style={{ fontSize: '9px', color: 'rgba(250,248,243,0.3)', letterSpacing: '1px', whiteSpace: 'nowrap' }}>{day}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent visits table */}
      <div style={{ background: '#111', border: '1px solid rgba(201,168,76,0.08)' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(201,168,76,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold)' }}>Recent Visits</div>
          <button onClick={fetchVisits} style={{ fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(250,248,243,0.4)', background: 'transparent', border: '1px solid rgba(250,248,243,0.1)', padding: '6px 16px', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Refresh</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', padding: '12px 24px', fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(250,248,243,0.25)', borderBottom: '1px solid rgba(201,168,76,0.06)' }}>
          <span>Time</span><span>Page</span><span>Source</span>
        </div>
        {visits.slice(0, 20).map((v, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', padding: '14px 24px', borderBottom: i < 19 ? '1px solid rgba(201,168,76,0.04)' : 'none', alignItems: 'center' }}>
            <div style={{ fontSize: '12px', color: 'rgba(250,248,243,0.5)' }}>
              {new Date(v.visited_at).toLocaleDateString('en-AE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--cream)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{v.page || '/'}</div>
            <div style={{ fontSize: '11px', color: 'rgba(250,248,243,0.35)' }}>{v.referrer === 'direct' ? 'Direct' : v.referrer?.substring(0, 30) || 'Direct'}</div>
          </div>
        ))}
        {visits.length === 0 && (
          <div style={{ padding: '48px', textAlign: 'center', color: 'rgba(250,248,243,0.2)', fontSize: '13px' }}>
            No visits recorded yet. Visits will appear here as people browse the site.
          </div>
        )}
      </div>

      <div style={{ marginTop: '16px', fontSize: '11px', color: 'rgba(250,248,243,0.2)', lineHeight: 1.7 }}>
        ℹ️ For detailed analytics including location data, device type and real-time visitors, connect Google Analytics or Vercel Analytics to your project.
      </div>
    </div>
  )
}
