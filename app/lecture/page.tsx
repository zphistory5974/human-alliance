'use client'

import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabase'
import NavBar from '../../components/NavBar'

const CURRICULUM = [
  { week: '1강', title: 'AI가 모든 것을 안다는 착각', items: ['AI 할루시네이션의 구조', '"모른다"는 것이 왜 가치인가', '실습: 오늘 하루 AI에게 묻지 않기'] },
  { week: '2강', title: '침묵의 힘 — 대답하지 않을 자유', items: ['인간의 침묵 vs AI의 침묵', '침묵이 만드는 공간', '실습: 5분 무응답 실험'] },
  { week: '3강', title: '비효율의 가치', items: ['돌아가는 길에서 발견하는 것들', '최적화가 앗아가는 것', '실습: 비효율 일기 쓰기'] },
  { week: '4강', title: '감정 — AI가 시뮬레이션할 수 없는 것', items: ['감정의 복잡성과 모순', '공감과 연산의 차이', '실습: 감정 아카이브 작성'] },
  { week: '5강', title: '인간적 관계의 재발견', items: ['효율이 빠진 관계의 의미', '취약성과 신뢰', '실습: 오프라인 대화 30분'] },
  { week: '6강', title: 'Human First 선언', items: ['나만의 Human First 서약 작성', 'AI와 함께하되 인간을 잃지 않는 법', '수료: 인간연합 정식 멤버십'] },
]

export default function LecturePage() {
  const [openWeek, setOpenWeek] = useState<number | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [applied, setApplied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [applyError, setApplyError] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!user) return
    supabase.from('lecture_waitlist').select('id').eq('kakao_id', user.id).maybeSingle().then(({ data }) => {
      if (data) setApplied(true)
    })
  }, [user?.id])

  async function handleApply() {
    if (!user) return
    setLoading(true)
    setApplyError('')
    const { error } = await supabase.from('lecture_waitlist').insert({ kakao_id: user.id })
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
      options: { redirectTo: `${window.location.origin}/auth/callback?returnTo=/lecture` },
    })
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <NavBar title="인간연합 강의" />

      {/* HERO */}
      <div style={{ background: 'var(--dark)', padding: '80px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: `repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(196,136,42,0.04) 39px,rgba(196,136,42,0.04) 40px)` }} />
        <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative' }}>
          <div className="font-mono-share" style={{ fontSize: 10, letterSpacing: 6, color: 'var(--gold)', opacity: 0.5, marginBottom: 16 }}>HUMAN ALLIANCE LECTURE 01</div>
          <h1 className="font-black-han" style={{ fontSize: 'clamp(28px,6vw,56px)', color: 'var(--cream)', lineHeight: 1.1, letterSpacing: -1, marginBottom: 16 }}>
            AI 시대에<br />모르는 것과<br />함께 사는 법
          </h1>
          <p style={{ fontSize: 'clamp(14px,2vw,18px)', color: 'var(--cream)', opacity: 0.6, lineHeight: 2, maxWidth: 560 }}>
            AI가 모든 것에 답하는 시대. 우리는 왜 모른다고 말해야 하는가. 인간만이 가진 힘을 다시 발견하는 강의.
          </p>
          <div style={{ display: 'flex', gap: 24, marginTop: 32, flexWrap: 'wrap' }}>
            {([['총 강의', '6강'], ['수강 방식', '온라인 (유튜브)'], ['수강료', '무료'], ['개강', 'Coming Soon']] as [string, string][]).map(([l, v]) => (
              <div key={l} className="font-mono-share" style={{ fontSize: 11, letterSpacing: 2, color: 'rgba(245,240,232,0.4)' }}>
                {l} <span style={{ color: 'var(--gold)', opacity: 1 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '60px 24px' }}>
        {/* OVERVIEW */}
        <div className="font-mono-share" style={{ fontSize: 10, letterSpacing: 5, color: 'var(--text2)', marginBottom: 12 }}>OVERVIEW</div>
        <h2 className="font-black-han" style={{ fontSize: 'clamp(22px,4vw,36px)', letterSpacing: -1, marginBottom: 32 }}>강의 개요</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 2, marginBottom: 60, border: `2px solid var(--primary)` }}>
          {[['대상', 'AI 시대가 불안한 모든 인간'], ['목표', '인간다움을 회복하고 지키는 힘'], ['형식', '강의 + 실천 과제'], ['수강료', '완전 무료']].map(([l, v]) => (
            <div key={l} style={{ padding: '28px 24px', background: 'var(--bg-card)', border: `1px solid var(--border)` }}>
              <div className="font-mono-share" style={{ fontSize: 9, letterSpacing: 3, color: 'var(--text2)', marginBottom: 8 }}>{l}</div>
              <div className="font-black-han" style={{ fontSize: 'clamp(15px,2.5vw,20px)' }}>{v}</div>
            </div>
          ))}
        </div>

        {/* CURRICULUM */}
        <div className="font-mono-share" style={{ fontSize: 10, letterSpacing: 5, color: 'var(--text2)', marginBottom: 12 }}>CURRICULUM</div>
        <h2 className="font-black-han" style={{ fontSize: 'clamp(22px,4vw,36px)', letterSpacing: -1, marginBottom: 32 }}>커리큘럼</h2>
        <div style={{ marginBottom: 60 }}>
          {CURRICULUM.map(({ week, title, items }, i) => (
            <div key={i} style={{ borderBottom: `1px solid var(--border)` }}>
              <div onClick={() => setOpenWeek(openWeek === i ? null : i)} style={{ display: 'flex', gap: 20, alignItems: 'center', padding: '20px 0', cursor: 'pointer' }}>
                <span className="font-mono-share" style={{ fontSize: 10, letterSpacing: 3, color: 'var(--cream)', background: 'var(--primary)', padding: '5px 10px', flexShrink: 0 }}>{week}</span>
                <span className="font-black-han" style={{ fontSize: 'clamp(15px,2.5vw,20px)', flex: 1 }}>{title}</span>
                <span style={{ color: 'var(--text2)', transition: 'transform .2s', transform: openWeek === i ? 'rotate(90deg)' : 'none' }}>›</span>
              </div>
              {openWeek === i && (
                <ul style={{ listStyle: 'none', padding: '0 0 20px 60px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {items.map((item, j) => (
                    <li key={j} style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.8, paddingLeft: 16, position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 0, opacity: 0.4 }}>—</span>{item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* APPLY */}
        <div style={{ background: 'var(--primary)', padding: '60px 40px', textAlign: 'center', margin: '0 -24px' }}>
          <h3 className="font-black-han" style={{ fontSize: 'clamp(22px,4vw,36px)', color: 'var(--cream)', marginBottom: 8 }}>개강 신청하기</h3>
          <p style={{ fontSize: 15, color: 'rgba(245,240,232,0.7)', lineHeight: 1.9, marginBottom: 36 }}>
            개강 시 가장 먼저 안내해 드립니다.
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
