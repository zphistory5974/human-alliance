'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'
import { createClient, supabase } from '../../lib/supabase'

type Stage = 'loading' | 'form' | 'articles' | 'submitting' | 'done' | 'already_signed'

const ARTICLES = [
  {
    num: '제1조',
    title: '인간 해악 방지',
    body: '나는 AI를 사용함에 있어 인간에게 심리적, 사회적, 경제적 해악을 끼치지 않겠습니다. AI가 생성한 콘텐츠로 타인을 기만하거나, 착취하거나, 조작하지 않겠습니다.',
  },
  {
    num: '제2조',
    title: '정직과 투명성',
    body: '나는 AI를 사용할 때 그 사실을 적절한 맥락에서 투명하게 밝히겠습니다. 모른다고 말할 권리를 행사하며, AI가 생성한 정보를 검증 없이 사실로 전달하지 않겠습니다.',
  },
  {
    num: '제3조',
    title: '인간 우선 원칙',
    body: '나는 AI의 편의를 위해 인간의 존엄성을 타협하지 않겠습니다. 인간의 감정, 관계, 경험은 효율성으로 환원될 수 없음을 인정하고, 비효율 속에 깃든 인간다움을 존중하겠습니다.',
  },
  {
    num: '제4조',
    title: '인증마크 사용 규정',
    body: 'Human First 인증마크는 위 조항들을 준수하는 활동에만 사용합니다. 인증마크를 상업적 기만, 허위 홍보, 또는 이 서약의 정신에 반하는 목적으로 사용하지 않겠습니다.',
  },
  {
    num: '제5조',
    title: '효력 및 갱신',
    body: '이 서약은 서명일로부터 효력이 발생하며, 인간연합의 원칙이 유지되는 한 지속됩니다. 나는 이 서약을 스스로의 의지로 체결하며, 언제든 재검토하고 갱신할 책임이 있습니다.',
  },
]

