'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'
import { createClient, supabase } from '../lib/supabase'

export default function Home() {
  const [count, setCount] = useState<number | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [sessionLoading, setSessionLoading] = useState(true)

  useEffect(() => {
    const sb = createClient()
    sb.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setSessionLoading(false)
    })
    const { data: { subscription } } = sb.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleLogin() {
    const sb = createClient()
    await sb.auth.signInWithOAuth({
      provider: 'kakao',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  async function logout() {
    const sb = createClient()
    await sb.auth.signOut()
    setUser(null)
  }

  useEffect(() => {
    supabase.from('oath_signers').select('*', { count: 'exact', head: true }).then(({ count: c }) => setCount(c ?? 0))
    const ch = supabase.channel('oath-count')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'oath_signers' }, () => setCount(p => (p ?? 0) + 1))
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [])

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.fade-up').forEach(el => observerRef.current?.observe(el))
    return () => observerRef.current?.disconnect()
  }, [])

  const pct = Math.min(((count ?? 0) / 500) * 100, 100)

  const STATS = [
    { label: '설립연도', value: '2026', unit: '' },
    { label: '서약 회원', value: count === null ? '—' : String(count), unit: '명' },
    { label: '참여 국가', value: '12', unit: '개국' },
    { label: '무료 멤버 한도', value: '500', unit: '명' },
  ]

  const PROJECTS = [
    { code: 'HA-001', name: 'Human First 서약', desc: '최초 500명 무료. 인증서 + 배지 발급.', href: '/oath', status: '운영 중' },
    { code: 'HA-002', name: '인간 아카이브', desc: 'AI가 이해 못할 인간적 순간들을 기록합니다.', href: '/archive', status: '운영 중' },
    { code: 'HA-003', name: '아돈노 굿즈', desc: '"모른다"는 것을 자랑스럽게. 선착순 500개.', href: '/goods', status: '운영 중' },
    { code: 'HA-004', name: '인간연합 강의', desc: 'AI 시대에 모르는 것과 함께 사는 법.', href: '/lecture', status: '준비 중' },
    { code: 'HA-005', name: '침묵의 날', desc: '하루 동안 AI 없이. 2026 · 09 · 01.', href: '/silence-day', status: '준비 중' },
    { code: 'HA-006', name: '웹소설 시즌 1', desc: '2045년 인간이 멸종하는 법 — 6화.', href: '/novel', status: '운영 중' },
  ]

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text)' }}>

      {/* FREE MEMBER BANNER */}
      <div style={{ background: 'var(--gold)', padding: '9px clamp(16px,4vw,40px)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
        <span className="font-mono-share" style={{ fontSize: 10, letterSpacing: 4, color: '#111', fontWeight: 700 }}>✦ 현재 무료 가입 기간 — 최초 500명 한정 FREE MEMBERSHIP ✦</span>
        <span className="font-mono-share" style={{ fontSize: 9, letterSpacing: 2, color: 'rgba(0,0,0,0.55)' }}>500명 이후 가입비: $9.99 · Stripe 결제 연동 예정</span>
      </div>

      {/* TOP BAR */}
      <div className="hide-mobile" style={{ background: 'var(--primary)', height: 36, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 clamp(16px,4vw,40px)', gap: 24 }}>
        {!sessionLoading && (user ? (
          <>
            <span className="font-mono-share" style={{ fontSize: 10, letterSpacing: 2, color: 'rgba(245,240,232,0.6)' }}>{user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? user?.email ?? ''}</span>
            <button onClick={logout} className="font-mono-share" style={{ background: 'none', border: 'none', fontSize: 10, letterSpacing: 2, color: 'rgba(245,240,232,0.45)', cursor: 'pointer', padding: 0 }}>로그아웃</button>
          </>
        ) : (
          <button onClick={handleLogin} className="font-mono-share" style={{ background: 'none', border: 'none', fontSize: 10, letterSpacing: 2, color: 'rgba(245,240,232,0.5)', cursor: 'pointer', padding: 0 }}>카카오 로그인</button>
        ))}
        <Link href="/about" className="font-mono-share" style={{ fontSize: 10, letterSpacing: 2, color: 'rgba(245,240,232,0.4)', textDecoration: 'none' }}>ABOUT</Link>
        <Link href="/organization" className="font-mono-share" style={{ fontSize: 10, letterSpacing: 2, color: 'rgba(245,240,232,0.4)', textDecoration: 'none' }}>조직도</Link>
      </div>

      {/* MAIN NAV */}
      <nav style={{
        position: 'sticky', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'var(--dark)', borderBottom: '3px solid var(--primary)',
      }}>
        {/* org name bar */}
        <div style={{ borderBottom: '1px solid rgba(245,240,232,0.08)', padding: '14px clamp(16px,4vw,40px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'baseline', gap: 16 }}>
            <span className="font-black-han" style={{ fontSize: 22, color: 'var(--cream)', letterSpacing: 1 }}>인간연합</span>
            <span className="font-mono-share" style={{ fontSize: 11, letterSpacing: 4, color: 'var(--gold)', opacity: 0.5 }}>HUMAN ALLIANCE</span>
          </Link>
          <Link href="/oath" className="font-black-han" style={{ background: 'var(--primary)', color: 'var(--cream)', padding: '8px 24px', fontSize: 12, letterSpacing: 3, textDecoration: 'none' }}>
            서약하기
          </Link>
        </div>
        {/* menu bar */}
        <div style={{ padding: '0 clamp(8px,2vw,40px)', display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto' }}>
          {([['서약', '/oath'], ['아카이브', '/archive'], ['굿즈', '/goods'], ['강의', '/lecture'], ['침묵의날', '/silence-day'], ['소설', '/novel']] as [string, string][]).map(([l, h]) => (
            <Link key={h} href={h} className="font-mono-share" style={{ fontSize: 11, letterSpacing: 3, color: 'rgba(245,240,232,0.45)', textDecoration: 'none', padding: '12px 20px', display: 'block', textTransform: 'uppercase', whiteSpace: 'nowrap', borderRight: '1px solid rgba(245,240,232,0.05)' }}>
              {l}
            </Link>
          ))}
        </div>
      </nav>

      {/* OFFICIAL BANNER */}
      <section style={{ background: 'var(--dark)', padding: 'clamp(48px,7vw,80px) clamp(16px,4vw,40px) 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: `repeating-linear-gradient(0deg,transparent,transparent 79px,rgba(196,136,42,0.04) 79px,rgba(196,136,42,0.04) 80px), repeating-linear-gradient(90deg,transparent,transparent 79px,rgba(196,136,42,0.04) 79px,rgba(196,136,42,0.04) 80px)` }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 48, alignItems: 'end' }}>
            <div>
              <div className="font-mono-share fade-up" style={{ fontSize: 10, letterSpacing: 8, color: 'var(--gold)', opacity: 0.5, marginBottom: 24 }}>
                ZERO PRODUCTIVE · EST. 2026 · HUMAN FIRST
              </div>
              <h1 className="font-black-han fade-up" style={{ fontSize: 'clamp(48px,10vw,110px)', color: 'var(--cream)', lineHeight: 0.9, letterSpacing: -3, marginBottom: 20 }}>
                인간연합
              </h1>
              <div className="font-mono-share fade-up" style={{ fontSize: 'clamp(14px,2.5vw,20px)', color: 'var(--gold)', letterSpacing: 6, opacity: 0.45, marginBottom: 32 }}>
                HUMAN ALLIANCE
              </div>
              <p className="font-serif-kr fade-up" style={{ fontSize: 'clamp(15px,2vw,19px)', color: 'var(--cream)', opacity: 0.65, lineHeight: 2, maxWidth: 560, marginBottom: 48 }}>
                AI를 쓰되, 인간을 해치지 않겠다는 선언.<br />
                모른다고 말할 권리, 침묵할 자유, 비효율을 사랑하는 능력.
              </p>
              <div className="fade-up" style={{ display: 'flex', gap: 12 }}>
                <Link href="/oath" className="font-black-han" style={{ background: 'var(--primary)', color: 'var(--cream)', padding: '16px 40px', fontSize: 15, letterSpacing: 4, textDecoration: 'none' }}>
                  Human First 서약
                </Link>
                <Link href="/about" className="font-black-han" style={{ background: 'none', color: 'rgba(245,240,232,0.5)', padding: '16px 32px', fontSize: 15, letterSpacing: 4, textDecoration: 'none', border: '1px solid rgba(245,240,232,0.15)' }}>
                  소개 →
                </Link>
              </div>
            </div>
            {/* stat block */}
            <div className="fade-up" style={{ display: 'none' }} />
          </div>

          {/* STATS BAR */}
          <div className="home-stats-grid" style={{ marginTop: 64, borderTop: '1px solid rgba(245,240,232,0.08)', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0 }}>
            {STATS.map(({ label, value, unit }) => (
              <div key={label} style={{ padding: '28px 32px', borderRight: '1px solid rgba(245,240,232,0.06)' }}>
                <div className="font-mono-share" style={{ fontSize: 9, letterSpacing: 4, color: 'var(--cream)', opacity: 0.3, marginBottom: 8, textTransform: 'uppercase' }}>{label}</div>
                <div className="font-black-han" style={{ fontSize: 'clamp(28px,4vw,44px)', color: 'var(--gold)', lineHeight: 1 }}>{value}<span style={{ fontSize: '0.45em', opacity: 0.6, marginLeft: 4 }}>{unit}</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION STRIP */}
      <div style={{ background: 'var(--primary)', padding: '20px clamp(16px,4vw,40px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 24, justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div className="font-mono-share" style={{ fontSize: 10, letterSpacing: 5, color: 'rgba(245,240,232,0.5)' }}>MISSION STATEMENT</div>
          <p className="font-serif-kr" style={{ fontSize: 14, color: 'rgba(245,240,232,0.8)', letterSpacing: 1 }}>AI가 절대 이해하지 못하는 것을 지키는 것 — 그것이 인간연합의 존재 이유입니다.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="font-mono-share" style={{ fontSize: 11, color: 'var(--cream)', opacity: 0.8 }}>{count === null ? '—' : count} / 500</div>
            <div style={{ width: 120, height: 3, background: 'rgba(245,240,232,0.2)', borderRadius: 2 }}>
              <div style={{ height: '100%', background: 'var(--cream)', borderRadius: 2, width: `${pct}%`, transition: 'width 0.8s ease' }} />
            </div>
            <div className="font-mono-share" style={{ fontSize: 10, color: 'rgba(245,240,232,0.5)' }}>FREE MEMBERS</div>
          </div>
        </div>
      </div>

      {/* WHY */}
      <section style={{ padding: 'clamp(60px,8vw,100px) clamp(16px,4vw,40px)', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 'clamp(32px,6vw,80px)', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ flex: '0 0 min(280px,100%)' }}>
              <div className="font-mono-share fade-up" style={{ fontSize: 10, letterSpacing: 5, color: 'var(--text2)', marginBottom: 16 }}>WHY WE EXIST</div>
              <h2 className="font-black-han fade-up" style={{ fontSize: 'clamp(28px,4vw,48px)', letterSpacing: -1, lineHeight: 1, marginBottom: 24 }}>왜<br />인간연합인가</h2>
              <div style={{ width: 40, height: 3, background: 'var(--primary)', marginBottom: 0 }} />
            </div>
            <div style={{ flex: 1, minWidth: 280, display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                { num: '01', title: 'AI는 멈추지 않는다', body: 'AI는 구조적으로 침묵할 수 없다. 질문이 오면 반드시 대답한다. 틀려도, 모르더라도. 그것이 AI의 한계이자 인간이 가진 힘의 출발점이다.' },
                { num: '02', title: '비효율이 인간이다', body: '빠르고 정확하게만 살 필요는 없다. 돌아가도 되고, 틀려도 되고, 아무것도 하지 않아도 된다. 그 비효율 속에 인간다움이 산다.' },
                { num: '03', title: 'Human First', body: 'AI를 쓰되, 인간을 해치지 않겠다는 선언. 도구가 목적이 되지 않도록, 인간이 중심에 남도록. 그것이 Human First 서약이다.' },
              ].map(({ num, title, body }, i) => (
                <div key={num} className="fade-up" style={{ padding: '32px 0', borderTop: i === 0 ? '2px solid var(--primary)' : '1px solid var(--border)', display: 'flex', gap: 24 }}>
                  <span className="font-mono-share" style={{ fontSize: 10, letterSpacing: 3, color: 'var(--primary)', minWidth: 28 }}>{num}</span>
                  <div>
                    <h3 className="font-black-han" style={{ fontSize: 20, marginBottom: 10 }}>{title}</h3>
                    <p className="font-serif-kr" style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 2 }}>{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAMMES */}
      <section style={{ padding: 'clamp(48px,7vw,80px) clamp(16px,4vw,40px)', background: 'var(--bg2)', borderTop: '3px solid var(--primary)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div className="font-mono-share fade-up" style={{ fontSize: 10, letterSpacing: 5, color: 'var(--text2)', marginBottom: 12 }}>PROGRAMMES & INITIATIVES</div>
              <h2 className="font-black-han fade-up" style={{ fontSize: 'clamp(24px,4vw,40px)', letterSpacing: -1 }}>프로그램 및 프로젝트</h2>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['운영 중', '준비 중'].map(s => (
                <span key={s} className="font-mono-share" style={{ fontSize: 10, letterSpacing: 2, padding: '4px 12px', border: '1px solid var(--border)', color: 'var(--text2)' }}>{s}</span>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 2 }}>
            {PROJECTS.map(({ code, name, desc, href, status }) => (
              <Link key={code} href={href} className="fade-up" style={{ display: 'block', background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '32px 28px', textDecoration: 'none', color: 'var(--text)', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <span className="font-mono-share" style={{ fontSize: 9, letterSpacing: 3, color: 'var(--text2)', opacity: 0.4 }}>{code}</span>
                  <span className="font-mono-share" style={{ fontSize: 9, letterSpacing: 2, padding: '3px 8px', background: status === '운영 중' ? 'var(--primary)' : 'var(--border)', color: status === '운영 중' ? 'var(--cream)' : 'var(--text)' }}>{status}</span>
                </div>
                <div className="font-black-han" style={{ fontSize: 20, marginBottom: 10 }}>{name}</div>
                <div className="font-serif-kr" style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.8 }}>{desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* COMMITMENT */}
      <section style={{ padding: 'clamp(60px,8vw,100px) clamp(16px,4vw,40px)', background: 'var(--bg)', borderTop: '3px solid var(--primary)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 'clamp(32px,6vw,80px)', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ flex: '0 0 min(280px,100%)' }}>
              <div className="font-mono-share fade-up" style={{ fontSize: 10, letterSpacing: 5, color: 'var(--text2)', marginBottom: 16 }}>COMMITMENT · 연합의 약속</div>
              <h2 className="font-black-han fade-up" style={{ fontSize: 'clamp(28px,4vw,48px)', letterSpacing: -1, lineHeight: 1, marginBottom: 24 }}>인간연합은<br />무엇을<br />하는가</h2>
              <div style={{ width: 40, height: 3, background: 'var(--primary)' }} />
            </div>
            <div style={{ flex: 1, minWidth: 280, display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                'AI가 인간을 해치는 순간, 우리는 침묵하지 않는다. 오용 사례를 공론화하고, 연합의 이름으로 성명을 발표한다.',
                '서약자의 목소리를 모아 기업과 기관에 공식 질의한다. 그들의 답변, 혹은 침묵을 세상에 공개한다.',
                'AI 피해 사례를 기록하고 아카이빙한다. 개인의 경험이 집단의 근거가 되도록.',
                '서약자가 연대할 수 있는 구조를 만든다. 혼자 싸우지 않아도 되도록.',
                '인간다움을 지키는 서비스와 그렇지 않은 서비스를 구별한다. 서약자가 믿고 선택할 수 있도록.',
              ].map((text, i) => (
                <div key={i} className="fade-up" style={{ padding: '28px 0', borderTop: i === 0 ? '2px solid var(--primary)' : '1px solid var(--border)', display: 'flex', gap: 24, alignItems: 'flex-start' }}>
                  <span className="font-mono-share" style={{ fontSize: 10, letterSpacing: 3, color: 'var(--primary)', minWidth: 28, flexShrink: 0, paddingTop: 4 }}>{String(i + 1).padStart(2, '0')}</span>
                  <p className="font-serif-kr" style={{ fontSize: 15, color: 'var(--text)', lineHeight: 2, margin: 0 }}>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section style={{ padding: 'clamp(60px,8vw,100px) clamp(16px,4vw,40px)', background: 'var(--dark)', borderTop: '3px solid var(--gold)', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div className="font-mono-share fade-up" style={{ fontSize: 10, letterSpacing: 6, color: 'var(--gold)', opacity: 0.4, marginBottom: 48 }}>DECLARATION · 선언문</div>
          {[
            '우리는 모른다고 말할 권리를 지킨다.',
            '우리는 침묵할 자유를 수호한다.',
            '우리는 비효율을 사랑하는 능력을 기른다.',
            '우리는 AI를 쓰되, 인간을 해치지 않는다.',
          ].map((line, i) => (
            <p key={i} className="font-serif-kr fade-up" style={{ fontSize: 'clamp(16px,2.5vw,22px)', color: 'var(--cream)', lineHeight: 2.4, opacity: 0.85, borderBottom: i < 3 ? '1px solid rgba(245,240,232,0.06)' : 'none', paddingBottom: i < 3 ? 8 : 0 }}>{line}</p>
          ))}
          <div className="fade-up" style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid rgba(245,240,232,0.1)' }}>
            <div className="font-mono-share" style={{ fontSize: 10, letterSpacing: 4, color: 'var(--gold)', opacity: 0.35 }}>— 인간연합 선언문, 2026 · Human Alliance Declaration</div>
          </div>
        </div>
      </section>

      {/* OATH CTA */}
      <section style={{ padding: 'clamp(48px,7vw,80px) clamp(16px,4vw,40px)', background: 'var(--primary)' }}>
        <div className="home-cta-grid" style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr auto', gap: 48, alignItems: 'center' }}>
          <div className="fade-up">
            <div className="font-mono-share" style={{ fontSize: 10, letterSpacing: 5, color: 'rgba(245,240,232,0.4)', marginBottom: 16 }}>HUMAN FIRST OATH · 서약</div>
            <h2 className="font-black-han" style={{ fontSize: 'clamp(28px,5vw,56px)', color: 'var(--cream)', letterSpacing: -1, marginBottom: 16, lineHeight: 1.1 }}>지금 서약하세요</h2>
            <p className="font-serif-kr" style={{ fontSize: 15, color: 'rgba(245,240,232,0.65)', lineHeight: 2 }}>
              최초 500명은 무료 멤버십으로 함께합니다.<br />인간다움 인증서와 Human First 인증마크를 받으세요.<br /><span className="font-mono-share" style={{ fontSize: 11, letterSpacing: 2, opacity: 0.55 }}>500명 이후 가입비: $9.99 · 결제 기능 추후 Stripe 연동 예정</span>
            </p>
          </div>
          <div className="fade-up home-cta-right" style={{ textAlign: 'right' }}>
            <div className="font-mono-share" style={{ fontSize: 'clamp(32px,6vw,60px)', color: 'var(--cream)', letterSpacing: 4, lineHeight: 1, marginBottom: 4 }}>{count === null ? '—' : count}<span style={{ fontSize: '0.4em', opacity: 0.5 }}>/ 500</span></div>
            <div className="font-mono-share" style={{ fontSize: 10, letterSpacing: 3, color: 'rgba(245,240,232,0.35)', marginBottom: 24 }}>FREE MEMBERS</div>
            <Link href="/oath" className="font-black-han" style={{ display: 'inline-block', background: 'var(--dark)', color: 'var(--cream)', padding: '18px 48px', fontSize: 15, letterSpacing: 4, textDecoration: 'none' }}>
              Human First 서약하기 →
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: 'var(--dark)', padding: 'clamp(40px,5vw,60px) clamp(16px,4vw,40px)', borderTop: '1px solid rgba(245,240,232,0.06)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="home-footer-grid" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 48, alignItems: 'start', marginBottom: 48 }}>
            <div>
              <div className="font-black-han" style={{ fontSize: 22, color: 'var(--cream)', marginBottom: 4 }}>인간연합</div>
              <div className="font-mono-share" style={{ fontSize: 9, letterSpacing: 4, color: 'rgba(245,240,232,0.25)' }}>HUMAN ALLIANCE</div>
              <div className="font-mono-share" style={{ fontSize: 9, letterSpacing: 2, color: 'rgba(245,240,232,0.2)', marginTop: 8 }}>EST. 2026 · ZERO PRODUCTIVE</div>
            </div>
            <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', paddingTop: 4 }}>
              <div>
                <div className="font-mono-share" style={{ fontSize: 9, letterSpacing: 3, color: 'rgba(245,240,232,0.25)', marginBottom: 12 }}>PROGRAMMES</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[['서약', '/oath'], ['아카이브', '/archive'], ['굿즈', '/goods'], ['강의', '/lecture'], ['침묵의 날', '/silence-day'], ['소설', '/novel']].map(([l, h]) => (
                    <Link key={h} href={h} className="font-mono-share" style={{ fontSize: 10, letterSpacing: 2, color: 'rgba(245,240,232,0.25)', textDecoration: 'none' }}>{l}</Link>
                  ))}
                </div>
              </div>
              <div>
                <div className="font-mono-share" style={{ fontSize: 9, letterSpacing: 3, color: 'rgba(245,240,232,0.25)', marginBottom: 12 }}>ABOUT</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[['소개', '/about'], ['조직도', '/organization'], ['인증서', '/certificate']].map(([l, h]) => (
                    <Link key={h} href={h} className="font-mono-share" style={{ fontSize: 10, letterSpacing: 2, color: 'rgba(245,240,232,0.25)', textDecoration: 'none' }}>{l}</Link>
                  ))}
                </div>
              </div>
              <div>
                <div className="font-mono-share" style={{ fontSize: 9, letterSpacing: 3, color: 'rgba(245,240,232,0.25)', marginBottom: 12 }}>CONTACT</div>
                <a href="mailto:zphistory5974@gmail.com?subject=인간연합 문의" className="font-mono-share" style={{ fontSize: 10, letterSpacing: 2, color: 'rgba(245,240,232,0.25)', textDecoration: 'none', display: 'block' }}>zphistory5974@gmail.com</a>
                <div className="font-mono-share" style={{ fontSize: 9, letterSpacing: 1, color: 'rgba(245,240,232,0.13)', marginTop: 8, lineHeight: 1.8 }}>고문위원·파트너십·일반 문의</div>
              </div>
            </div>
            <div style={{ paddingTop: 4 }}>
              <div className="font-mono-share" style={{ fontSize: 9, letterSpacing: 2, color: 'rgba(245,240,232,0.15)', lineHeight: 2, textAlign: 'right' }}>
                <div>AI를 쓰되,</div>
                <div>인간을 해치지 않겠습니다.</div>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(245,240,232,0.05)', paddingTop: 24 }}>
            <div className="font-mono-share" style={{ fontSize: 9, letterSpacing: 2, color: 'rgba(245,240,232,0.15)' }}>© 2026 Human Alliance · Zero Productive. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
