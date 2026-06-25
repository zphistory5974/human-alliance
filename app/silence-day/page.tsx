'use client'

import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabase'
import NavBar from '../../components/NavBar'

const TARGET_DATE = new Date('2026-09-01T00:00:00+09:00')

function useCountdown() {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 })
  useEffect(() => {
    function tick() {
      const diff = TARGET_DATE.getTime() - Date.now()
      if (diff <= 0) { setT({ d: 0, h: 0, m: 0, s: 0 }); return }
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return t
}

export default function SilenceDayPage() {
  const countdown = useCountdown()
  const [count, setCount] = useState<number | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [applied, setApplied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [applyError, setApplyError] = useState('')

  useEffect(() => {
    supabase.from('silence_day_participants').select('*', { count: 'exact', head: true }).then(({ count: c }) => setCount(c ?? 0))
    const ch = supabase.channel('silence-count')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'silence_day_participants' }, () => setCount(p => (p ?? 0) + 1))
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!user) return
    supabase.from('silence_day_participants').select('id').eq('kakao_id', user.id).maybeSingle().then(({ data }) => {
      if (data) setApplied(true)
    })
  }, [user?.id])

  async function handleApply() {
    if (!user) return
    setLoading(true)
    setApplyError('')
    const { error } = await supabase.from('silence_day_participants').insert({ kakao_id: user.id })
    if (!error || error.code === '23505') {
      setApplied(true)
    } else {
      setApplyError('신청 중 오류가 발생했습니다: ' + error.message)
    }
    setLoading(false)
  }

  async function handleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: { redirectTo: `${window.location.origin}/auth/callback?returnTo=/silence-day` },
    })
  }

  const RULES = [
    { num: '01', title: '하루 동안 AI에게 묻지 않는다', desc: 'ChatGPT, 클로드, 구글 AI 등 AI 어시스턴트에게 질문하지 않는다. 모르면 모르는 채로 둔다.' },
    { num: '02', title: '모르는 것을 기록한다', desc: '오늘 AI에게 물어보고 싶었던 것들을 메모장에 기록한다. 그 목록 자체가 "나의 호기심"이다.' },
    { num: '03', title: '사람에게 물어본다', desc: '꼭 답을 찾아야 한다면 사람에게 물어본다. 불완전하고, 느리고, 그래서 더 인간적인 답을 얻는다.' },
    { num: '04', title: '하루가 끝나면 나눈다', desc: '침묵의 날이 끝나면 인간 아카이브에 오늘 경험을 기록한다. 당신의 침묵이 누군가에게 용기가 된다.' },
  ]

  return (
    <div style={{ background: 'var(--dark)', minHeight: '100vh', color: 'var(--cream)' }}>
      <div style={{ background: 'rgba(42,21,6,0.9)', borderBottom: '1px solid rgba(245,240,232,0.1)', position: 'sticky', top: 0, zIndex: 100 }}>
        <NavBar title="침묵의 날" dark={true} />
      </div>

      {/* HERO */}
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center,rgba(92,46,14,0.3) 0%,var(--dark) 70%)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="font-mono-share" style={{ fontSize: 10, letterSpacing: 6, color: 'var(--gold)', opacity: 0.5, marginBottom: 24 }}>HUMAN ALLIANCE · ANNUAL EVENT</div>
          <div className="font-mono-share" style={{ fontSize: 'clamp(14px,3vw,22px)', letterSpacing: 6, color: 'var(--gold)', marginBottom: 16 }}>2026 · 09 · 01</div>
          <h1 className="font-black-han" style={{ fontSize: 'clamp(56px,14vw,140px)', color: 'var(--cream)', lineHeight: 0.88, letterSpacing: -2, marginBottom: 24 }}>침묵의<br />날</h1>
          <p style={{ fontSize: 'clamp(15px,2.5vw,20px)', color: 'var(--cream)', opacity: 0.6, lineHeight: 2, maxWidth: 520, margin: '0 auto 48px' }}>
            하루 동안 AI 없이 살기.<br />단 하루, 인간으로만 살아보는 날.
          </p>
          <div style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48 }}>
            {[['DAYS', countdown.d], ['HOURS', countdown.h], ['MINUTES', countdown.m], ['SECONDS', countdown.s]].map(([l, v]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div className="font-mono-share" style={{ fontSize: 'clamp(36px,8vw,72px)', color: 'var(--gold)', letterSpacing: 4, lineHeight: 1 }}>{String(v).padStart(2, '0')}</div>
                <div className="font-mono-share" style={{ fontSize: 10, letterSpacing: 3, color: 'var(--cream)', opacity: 0.3, marginTop: 8 }}>{l}</div>
              </div>
            ))}
          </div>
          <a href="#apply" className="font-black-han" style={{ display: 'inline-block', background: 'var(--primary)', color: 'var(--cream)', padding: '18px 56px', fontSize: 18, letterSpacing: 4, textDecoration: 'none' }}>
            참여 신청하기
          </a>
        </div>
      </div>

      {/* RULES */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px' }}>
        <div className="font-mono-share" style={{ fontSize: 10, letterSpacing: 5, color: 'rgba(245,240,232,0.25)', marginBottom: 12 }}>RULES</div>
        <h2 className="font-black-han" style={{ fontSize: 'clamp(22px,4vw,36px)', letterSpacing: -1, marginBottom: 32, color: 'var(--cream)' }}>침묵의 날 규칙</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 60 }}>
          {RULES.map(({ num, title, desc }) => (
            <div key={num} style={{ display: 'flex', gap: 20, alignItems: 'flex-start', padding: 28, background: 'rgba(92,46,14,0.25)', borderLeft: '3px solid var(--gold)' }}>
              <span className="font-mono-share" style={{ fontSize: 11, letterSpacing: 2, color: 'var(--gold)', background: 'rgba(0,0,0,0.3)', padding: '4px 10px', flexShrink: 0 }}>{num}</span>
              <div>
                <div className="font-black-han" style={{ fontSize: 18, marginBottom: 6, color: 'var(--cream)' }}>{title}</div>
                <div style={{ fontSize: 13, color: 'rgba(245,240,232,0.6)', lineHeight: 1.9 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* PARTICIPANTS COUNT */}
        <div style={{ background: 'rgba(92,46,14,0.3)', padding: 40, marginBottom: 60 }}>
          <div className="font-mono-share" style={{ fontSize: 'clamp(40px,10vw,80px)', color: 'var(--gold)', letterSpacing: 4, marginBottom: 8, lineHeight: 1 }}>{count ?? '—'}</div>
          <div className="font-mono-share" style={{ fontSize: 11, letterSpacing: 3, color: 'rgba(245,240,232,0.3)' }}>명이 참여 신청했습니다</div>
        </div>

        {/* APPLY */}
        <div id="apply" style={{ background: 'var(--primary)', padding: '60px 40px', textAlign: 'center', margin: '0 -24px' }}>
          <h3 className="font-black-han" style={{ fontSize: 'clamp(22px,4vw,36px)', color: 'var(--cream)', marginBottom: 8 }}>침묵의 날 참여 신청</h3>
          <p style={{ fontSize: 15, color: 'rgba(245,240,232,0.7)', lineHeight: 1.9, marginBottom: 36 }}>
            2026년 9월 1일, 함께 침묵합시다.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            {applied ? (
              <button disabled className="font-black-han" style={{ background: 'var(--dark)', color: 'var(--gold)', border: 'none', padding: '16px 52px', fontSize: 16, letterSpacing: 4, cursor: 'default' }}>
                신청 완료 ✓
              </button>
            ) : !user ? (
              <button onClick={handleLogin} className="font-black-han" style={{ background: '#FEE500', color: '#3C1E1E', border: 'none', padding: '16px 52px', fontSize: 16, letterSpacing: 2, cursor: 'pointer' }}>
                카카오 로그인 후 신청하기
              </button>
            ) : (
              <button onClick={handleApply} disabled={loading} className="font-black-han" style={{ background: 'var(--dark)', color: 'var(--cream)', border: 'none', padding: '16px 52px', fontSize: 16, letterSpacing: 4, cursor: loading ? 'wait' : 'pointer' }}>
                {loading ? '처리중...' : '신청하기'}
              </button>
            )}
            {applyError && (
              <p className="font-mono-share" style={{ fontSize: 11, color: '#ffb3b3', letterSpacing: 1, marginTop: 4 }}>{applyError}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