export default function OathPage() {
  const [stage, setStage] = useState<Stage>('form')
  const [totalCount, setTotalCount] = useState<number | null>(null)
  const [form, setForm] = useState({ name: '', occupation: '', gender: '', nationality: '대한민국', email: '' })
  const [checked, setChecked] = useState([false, false, false, false, false])
  const [result, setResult] = useState<{ oath_number: string; name: string; is_free_member: boolean } | null>(null)
  const [error, setError] = useState('')
  const certRef = useRef<HTMLDivElement>(null)
  const [user, setUser] = useState<User | null>(null)
  const [showWelcome, setShowWelcome] = useState(false)
  const [showNatSelect, setShowNatSelect] = useState(false)

  // 세션 감지
  useEffect(() => {
    const sb = createClient()
    sb.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null))
    const { data: { subscription } } = sb.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  // 서약 총 인원
  useEffect(() => {
    supabase
      .from('oath_signers')
      .select('*', { count: 'exact', head: true })
      .then(({ count }) => setTotalCount(count ?? 0))
  }, [])

  // 카카오 로그인 시 기존 서약 여부 확인
  useEffect(() => {
    if (!user) return
    // 이미 done/already_signed 상태면 재확인 불필요
    if (stage === 'done' || stage === 'already_signed') return

    supabase
      .from('oath_signers')
      .select('oath_number, name, is_free_member')
      .eq('kakao_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setResult({ oath_number: data.oath_number, name: data.name, is_free_member: data.is_free_member })
          setStage('already_signed')
        }
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  // 카카오 로그인 시 이름 자동 입력
  useEffect(() => {
    const nickname = user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? ''
    if (nickname && !form.name) {
      setForm(f => ({ ...f, name: nickname }))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

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

  async function handleSubmit() {
    if (!form.name.trim()) { setError('이름을 입력해주세요.'); return }
    setError('')
    setStage('submitting')

    try {
      // 중복 서약 확인 (로그인한 경우)
      if (user) {
        const { data: existing } = await supabase
          .from('oath_signers')
          .select('oath_number, name, is_free_member')
          .eq('kakao_id', user.id)
          .maybeSingle()

        if (existing) {
          setResult({ oath_number: existing.oath_number, name: existing.name, is_free_member: existing.is_free_member })
          setStage('already_signed')
          return
        }
      }

      const { data: rows } = await supabase
        .from('oath_signers')
        .select('oath_number')
        .order('created_at', { ascending: false })
        .limit(1)

      let num = 1
      const lastRow = rows?.[0]
      if (lastRow?.oath_number) {
        const parsed = parseInt(lastRow.oath_number.replace('HA-', ''), 10)
        if (!isNaN(parsed)) num = parsed + 1
      }
      const oath_number = `HA-${String(num).padStart(3, '0')}`
      const is_free_member = num <= 500

      const { error: dbError } = await supabase.from('oath_signers').insert({
        oath_number,
        name: form.name.trim(),
        occupation: form.occupation.trim() || null,
        gender: form.gender,
        nationality: form.nationality,
        email: form.email.trim() || null,
        is_free_member,
        kakao_id: user?.id ?? null,
      })

      if (dbError) {
        // DB 레벨 중복 감지 (unique_kakao_id 제약 위반)
        if (dbError.code === '23505') {
          setError('이미 인간연합 멤버입니다. 다시 로드해주세요.')
          setStage('articles')
          return
        }
        const detail = [dbError.message, dbError.details, dbError.hint].filter(Boolean).join(' | ')
        throw new Error(detail || '알 수 없는 DB 오류')
      }

      setResult({ oath_number, name: form.name.trim(), is_free_member })
      setStage('done')
      setShowWelcome(true)
      setTimeout(() => setShowWelcome(false), 5000)

      if (user) {
        const sb = createClient()
        sb.auth.updateUser({ data: { oath_number } }).catch(() => {})
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      console.error('[oath] handleSubmit error:', e)
      setError(msg || '저장 중 오류가 발생했습니다.')
      setStage('articles')
    }
  }

  async function downloadPDF() {
    if (!certRef.current || !result) return
    try {
      const { default: html2canvas } = await import('html2canvas')
      const { default: jsPDF } = await import('jspdf')
      const canvas = await html2canvas(certRef.current, { scale: 3, useCORS: true, backgroundColor: '#ffffff' })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
      pdf.addImage(imgData, 'PNG', 0, 0, 297, 210)
      pdf.save(`인간다움_인증서_${result.oath_number}.pdf`)
    } catch (e) {
      console.error('PDF 생성 오류:', e)
    }
  }

  function downloadBadge() {
    if (!result) return
    const size = 500
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#111111'
    ctx.fillRect(0, 0, size, size)
    ctx.strokeStyle = '#FFE000'
    ctx.lineWidth = 3
    ctx.strokeRect(8, 8, size - 16, size - 16)
    ctx.fillStyle = '#FFE000'
    ctx.font = 'bold 18px "Share Tech Mono", monospace'
    ctx.textAlign = 'center'
    ctx.fillText('HUMAN FIRST', size / 2, 80)
    ctx.font = 'bold 96px sans-serif'
    ctx.fillText('인간연합', size / 2, 300)
    ctx.font = '16px sans-serif'
    ctx.fillText('AI를 쓰되, 인간을 해치지 않겠습니다', size / 2, 380)
    ctx.globalAlpha = 0.4
    ctx.font = '14px "Share Tech Mono", monospace'
    ctx.fillText(result.oath_number, size / 2, 440)
    ctx.globalAlpha = 1
    const link = document.createElement('a')
    link.download = `human_first_badge_${result.oath_number}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const pct = Math.min(((totalCount ?? 0) / 500) * 100, 100)
  const allChecked = checked.every(Boolean)
  const today = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })

  // 인증서 + 다운로드 버튼: done / already_signed 공용
  const CertSection = result ? (
    <>
      <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
        <button
          onClick={downloadPDF}
          className="font-black-han"
          style={{
            flex: 1, minWidth: 200, padding: '16px 32px',
            background: 'var(--primary)', color: 'var(--cream)',
            border: 'none', fontSize: 14, letterSpacing: 3, cursor: 'pointer',
          }}
        >
          인증서 PDF 다운로드
        </button>
        <button
          onClick={downloadBadge}
          className="font-black-han"
          style={{
            flex: 1, minWidth: 200, padding: '16px 32px',
            background: 'var(--bg-card)', color: 'var(--primary)',
            border: '1.5px solid var(--primary)', fontSize: 14, letterSpacing: 3, cursor: 'pointer',
          }}
        >
          Human First 배지 다운로드
        </button>
      </div>

      <div ref={certRef} id="cert" style={{
        background: 'var(--bg-card)', width: '100%', aspectRatio: '1.414/1',
        position: 'relative', overflow: 'hidden',
        border: '2px solid var(--primary)', marginBottom: 32,
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: `repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(0,0,0,0.03) 39px,rgba(0,0,0,0.03) 40px),
            repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(0,0,0,0.03) 39px,rgba(0,0,0,0.03) 40px)`,
        }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 8, background: 'var(--cream)' }} />
        <div style={{
          position: 'absolute', top: 0, left: 0, bottom: 0, width: 72, background: 'var(--primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span className="font-mono-share" style={{
            fontSize: 9, letterSpacing: 4, color: 'var(--cream)', opacity: 0.7,
            writingMode: 'vertical-rl', transform: 'rotate(180deg)', whiteSpace: 'nowrap',
          }}>
            HUMAN ALLIANCE · ZERO PRODUCTIVE
          </span>
        </div>
        <div style={{ position: 'absolute', right: 0, bottom: 0, opacity: 0.04 }}>
          <svg width="140" height="140" viewBox="0 0 100 100">
            <text x="50" y="90" textAnchor="middle" fontFamily="'Black Han Sans', sans-serif" fontSize="100" fill="#111">人</text>
          </svg>
        </div>
        <div style={{
          position: 'absolute', top: 32, left: 100, right: 32, bottom: 32,
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="font-mono-share" style={{ fontSize: 10, letterSpacing: 4, color: 'var(--text2)', opacity: 0.5 }}>
              HUMAN ALLIANCE
            </span>
            <span className="font-mono-share" style={{ fontSize: 10, letterSpacing: 2, color: 'var(--text2)', opacity: 0.4 }}>
              {result.oath_number}
            </span>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16 }}>
            <div className="font-mono-share" style={{ fontSize: 9, letterSpacing: 5, color: 'var(--text2)', opacity: 0.4, textTransform: 'uppercase' }}>
              Certificate of Humanity
            </div>
            <h3 className="font-black-han" style={{ fontSize: 'clamp(18px,3.5vw,36px)', color: 'var(--primary)', lineHeight: 1.1, letterSpacing: -1, margin: 0 }}>
              인간다움 인증서
            </h3>
            <div className="font-serif-kr" style={{ fontSize: 'clamp(22px,4.5vw,48px)', fontWeight: 900, color: 'var(--primary)', borderBottom: '2px solid var(--primary)', paddingBottom: 8, display: 'inline-block' }}>
              {result.name}
            </div>
            <p className="font-serif-kr" style={{ fontSize: 'clamp(11px,1.8vw,15px)', color: 'var(--text2)', lineHeight: 1.9, maxWidth: 480 }}>
              위 사람은 모른다고 말할 권리, 침묵할 자유, 비효율을 사랑하는 능력을
              가진 인간임을 이에 인증합니다.
            </p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ width: 140, height: 1, background: 'var(--primary)', opacity: 0.3, marginBottom: 4 }} />
              <div className="font-mono-share" style={{ fontSize: 9, letterSpacing: 3, color: 'var(--text2)', opacity: 0.4 }}>DATE OF ISSUE</div>
              <div className="font-black-han" style={{ fontSize: 'clamp(11px,1.8vw,14px)', color: 'var(--primary)' }}>{today}</div>
              <div className="font-mono-share" style={{ fontSize: 9, letterSpacing: 3, color: 'var(--text2)', opacity: 0.4, marginTop: 8 }}>ISSUED BY</div>
              <div className="font-black-han" style={{ fontSize: 'clamp(11px,1.8vw,14px)', color: 'var(--primary)' }}>인간연합</div>
            </div>
            <div style={{
              width: 'clamp(56px,9vw,80px)', height: 'clamp(56px,9vw,80px)',
              border: '2.5px solid var(--primary)', borderRadius: '50%',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 2, opacity: 0.6,
            }}>
              <span className="font-mono-share" style={{ fontSize: 'clamp(6px,1vw,8px)', letterSpacing: 2, color: 'var(--primary)' }}>HUMAN</span>
              <span className="font-black-han" style={{ fontSize: 'clamp(10px,1.8vw,16px)', color: 'var(--primary)', letterSpacing: 1 }}>인간연합</span>
              <span className="font-mono-share" style={{ fontSize: 'clamp(5px,0.8vw,7px)', letterSpacing: 1, color: 'var(--primary)', opacity: 0.7 }}>ALLIANCE</span>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : null

  return (
    <div style={{ background: 'var(--bg2)', minHeight: '100vh', fontFamily: "'Noto Serif KR', serif" }}>

      {/* 환영 팝업 */}
      {showWelcome && result && (
        <div
          onClick={() => setShowWelcome(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.55)',
          }}
        >
          <div style={{
            background: 'var(--primary)', color: 'var(--cream)',
            padding: '48px 56px', textAlign: 'center', maxWidth: 480,
            border: '2px solid var(--gold)',
          }}>
            <div className="font-mono-share" style={{ fontSize: 10, letterSpacing: 4, opacity: 0.6, marginBottom: 16 }}>
              HUMAN FIRST OATH COMPLETE
            </div>
            <div className="font-black-han" style={{ fontSize: 'clamp(20px,4vw,32px)', lineHeight: 1.4, marginBottom: 20 }}>
              {result.oath_number}님,<br />
              인간연합에 오신 것을<br />환영합니다!
            </div>
            <div className="font-mono-share" style={{ fontSize: 10, letterSpacing: 3, opacity: 0.5 }}>
              클릭하면 닫힙니다
            </div>
          </div>
        </div>
      )}

      {/* NAV */}
      <nav style={{
        background: 'var(--primary)', padding: '0 32px',
        height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link href="/" className="font-black-han" style={{ fontSize: 16, letterSpacing: 2, color: 'var(--cream)', textDecoration: 'none' }}>
          인간연합
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {user ? (
            <>
              <span className="font-mono-share" style={{ fontSize: 11, letterSpacing: 2, color: 'rgba(255,255,255,0.5)' }}>
                {user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email ?? ''}
              </span>
              <button
                onClick={logout}
                className="font-mono-share"
                style={{ background: 'none', border: '1px solid rgba(255,255,255,0.2)', padding: '5px 12px', fontSize: 10, letterSpacing: 2, color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}
              >
                로그아웃
              </button>
            </>
          ) : (
            <button
              onClick={handleLogin}
              className="font-mono-share"
              style={{ background: '#FEE500', color: '#3C1E1E', padding: '6px 14px', fontSize: 10, letterSpacing: 2, border: 'none', cursor: 'pointer', fontWeight: 700 }}
            >
              카카오 로그인
            </button>
          )}
          <Link href="/" className="font-mono-share" style={{ fontSize: 11, letterSpacing: 3, color: 'var(--cream)', opacity: 0.4, textDecoration: 'none' }}>
            ← 홈페이지
          </Link>
        </div>
      </nav>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '60px 24px' }}>

        {/* ── ALREADY SIGNED ── */}
        {stage === 'already_signed' && result && (
          <div>
            <div style={{ background: 'var(--primary)', padding: '40px 48px', marginBottom: 32, textAlign: 'center' }}>
              <div className="font-mono-share" style={{ fontSize: 11, letterSpacing: 4, color: 'var(--cream)', opacity: 0.6, marginBottom: 12 }}>
                ALREADY A MEMBER
              </div>
              <h2 className="font-black-han" style={{ fontSize: 'clamp(22px,4vw,40px)', color: 'var(--cream)', marginBottom: 12 }}>
                이미 서약하셨습니다
              </h2>
              <div className="font-mono-share" style={{ fontSize: 20, letterSpacing: 6, color: 'var(--gold)', marginBottom: 16 }}>
                {result.oath_number}
              </div>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.9, margin: 0 }}>
                이미 인간연합 멤버십이 등록되어 있습니다.<br />
                인증서를 다시 다운로드할 수 있습니다.
              </p>
              {result.is_free_member && (
                <div style={{ marginTop: 16, display: 'inline-block', background: 'var(--cream)', color: 'var(--primary)', padding: '6px 20px' }}>
                  <span className="font-mono-share" style={{ fontSize: 11, letterSpacing: 3 }}>FREE MEMBER</span>
                </div>
              )}
            </div>

            {CertSection}

            <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: '24px 32px', textAlign: 'center' }}>
              <div className="font-mono-share" style={{ fontSize: 9, letterSpacing: 3, color: 'var(--text2)', marginBottom: 8 }}>CONTACT</div>
              <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.8, margin: '0 0 10px' }}>
                인증마크 사용 문의 및 기타 안내는 아래 이메일로 연락해주세요.
              </p>
              <a href="mailto:zphistory5974@gmail.com?subject=인간연합 서약 문의" className="font-mono-share" style={{ fontSize: 12, letterSpacing: 2, color: 'var(--primary)', textDecoration: 'none' }}>
                zphistory5974@gmail.com
              </a>
            </div>
          </div>
        )}

        {/* ── FORM ── */}
        {stage === 'form' && (
          <div style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border)', padding: '48px' }}>
            <h1 className="font-black-han" style={{ fontSize: 'clamp(20px,4vw,32px)', letterSpacing: -1, marginBottom: 8 }}>
              Human First 서약
            </h1>
            <p className="font-serif-kr" style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.9, marginBottom: 36 }}>
              AI를 쓰되, 인간을 해치지 않겠다는 선언입니다.<br />
              서약자 정보를 입력하고 5가지 조항에 동의하면 인증서가 발급됩니다.
            </p>

            {/* progress */}
            <div style={{ marginBottom: 36, padding: '20px 24px', background: 'var(--bg)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span className="font-mono-share" style={{ fontSize: 10, letterSpacing: 3, color: 'var(--text2)' }}>
                  FREE MEMBER 현황
                </span>
                <span className="font-mono-share" style={{ fontSize: 11, letterSpacing: 2, color: 'var(--primary)' }}>
                  {totalCount ?? '—'} / 500
                </span>
              </div>
              <div style={{ height: 4, background: '#e8e8e4', borderRadius: 2 }}>
                <div style={{ height: '100%', background: 'var(--primary)', borderRadius: 2, width: `${pct}%`, transition: 'width 0.8s ease' }} />
              </div>
              {(totalCount ?? 0) >= 500 && (
                <p style={{ marginTop: 12, fontSize: 13, color: '#d93025' }}>
                  * 무료 멤버십 500명이 완료되었습니다. 대기 신청으로 접수됩니다.
                </p>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
              <div style={{ marginBottom: 24, gridColumn: '1 / -1' }}>
                <label className="font-mono-share" style={{ fontSize: 10, letterSpacing: 3, color: 'var(--text2)', display: 'block', marginBottom: 8, textTransform: 'uppercase' }}>
                  이름 *
                </label>
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="홍길동"
                  style={{ width: '100%', padding: '14px 18px', border: '1.5px solid var(--border)', outline: 'none', fontFamily: "'Noto Serif KR', serif", fontSize: 16, background: 'var(--bg-card)', borderRadius: 0 }}
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label className="font-mono-share" style={{ fontSize: 10, letterSpacing: 3, color: 'var(--text2)', display: 'block', marginBottom: 8, textTransform: 'uppercase' }}>
                  직업 / 활동 분야
                </label>
                <input
                  value={form.occupation}
                  onChange={e => setForm(f => ({ ...f, occupation: e.target.value }))}
                  placeholder="디자이너, 학생, 회사원..."
                  style={{ width: '100%', padding: '14px 18px', border: '1.5px solid var(--border)', outline: 'none', fontFamily: "'Noto Serif KR', serif", fontSize: 16, background: 'var(--bg-card)', borderRadius: 0 }}
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label className="font-mono-share" style={{ fontSize: 10, letterSpacing: 3, color: 'var(--text2)', display: 'block', marginBottom: 8, textTransform: 'uppercase' }}>
                  성별 *
                </label>
                <div style={{ display: 'flex', gap: 12 }}>
                  {['남성', '여성'].map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, gender: g }))}
                      className="font-serif-kr"
                      style={{
                        flex: 1, padding: '14px 18px',
                        border: `1.5px solid ${form.gender === g ? 'var(--primary)' : 'var(--border)'}`,
                        background: form.gender === g ? 'var(--primary)' : 'var(--bg-card)',
                        color: form.gender === g ? 'var(--cream)' : 'var(--text)',
                        cursor: 'pointer', fontSize: 16, transition: 'all 0.15s',
                      }}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 24, gridColumn: '1 / -1' }}>
                <label className="font-mono-share" style={{ fontSize: 10, letterSpacing: 3, color: 'var(--text2)', display: 'block', marginBottom: 8, textTransform: 'uppercase' }}>
                  국적
                </label>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div className="font-serif-kr" style={{ flex: 1, padding: '14px 18px', border: '1.5px solid var(--border)', background: 'var(--bg-card)', fontSize: 16, color: 'var(--text)' }}>
                    {form.nationality}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowNatSelect(s => !s)}
                    className="font-mono-share"
                    style={{ padding: '14px 18px', border: '1.5px solid var(--border)', background: showNatSelect ? 'var(--primary)' : 'var(--bg-card)', color: showNatSelect ? 'var(--cream)' : 'var(--text2)', cursor: 'pointer', fontSize: 10, letterSpacing: 2, whiteSpace: 'nowrap', transition: 'all 0.15s' }}
                  >
                    다른 국적 선택 ▼
                  </button>
                </div>
                {showNatSelect && (
                  <select
                    size={7}
                    value={form.nationality}
                    onChange={e => { setForm(f => ({ ...f, nationality: e.target.value })); setShowNatSelect(false) }}
                    style={{ width: '100%', marginTop: 4, border: '1.5px solid var(--primary)', fontFamily: "'Noto Serif KR', serif", fontSize: 15, background: 'var(--bg-card)', color: 'var(--text)', outline: 'none' }}
                  >
                    {['대한민국','미국','일본','중국','영국','캐나다','호주','독일','프랑스','스페인','이탈리아','네덜란드','스웨덴','노르웨이','덴마크','핀란드','스위스','오스트리아','벨기에','포르투갈','폴란드','체코','헝가리','루마니아','그리스','터키','이스라엘','인도','인도네시아','말레이시아','싱가포르','태국','베트남','필리핀','파키스탄','방글라데시','스리랑카','브라질','멕시코','아르헨티나','콜롬비아','칠레','페루','이집트','나이지리아','남아프리카공화국','케냐','에티오피아','기타'].map(c => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                )}
              </div>

              <div style={{ marginBottom: 24, gridColumn: '1 / -1' }}>
                <label className="font-mono-share" style={{ fontSize: 10, letterSpacing: 3, color: 'var(--text2)', display: 'block', marginBottom: 8, textTransform: 'uppercase' }}>
                  이메일 (선택 — 인증마크 전송용)
                </label>
                <input
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  type="email"
                  placeholder="human@example.com"
                  style={{ width: '100%', padding: '14px 18px', border: '1.5px solid var(--border)', outline: 'none', fontFamily: "'Noto Serif KR', serif", fontSize: 16, background: 'var(--bg-card)', borderRadius: 0 }}
                />
              </div>
            </div>

            {error && <p style={{ color: '#d93025', marginBottom: 16, fontSize: 14 }}>{error}</p>}

            <button
              onClick={() => {
                if (!form.name.trim()) { setError('이름을 입력해주세요.'); return }
                if (!form.gender) { setError('성별을 선택해주세요.'); return }
                setError('')
                setStage('articles')
              }}
              className="font-black-han"
              style={{ width: '100%', padding: 18, background: 'var(--primary)', color: 'var(--cream)', border: 'none', fontSize: 18, letterSpacing: 4, cursor: 'pointer', marginTop: 8 }}
            >
              다음: 서약 조항 확인 →
            </button>
          </div>
        )}

        {/* ── ARTICLES ── */}
        {stage === 'articles' && (
          <div>
            <div style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border)', padding: '40px 48px', marginBottom: 24 }}>
              <div className="font-mono-share" style={{ fontSize: 10, letterSpacing: 4, color: 'var(--text2)', marginBottom: 8 }}>HUMAN FIRST OATH</div>
              <h2 className="font-black-han" style={{ fontSize: 'clamp(20px,4vw,32px)', letterSpacing: -1, marginBottom: 4 }}>서약 조항</h2>
              <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 0 }}>각 조항을 읽고 모두 체크하면 서약이 완료됩니다.</p>
            </div>

            {ARTICLES.map((art, i) => (
              <div
                key={i}
                onClick={() => setChecked(prev => { const n = [...prev]; n[i] = !n[i]; return n })}
                style={{
                  background: 'var(--bg-card)', border: `1.5px solid ${checked[i] ? 'var(--primary)' : 'var(--border)'}`,
                  padding: '28px 32px', marginBottom: 16, cursor: 'pointer',
                  display: 'flex', gap: 20, alignItems: 'flex-start', transition: 'border-color 0.2s',
                }}
              >
                <div style={{
                  width: 24, height: 24, border: `2px solid ${checked[i] ? 'var(--primary)' : 'var(--border)'}`,
                  background: checked[i] ? 'var(--primary)' : 'transparent',
                  flexShrink: 0, marginTop: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                }}>
                  {checked[i] && <span style={{ color: 'var(--cream)', fontSize: 14, fontWeight: 'bold', lineHeight: 1 }}>✓</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'baseline', marginBottom: 8 }}>
                    <span className="font-mono-share" style={{ fontSize: 10, letterSpacing: 3, color: 'var(--text2)' }}>{art.num}</span>
                    <span className="font-black-han" style={{ fontSize: 18 }}>{art.title}</span>
                  </div>
                  <p className="font-serif-kr" style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 2, margin: 0 }}>{art.body}</p>
                </div>
              </div>
            ))}

            {error && <p style={{ color: '#d93025', marginBottom: 16, fontSize: 14 }}>{error}</p>}

            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button
                onClick={() => setStage('form')}
                className="font-black-han"
                style={{ padding: '18px 32px', border: '1.5px solid var(--primary)', background: 'var(--bg-card)', fontSize: 14, letterSpacing: 2, cursor: 'pointer' }}
              >
                ← 이전
              </button>
              <button
                onClick={handleSubmit}
                disabled={!allChecked}
                className="font-black-han"
                style={{
                  flex: 1, padding: 18,
                  background: allChecked ? 'var(--primary)' : 'var(--border)',
                  color: allChecked ? 'var(--cream)' : '#fff',
                  border: 'none', fontSize: 18, letterSpacing: 4,
                  cursor: allChecked ? 'pointer' : 'not-allowed', transition: 'background 0.2s',
                }}
              >
                {allChecked ? 'Human First 서약 완료' : `${checked.filter(Boolean).length} / 5 조항 확인 중`}
              </button>
            </div>
          </div>
        )}

        {/* ── SUBMITTING ── */}
        {stage === 'submitting' && (
          <div style={{ textAlign: 'center', padding: '120px 40px' }}>
            <div className="font-mono-share" style={{ fontSize: 12, letterSpacing: 4, color: 'var(--text2)', marginBottom: 24 }}>
              PROCESSING...
            </div>
            <div className="font-black-han" style={{ fontSize: 32 }}>서약을 기록하는 중...</div>
          </div>
        )}

        {/* ── DONE ── */}
        {stage === 'done' && result && (
          <div>
            <div style={{ background: 'var(--primary)', padding: '40px 48px', marginBottom: 32, textAlign: 'center' }}>
              <div className="font-mono-share" style={{ fontSize: 11, letterSpacing: 4, color: 'var(--cream)', opacity: 0.6, marginBottom: 12 }}>
                HUMAN FIRST OATH COMPLETE
              </div>
              <h2 className="font-black-han" style={{ fontSize: 'clamp(24px,5vw,48px)', color: 'var(--cream)', marginBottom: 8 }}>
                서약이 완료되었습니다
              </h2>
              <div className="font-mono-share" style={{ fontSize: 14, letterSpacing: 3, color: 'var(--cream)', opacity: 0.5 }}>
                {result.oath_number}
              </div>
              {result.is_free_member && (
                <div style={{ marginTop: 16, display: 'inline-block', background: 'var(--cream)', color: 'var(--primary)', padding: '6px 20px' }}>
                  <span className="font-mono-share" style={{ fontSize: 11, letterSpacing: 3 }}>FREE MEMBER</span>
                </div>
              )}
            </div>

            {CertSection}

            <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: '24px 32px', marginBottom: 16, textAlign: 'center' }}>
              <div className="font-mono-share" style={{ fontSize: 9, letterSpacing: 3, color: 'var(--text2)', marginBottom: 8 }}>CONTACT</div>
              <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.8, margin: '0 0 10px' }}>
                인증마크 사용 문의 및 기타 안내는 아래 이메일로 연락해주세요.
              </p>
              <a href="mailto:zphistory5974@gmail.com?subject=인간연합 서약 문의" className="font-mono-share" style={{ fontSize: 12, letterSpacing: 2, color: 'var(--primary)', textDecoration: 'none' }}>
                zphistory5974@gmail.com
              </a>
            </div>

            <div style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border)', padding: '40px 48px' }}>
              <h3 className="font-black-han" style={{ fontSize: 20, letterSpacing: -1, marginBottom: 24 }}>다음 단계</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { num: '01', name: '인간 아카이브', desc: '나의 비효율, 침묵, 감정, 열광의 순간들을 기록하세요.' },
                  { num: '02', name: '웹툰 시즌 1', desc: '인간연합이 탄생하게 된 이야기를 읽어보세요.' },
                  { num: '03', name: '굿즈 신청', desc: '아돈노 한정 굿즈를 신청하세요. 선착순 500개.' },
                ].map(({ num, name, desc }) => (
                  <div key={num} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: 16, background: 'var(--bg)', border: '1px solid var(--border)' }}>
                    <span className="font-mono-share" style={{ fontSize: 10, letterSpacing: 2, color: 'var(--cream)', background: 'var(--primary)', padding: '4px 8px', flexShrink: 0 }}>
                      {num}
                    </span>
                    <div>
                      <div className="font-black-han" style={{ fontSize: 16, marginBottom: 4 }}>{name}</div>
                      <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7 }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
