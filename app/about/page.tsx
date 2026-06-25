'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const N = 7
const DARK_SLIDES = new Set([0, 5, 6])

const HISTORY = [
  { date: '2026.01', event: 'ZP(Zero Productive) 브랜드 설립' },
  { date: '2026.03', event: "첫 번째 프로젝트 '불행의 역사' 론칭" },
  { date: '2026.06', event: "두 번째 프로젝트 'Real Me' 론칭" },
  { date: '2026.06', event: '인간연합(Human Alliance) 설립 선언 및 웹사이트 오픈' },
  { date: '진행 중', event: '고문위원 모집, 글로벌 확장 준비 중' },
]

const PROJECTS = [
  { name: '불행의 역사', en: 'Misery History', year: '2026.03', desc: '가장 어두운 순간을\n기록하는 커뮤니티', status: 'LIVE' },
  { name: 'Real Me', en: 'Real Me', year: '2026.06', desc: '타인의 눈으로\n바라본 MBTI', status: 'LIVE' },
  { name: '아돈노', en: "I Don't Know", year: '2026', desc: '모른다는 것을\n자랑스럽게 — 굿즈 브랜드', status: 'ONGOING' },
  { name: '인간연합', en: 'Human Alliance', year: '2026.06', desc: '인간다움을 연구하고\n보존하는 연합', status: 'LIVE' },
]

const VALUES = [
  { en: 'Pro-Human', ko: '친인간', desc: '반AI가 아닌 친인간. AI를 사용하되 인간 중심으로.' },
  { en: 'Value of Inefficiency', ko: '비효율의 가치', desc: 'ROI 0인 것에 열광하는 능력. 돌아가는 길이 인간다움이다.' },
  { en: "Right to Not Know", ko: '모름의 권리', desc: '대답하지 않을 자유. 모른다고 말하는 용기.' },
]

const MISSION_LINES = [
  'AI 시대에 인간다움을 연구하고 보존한다.',
  '우리는 AI를 거부하지 않는다.',
  'AI를 사용하되, 인간을 해치지 않을 것을 선언한다.',
  '모른다고 말할 권리, 침묵할 자유, 비효율을 사랑하는 능력.',
  '이것이 AI가 절대 가질 수 없는 인간만의 힘이다.',
]

