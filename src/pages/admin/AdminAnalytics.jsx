import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

function parseUserAgent(ua) {
  if (!ua) return { browser: 'Unknown', os: 'Unknown', device: 'Desktop' }
  
  // Device
  let device = 'Desktop'
  if (/Mobile|Android|iPhone|iPad|iPod/i.test(ua)) {
    device = /iPad|Tablet/i.test(ua) ? 'Tablet' : 'Mobile'
  }

  // Browser
  let browser = 'Other'
  if (/Chrome\/[0-9]/.test(ua) && !/Edg\/|OPR\//.test(ua)) browser = 'Chrome'
  else if (/Firefox\/[0-9]/.test(ua)) browser = 'Firefox'
  else if (/Safari\/[0-9]/.test(ua) && !/Chrome/.test(ua)) browser = 'Safari'
  else if (/Edg\/[0-9]/.test(ua)) browser = 'Edge'
  else if (/OPR\/[0-9]/.test(ua)) browser = 'Opera'

  // OS
  let os = 'Other'
  if (/Windows NT/.test(ua)) os = 'Windows'
  else if (/Mac OS X/.test(ua) && !/iPhone|iPad/.test(ua)) os = 'macOS'
  else if (/iPhone/.test(ua)) os = 'iOS'
  else if (/iPad/.test(ua)) os = 'iPadOS'
  else if (/Android/.test(ua)) os = 'Android'
  else if (/Linux/.test(ua)) os = 'Linux'

  return { browser, os, device }
}

function StatCard({ label, value, sub }) {
  return (
    <div style={{ background: '#0d0d0d', padding: '24px 28px' }}>
      <div style={{ fontFamily: 'var(--font-serif)', fontSize: '40px', fontWeight: 300, color: 'var(--gold)', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(250,248,243,0.3)', marginTop: '6px' }}>{label}</div>
      {sub && <div style={{ fontSize: '11px', color: 'rgba(250,248,243,0.2)', marginTop: '4px' }}>{sub}</div>}
    </div>
  )
}

function BarList({ title, data, total }) {
  return (
    <div style={{ background: '#111', border: '1px solid rgba(201,168,76,0.08)', padding: '24px' }}>
      <div style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '20px' }}>{title}</div>
      {data.length === 0 && <div style={{ fontSize: '12px', color: 'rgba(250,248,243,0.2)' }}>No data yet</div>}
      {data.map(([label, count]) => (
        <div key={label} style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '12px', color: 'rgba(250,248,243,0.7)' }}>{label}</span>
            <span style={{ fontSize: '12px', color: 'var(--gold)', fontWeight: 500 }}>{count}</span>
          </div>
          <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
            <div style={{ height: '4px', background: 'var(--gold)', borderRadius: '2px', width: `${Math.round((count / total) * 100)}%`, opacity: 0.7 }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function AdminAnalytics() {
  const [visits, setVisits] = useState([])
  const [loading, setLoading] = useState(true)
  const [timeFilter, setTimeFilter] = useState('7d')

  useEffect(() => { fetchVisits() }, [timeFilter])

  const fetchVisits = async () => {
    setLoading(true)
    let query = supabase.from('site_visits').select('*').order('visited_at', { ascending: false })
    
    const now = new Date()
    if (timeFilter === '1d') query = query.gte('visited_at', new Date(now - 86400000).toISOString())
    else if (timeFilter === '7d') query = query.gte('visited_at', new Date(now - 7*86400000).toISOString())
    else if (timeFilter === '30d') query = query.gte('visited_at', new Date(now - 30*86400000).toISOString())

    const { data } = await query.limit(500)
    if (data) setVisits(data)
    setLoading(false)
  }

  // Compute stats
  const now = new Date()
  const today = visits.filter(v => new Date(v.visited_at).toDateString() === now.toDateString()).length
  const unique = new Set(visits.map(v => v.user_agent?.substring(0, 50))).size

  // Parse user agents
  const parsed = visits.map(v => ({ ...v, ...parseUserAgent(v.user_agent) }))

  // Aggregate helpers
  const countBy = (arr, key) => {
    const map = {}
    arr.forEach(v => { map[v[key]] = (map[v[key]] || 0) + 1 })
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 6)
  }

  // Top pages
  const pageMap = {}
  visits.forEach(v => { const p = v.page || '/'; pageMap[p] = (pageMap[p] || 0) + 1 })
  const topPages = Object.entries(pageMap).sort((a, b) => b[1] - a[1]).slice(0, 8)

  // By day for chart
  const byDay = {}
  visits.forEach(v => {
    const day = new Date(v.visited_at).toLocaleDateString('en-AE', { month: 'short', day: 'numeric' })
    byDay[day] = (byDay[day] || 0) + 1
  })
  const chartDays = Object.entries(byDay).slice(0, 10).reverse()
  const maxDay = Math.max(...chartDays.map(([, v]) => v), 1)

  // Source
  const sourceMap = {}
  visits.forEach(v => {
    let src = 'Direct'
    if (v.referrer && v.referrer !== 'direct') {
      try { src = new URL(v.referrer).hostname.replace('www.', '') } catch { src = 'Other' }
    }
    sourceMap[src] = (sourceMap[src] || 0) + 1
  })
  const topSources = Object.entries(sourceMap).sort((a, b) => b[1] - a[1]).slice(0, 6)

  const deviceData = countBy(parsed, 'device')
  const browserData = countBy(parsed, 'browser')
  const osData = countBy(parsed, 'os')

  const FILTERS = [['1d', 'Today'], ['7d', '7 Days'], ['30d', '30 Days'], ['all', 'All Time']]

  if (loading) return <div style={{ textAlign: 'center', padding: '80px', color: 'var(--gold)', letterSpacing: '2px' }}>Loading analytics...</div>

  return (
    <div>
      {/* Vercel Analytics link */}
      <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)', padding: '14px 20px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '2px' }}>
        <div>
          <div style={{ fontSize: '12px', color: 'var(--gold)', fontWeight: 500, marginBottom: '3px' }}>✦ Vercel Analytics — Country, Real-time & Advanced Data</div>
          <div style={{ fontSize: '11px', color: 'rgba(250,248,243,0.4)' }}>Full analytics with country, city, real-time visitors and more on your Vercel dashboard</div>
        </div>
        <a href="https://vercel.com/hansels-projects-172c9842/angelina-store/analytics" target="_blank" rel="noreferrer"
          style={{ padding: '8px 20px', background: 'var(--gold)', color: 'var(--black)', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>
          Open Vercel Analytics ↗
        </a>
      </div>

      {/* Time filter */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {FILTERS.map(([val, label]) => (
          <button key={val} onClick={() => setTimeFilter(val)}
            style={{ padding: '8px 20px', border: '1px solid', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'var(--font-sans)', background: timeFilter === val ? 'var(--gold)' : 'transparent', color: timeFilter === val ? 'var(--black)' : 'rgba(250,248,243,0.4)', borderColor: timeFilter === val ? 'var(--gold)' : 'rgba(201,168,76,0.2)' }}>
            {label}
          </button>
        ))}
        <button onClick={fetchVisits} style={{ marginLeft: 'auto', padding: '8px 16px', background: 'transparent', border: '1px solid rgba(250,248,243,0.1)', color: 'rgba(250,248,243,0.4)', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>↻ Refresh</button>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1px', background: 'rgba(201,168,76,0.08)', marginBottom: '24px' }}>
        <StatCard label="Total Visits" value={visits.length} />
        <StatCard label="Today" value={today} />
        <StatCard label="Unique Sessions" value={unique} sub="Estimated" />
        <StatCard label="Avg per Day" value={chartDays.length > 0 ? Math.round(visits.length / Math.max(chartDays.length, 1)) : 0} />
      </div>

      {/* Bar chart */}
      {chartDays.length > 0 && (
        <div style={{ background: '#111', border: '1px solid rgba(201,168,76,0.08)', padding: '24px', marginBottom: '24px' }}>
          <div style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '24px' }}>Visits Over Time</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '140px' }}>
            {chartDays.map(([day, count]) => (
              <div key={day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: 500 }}>{count}</div>
                <div style={{ width: '100%', background: 'var(--gold)', height: `${Math.max((count / maxDay) * 100, 4)}px`, opacity: 0.75, borderRadius: '2px 2px 0 0' }} />
                <div style={{ fontSize: '9px', color: 'rgba(250,248,243,0.3)', letterSpacing: '0.5px', whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: '100%', textAlign: 'center' }}>{day}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3 column breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <BarList title="Device Type" data={deviceData} total={visits.length} />
        <BarList title="Browser" data={browserData} total={visits.length} />
        <BarList title="Operating System" data={osData} total={visits.length} />
      </div>

      {/* Top pages + Sources */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <BarList title="Top Pages" data={topPages} total={visits.length} />
        <BarList title="Traffic Source" data={topSources} total={visits.length} />
      </div>

      {/* Recent visits table */}
      <div style={{ background: '#111', border: '1px solid rgba(201,168,76,0.08)' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(201,168,76,0.08)', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold)' }}>Recent Visits</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr', padding: '12px 24px', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(250,248,243,0.25)', borderBottom: '1px solid rgba(201,168,76,0.06)' }}>
          <span>Time</span><span>Page</span><span>Device</span><span>Browser</span><span>Source</span>
        </div>
        {visits.slice(0, 25).map((v, i) => {
          const { browser, os, device } = parseUserAgent(v.user_agent)
          let src = 'Direct'
          if (v.referrer && v.referrer !== 'direct') {
            try { src = new URL(v.referrer).hostname.replace('www.', '') } catch { src = 'Other' }
          }
          const deviceIcon = device === 'Mobile' ? '📱' : device === 'Tablet' ? '📟' : '💻'
          return (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr', padding: '12px 24px', borderBottom: i < 24 ? '1px solid rgba(201,168,76,0.04)' : 'none', alignItems: 'center' }}>
              <div style={{ fontSize: '11px', color: 'rgba(250,248,243,0.5)' }}>
                {new Date(v.visited_at).toLocaleDateString('en-AE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--cream)', fontFamily: 'monospace' }}>{v.page || '/'}</div>
              <div style={{ fontSize: '11px', color: 'rgba(250,248,243,0.5)' }}>{deviceIcon} {device}</div>
              <div style={{ fontSize: '11px', color: 'rgba(250,248,243,0.5)' }}>{browser} / {os}</div>
              <div style={{ fontSize: '11px', color: 'rgba(250,248,243,0.35)' }}>{src}</div>
            </div>
          )
        })}
        {visits.length === 0 && <div style={{ padding: '48px', textAlign: 'center', color: 'rgba(250,248,243,0.2)', fontSize: '13px' }}>No visits recorded yet.</div>}
      </div>

      <div style={{ marginTop: '16px', padding: '14px 16px', background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.08)', fontSize: '11px', color: 'rgba(250,248,243,0.3)', lineHeight: 1.7 }}>
        ℹ️ For country & city data, real-time visitors, and advanced funnels — click "Open Vercel Analytics" above. It's free and already enabled on your site.
      </div>
    </div>
  )
}