export default function AboutPage() {
  const deckRef = useRef<HTMLDivElement>(null)
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const el = deckRef.current
    if (!el) return
    const update = () => setIdx(Math.round(el.scrollTop / el.clientHeight))
    el.addEventListener('scroll', update, { passive: true })
    return () => el.removeEventListener('scroll', update)
  }, [])

  useEffect(() => {
    const go = (delta: number) => {
      const el = deckRef.current
      if (!el) return
      const cur = Math.round(el.scrollTop / el.clientHeight)
      const next = Math.max(0, Math.min(N - 1, cur + delta))
      el.scrollTo({ top: next * el.clientHeight, behavior: 'smooth' })
    }
    const onKey = (e: KeyboardEvent) => {
      if (['ArrowDown', 'ArrowRight', ' '].includes(e.key)) { e.preventDefault(); go(1) }
      if (['ArrowUp', 'ArrowLeft'].includes(e.key)) { e.preventDefault(); go(-1) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const goTo = (n: number) => {
    const el = deckRef.current
    if (!el) return
    el.scrollTo({ top: n * el.clientHeight, behavior: 'smooth' })
  }

  const isDark = DARK_SLIDES.has(idx)
  const dotActive = isDark ? 'var(--cream)' : 'var(--primary)'
  const dotIdle = isDark ? 'rgba(245,240,232,0.25)' : 'rgba(92,46,14,0.18)'
  const uiColor = isDark ? 'rgba(245,240,232,0.38)' : 'rgba(92,46,14,0.32)'

  return (
    <>
      {/* DECK */}
      <div ref={deckRef} className="ha-deck" style={{ position: 'fixed', inset: 0, overflowY: 'scroll' }}>

        {/* ── S1: Identity ── */}
        <div className="ha-slide" style={{ background: 'var(--primary)', textAlign: 'center' }}>
          <Image src="/logo.png" alt="인간연합 증표" width={140} height={140} style={{ marginBottom: 28 }} />
          <div className="font-mono-share" style={{ fontSize: 9, letterSpacing: 7, color: 'var(--gold)', opacity: 0.5, marginBottom: 18 }}>
            EST. 2026 · ZERO PRODUCTIVE
          </div>
          <h1 className="font-black-han" style={{ fontSize: 'clamp(64px,15vw,144px)', lineHeight: 0.85, letterSpacing: -4, color: 'var(--cream)', margin: '0 0 16px' }}>
            인간연합
          </h1>
          <div className="font-mono-share" style={{ fontSize: 'clamp(11px,2.2vw,20px)', letterSpacing: 7, color: 'var(--cream)', opacity: 0.32, marginBottom: 28 }}>
            HUMAN ALLIANCE
          </div>
          <p className="font-serif-kr" style={{ fontSize: 'clamp(14px,1.7vw,17px)', color: 'var(--cream)', opacity: 0.48, lineHeight: 2, maxWidth: 400 }}>
            AI 시대에 인간다움을 연구하고 보존한다.
          </p>
        </div>

        {/* ── S2: 설립 배경 ── */}
        <div className="ha-slide" style={{ background: 'var(--bg)' }}>
          <div style={{ maxWidth: 720, width: '100%' }}>
            <div className="font-mono-share" style={{ fontSize: 9, letterSpacing: 6, color: 'var(--gold)', marginBottom: 14 }}>
              WHY WE EXIST · 설립 배경
            </div>
            <h2 className="font-black-han" style={{ fontSize: 'clamp(28px,6vw,64px)', letterSpacing: -2, color: 'var(--primary)', marginBottom: 40, lineHeight: 1 }}>
              왜 만들었는가
            </h2>
            <div style={{ borderLeft: '3px solid var(--primary)', paddingLeft: 28, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {([
                ['AI는 항상 목적과 최적화를 향해 움직인다.', 0.42],
                ['반면 인간은 쓸모없는 것에 가치를 부여하는 유일한 존재다.', 0.58],
                ['AI가 강력해질수록 인간의 비효율, 감정, 침묵, 불완전함은', 0.74],
                ['오히려 더 희귀하고 소중한 것이 된다.', 0.86],
                ['인간연합은 이 인간다움을 연구하고 보존하기 위해 만들어졌다.', 1],
              ] as [string, number][]).map(([t, o], i) => (
                <p key={i} className="font-serif-kr" style={{ fontSize: 'clamp(14px,2vw,20px)', lineHeight: 2, color: 'var(--text)', opacity: o, margin: 0 }}>
                  {t}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* ── S3: 미션 & 핵심 가치 ── */}
        <div className="ha-slide" style={{ background: 'var(--bg)' }}>
          <div style={{ maxWidth: 860, width: '100%' }}>
            <div className="font-mono-share" style={{ fontSize: 9, letterSpacing: 6, color: 'var(--gold)', marginBottom: 14 }}>
              MISSION & VALUES
            </div>
            <h2 className="font-black-han" style={{ fontSize: 'clamp(22px,4.5vw,50px)', letterSpacing: -2, color: 'var(--primary)', marginBottom: 26, lineHeight: 1 }}>
              미션 & 핵심 가치
            </h2>
            <div style={{ background: 'var(--primary)', padding: '22px 30px', marginBottom: 22 }}>
              {MISSION_LINES.map((l, i) => (
                <p key={i} className="font-serif-kr" style={{ fontSize: 'clamp(12px,1.5vw,15px)', lineHeight: 1.9, color: 'var(--cream)', opacity: i === 0 ? 1 : 0.70, margin: 0 }}>
                  {l}
                </p>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
              {VALUES.map(({ en, ko, desc }) => (
                <div key={en} style={{ padding: '18px 16px', border: '1.5px solid var(--primary)' }}>
                  <div className="font-mono-share" style={{ fontSize: 8, letterSpacing: 3, color: 'var(--gold)', marginBottom: 6 }}>
                    {en.toUpperCase()}
                  </div>
                  <div className="font-black-han" style={{ fontSize: 15, color: 'var(--primary)', marginBottom: 8 }}>{ko}</div>
                  <div className="font-serif-kr" style={{ fontSize: 11, color: 'var(--text2)', lineHeight: 1.75 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── S4: ZP 프로젝트 구조 ── */}
        <div className="ha-slide" style={{ background: 'var(--bg2)' }}>
          <div style={{ maxWidth: 900, width: '100%' }}>
            <div className="font-mono-share" style={{ fontSize: 9, letterSpacing: 6, color: 'var(--gold)', marginBottom: 14 }}>
              ZP PROJECTS · 프로젝트 구조
            </div>
            <h2 className="font-black-han" style={{ fontSize: 'clamp(22px,4.5vw,50px)', letterSpacing: -2, color: 'var(--primary)', marginBottom: 44, lineHeight: 1 }}>
              Zero Productive 프로젝트
            </h2>
            <div className="ha-projects" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 30, left: '12.5%', right: '12.5%', height: 2, background: 'var(--primary)', opacity: 0.1 }} />
              {PROJECTS.map(({ name, en, year, desc, status }, i) => (
                <div key={name} style={{ padding: '0 10px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                  <div style={{
                    width: 60, height: 60, borderRadius: '50%',
                    background: status === 'ONGOING' ? 'var(--gold)' : 'var(--primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 14px', boxShadow: '0 0 0 5px var(--bg2)',
                  }}>
                    <span className="font-mono-share" style={{ fontSize: 13, color: 'var(--cream)', fontWeight: 700 }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="font-mono-share" style={{ fontSize: 8, letterSpacing: 2, color: 'var(--gold)', marginBottom: 5 }}>{year}</div>
                  <div className="font-black-han" style={{ fontSize: 15, color: 'var(--primary)', marginBottom: 4 }}>{name}</div>
                  <div className="font-mono-share" style={{ fontSize: 8, letterSpacing: 1, color: 'var(--text2)', opacity: 0.45, marginBottom: 8 }}>{en}</div>
                  <div className="font-serif-kr" style={{ fontSize: 11, color: 'var(--text2)', lineHeight: 1.65, marginBottom: 10, whiteSpace: 'pre-line' }}>
                    {desc}
                  </div>
                  <span style={{
                    display: 'inline-block', padding: '3px 10px',
                    background: status === 'ONGOING' ? 'var(--gold)' : 'var(--primary)',
                    color: 'var(--cream)', fontFamily: "'Share Tech Mono', monospace", fontSize: 8, letterSpacing: 2,
                  }}>{status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── S5: 연혁 ── */}
        <div className="ha-slide" style={{ background: 'var(--bg)' }}>
          <div style={{ maxWidth: 760, width: '100%' }}>
            <div className="font-mono-share" style={{ fontSize: 9, letterSpacing: 6, color: 'var(--gold)', marginBottom: 14 }}>
              TIMELINE · 연혁
            </div>
            <h2 className="font-black-han" style={{ fontSize: 'clamp(22px,4.5vw,50px)', letterSpacing: -2, color: 'var(--primary)', marginBottom: 32, lineHeight: 1 }}>
              인간연합 연혁
            </h2>
            <div style={{ position: 'relative', paddingLeft: 22 }}>
              <div style={{ position: 'absolute', left: 0, top: 8, bottom: 8, width: 1, background: 'var(--border)' }} />
              {HISTORY.map(({ date, event }, i) => (
                <div key={i} style={{ display: 'flex', gap: 20, marginBottom: 22, position: 'relative' }}>
                  <div style={{
                    position: 'absolute', left: -25, top: 7, width: 8, height: 8, borderRadius: '50%',
                    background: date === '진행 중' ? 'var(--gold)' : 'var(--primary)',
                    opacity: date === '진행 중' ? 1 : 0.6,
                  }} />
                  <div className="font-mono-share" style={{ fontSize: 10, letterSpacing: 2, color: date === '진행 중' ? 'var(--gold)' : 'var(--primary)', minWidth: 76, paddingTop: 1 }}>
                    {date}
                  </div>
                  <div className="font-serif-kr" style={{ fontSize: 'clamp(13px,1.6vw,16px)', lineHeight: 1.8, color: 'var(--text)' }}>
                    {event}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── S6: 선언문 ── */}
        <div className="ha-slide" style={{ background: 'var(--dark)', textAlign: 'center' }}>
          <div style={{ maxWidth: 680, width: '100%' }}>
            <div className="font-mono-share" style={{ fontSize: 9, letterSpacing: 6, color: 'var(--gold)', opacity: 0.42, marginBottom: 36 }}>
              DECLARATION · 선언문
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 48 }}>
              {[
                '우리는 모른다고 말할 권리를 지킨다.',
                '우리는 침묵할 자유를 수호한다.',
                '우리는 비효율을 사랑하는 능력을 기른다.',
                '우리는 AI를 쓰되, 인간을 해치지 않는다.',
              ].map((l, i) => (
                <p key={i} className="font-serif-kr" style={{
                  fontSize: 'clamp(15px,2.5vw,22px)', lineHeight: 2.2, color: 'var(--cream)', opacity: 0.84,
                  borderBottom: i < 3 ? '1px solid rgba(245,240,232,0.06)' : undefined, margin: 0,
                }}>
                  {l}
                </p>
              ))}
            </div>
            <div style={{ borderTop: '1px solid rgba(245,240,232,0.1)', paddingTop: 40 }}>
              <p className="font-black-han" style={{ fontSize: 'clamp(26px,5.5vw,56px)', letterSpacing: -1, color: 'var(--gold)', lineHeight: 1.25, margin: 0 }}>
                우리는 모른다.<br />그리고 그것으로 충분하다.
              </p>
            </div>
          </div>
        </div>

        {/* ── S7: CTA ── */}
        <div className="ha-slide" style={{ background: 'var(--primary)', textAlign: 'center' }}>
          <div style={{ maxWidth: 580, width: '100%' }}>
            <div className="font-mono-share" style={{ fontSize: 9, letterSpacing: 6, color: 'var(--cream)', opacity: 0.28, marginBottom: 22 }}>
              HUMAN FIRST · 지금 함께하세요
            </div>
            <h2 className="font-black-han" style={{ fontSize: 'clamp(56px,13vw,120px)', letterSpacing: -3, lineHeight: 0.87, color: 'var(--cream)', marginBottom: 28 }}>
              함께<br />하세요
            </h2>
            <p className="font-serif-kr" style={{ fontSize: 'clamp(14px,1.8vw,17px)', color: 'var(--cream)', opacity: 0.58, lineHeight: 2, marginBottom: 40 }}>
              최초 500명은 무료 멤버십으로 함께합니다.<br />
              인간다움 인증서와 Human First 인증마크를 받으세요.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/oath" className="font-black-han" style={{
                display: 'inline-block', background: 'var(--cream)', color: 'var(--primary)',
                padding: '16px 48px', fontSize: 16, letterSpacing: 4, textDecoration: 'none',
              }}>
                Human First 서약하기 →
              </Link>
              <Link href="/" className="font-black-han" style={{
                display: 'inline-block', color: 'var(--cream)',
                padding: '16px 32px', fontSize: 14, letterSpacing: 3, textDecoration: 'none',
                border: '1.5px solid rgba(245,240,232,0.28)',
              }}>
                홈페이지
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* ── Fixed UI ── */}

      {/* Dot navigation */}
      <div style={{ position: 'fixed', right: 20, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 8, zIndex: 300 }}>
        {Array.from({ length: N }, (_, i) => (
          <button key={i} onClick={() => goTo(i)} style={{
            width: 8, height: idx === i ? 24 : 8, border: 'none', padding: 0,
            borderRadius: 4, cursor: 'pointer', transition: 'all 0.3s ease',
            background: idx === i ? dotActive : dotIdle,
          }} />
        ))}
      </div>

      {/* Home link */}
      <Link href="/" className="font-mono-share" style={{
        position: 'fixed', top: 20, left: 20, zIndex: 300,
        fontSize: 9, letterSpacing: 3, color: uiColor, textDecoration: 'none',
      }}>
        ← HUMAN ALLIANCE
      </Link>

      {/* Slide counter */}
      <div className="font-mono-share" style={{
        position: 'fixed', bottom: 20, left: 20, zIndex: 300,
        fontSize: 9, letterSpacing: 3, color: uiColor,
      }}>
        {String(idx + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
      </div>

      {/* Next hint */}
      {idx < N - 1 && (
        <button onClick={() => goTo(idx + 1)} className="font-mono-share" style={{
          position: 'fixed', bottom: 16, right: 52, zIndex: 300,
          background: 'none', border: 'none', cursor: 'pointer', padding: '6px 8px',
          fontSize: 9, letterSpacing: 2, color: uiColor,
        }}>
          ▼ NEXT
        </button>
      )}
    </>
  )
}
