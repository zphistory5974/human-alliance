'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'
import NavBar from '../../components/NavBar'

export default function CertificatePage() {
  const [form, setForm] = useState({ name: '', occupation: '', number: '' })
  const [result, setResult] = useState<{ name: string; number: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const certRef = useRef<HTMLDivElement>(null)

  const today = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })

  async function handleGenerate() {
    if (!form.name.trim()) { setError('이름을 입력해주세요.'); return }
    setError('')
    setLoading(true)

    let oathNumber = form.number.trim()
    if (!oathNumber) {
      const { count } = await supabase.from('oath_signers').select('*', { count: 'exact', head: true })
      oathNumber = `HA-${String((count ?? 0) + 1).padStart(3, '0')}`
    }

    setResult({ name: form.name.trim(), number: oathNumber })
    setLoading(false)
  }

  async function downloadPDF() {
    if (!certRef.current || !result) return
    const { default: html2canvas } = await import('html2canvas')
    const { default: jsPDF } = await import('jspdf')
    const canvas = await html2canvas(certRef.current, { scale: 3, useCORS: true, backgroundColor: '#FDFAF5' })
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 297, 210)
    pdf.save(`인간다움_인증서_${result.number}.pdf`)
  }

  return (
    <div style={{ background: 'var(--bg2)', minHeight: '100vh' }}>
      <NavBar title="인간다움 인증서" />

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '60px 24px' }}>

        {/* FORM */}
        {!result && (
          <div style={{ background: 'var(--bg-card)', border: `1.5px solid var(--border)`, padding: 48, marginBottom: 40 }}>
            <h1 className="font-black-han" style={{ fontSize: 'clamp(20px,4vw,32px)', letterSpacing: -1, marginBottom: 8 }}>인간다움 인증서 발급</h1>
            <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.9, marginBottom: 36 }}>
              정보를 입력하면 인간다움 인증서가 생성됩니다.<br />
              서약을 완료하지 않으셨다면 <Link href="/oath" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>서약 페이지</Link>에서 먼저 서약해주세요.
            </p>
            <div style={{ marginBottom: 24 }}>
              <label className="font-mono-share" style={{ fontSize: 10, letterSpacing: 3, color: 'var(--text2)', display: 'block', marginBottom: 8 }}>이름 *</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="홍길동" style={{ width: '100%', padding: '14px 18px', border: `1.5px solid var(--border)`, outline: 'none', fontFamily: "'Noto Serif KR',serif", fontSize: 16, background: '#fff', color: 'var(--text)', borderRadius: 0 }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
              <div>
                <label className="font-mono-share" style={{ fontSize: 10, letterSpacing: 3, color: 'var(--text2)', display: 'block', marginBottom: 8 }}>직업 / 활동 분야</label>
                <input value={form.occupation} onChange={e => setForm(f => ({ ...f, occupation: e.target.value }))} placeholder="디자이너, 학생..." style={{ width: '100%', padding: '14px 18px', border: `1.5px solid var(--border)`, outline: 'none', fontFamily: "'Noto Serif KR',serif", fontSize: 16, background: '#fff', color: 'var(--text)', borderRadius: 0 }} />
              </div>
              <div>
                <label className="font-mono-share" style={{ fontSize: 10, letterSpacing: 3, color: 'var(--text2)', display: 'block', marginBottom: 8 }}>서약 번호 (선택)</label>
                <input value={form.number} onChange={e => setForm(f => ({ ...f, number: e.target.value }))} placeholder="HA-001" style={{ width: '100%', padding: '14px 18px', border: `1.5px solid var(--border)`, outline: 'none', fontFamily: "'Share Tech Mono',monospace", fontSize: 16, background: '#fff', color: 'var(--text)', borderRadius: 0 }} />
              </div>
            </div>
            {error && <p style={{ color: '#c0392b', marginBottom: 16, fontSize: 14 }}>{error}</p>}
            <button onClick={handleGenerate} disabled={loading} className="font-black-han" style={{ width: '100%', padding: 18, background: 'var(--primary)', color: 'var(--cream)', border: 'none', fontSize: 18, letterSpacing: 4, cursor: loading ? 'wait' : 'pointer' }}>
              {loading ? '생성 중...' : '인증서 생성하기'}
            </button>
          </div>
        )}

        {/* CERTIFICATE */}
        {result && (
          <>
            <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
              <button onClick={downloadPDF} className="font-black-han" style={{ flex: 1, minWidth: 200, padding: '16px 32px', background: 'var(--primary)', color: 'var(--cream)', border: 'none', fontSize: 14, letterSpacing: 3, cursor: 'pointer' }}>인증서 PDF 다운로드</button>
              <button onClick={() => setResult(null)} className="font-black-han" style={{ padding: '16px 32px', background: 'var(--bg-card)', color: 'var(--text)', border: `1.5px solid var(--border)`, fontSize: 14, letterSpacing: 3, cursor: 'pointer' }}>다시 만들기</button>
            </div>

            <div ref={certRef} style={{ background: 'var(--bg-card)', width: '100%', aspectRatio: '1.414/1', position: 'relative', overflow: 'hidden', border: `2px solid var(--primary)`, marginBottom: 32 }}>
              {/* grid bg */}
              <div style={{ position: 'absolute', inset: 0, background: `repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(92,46,14,0.03) 39px,rgba(92,46,14,0.03) 40px), repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(92,46,14,0.03) 39px,rgba(92,46,14,0.03) 40px)` }} />
              {/* top bar */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 8, background: 'var(--primary)' }} />
              {/* side bar */}
              <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 72, background: 'var(--dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="font-mono-share" style={{ fontSize: 9, letterSpacing: 4, color: 'var(--cream)', opacity: 0.6, writingMode: 'vertical-rl', transform: 'rotate(180deg)', whiteSpace: 'nowrap' }}>HUMAN ALLIANCE · ZERO PRODUCTIVE</span>
              </div>
              {/* deco */}
              <div style={{ position: 'absolute', right: 0, bottom: 0, opacity: 0.04 }}>
                <svg width="140" height="140" viewBox="0 0 100 100"><text x="50" y="90" textAnchor="middle" fontFamily="Black Han Sans" fontSize="100" fill="var(--primary)">人</text></svg>
              </div>
              {/* body */}
              <div style={{ position: 'absolute', top: 32, left: 100, right: 32, bottom: 32, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span className="font-mono-share" style={{ fontSize: 10, letterSpacing: 4, color: 'var(--text2)', opacity: 0.5 }}>HUMAN ALLIANCE</span>
                  <span className="font-mono-share" style={{ fontSize: 10, letterSpacing: 2, color: 'var(--text2)', opacity: 0.4 }}>{result.number}</span>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16 }}>
                  <div className="font-mono-share" style={{ fontSize: 9, letterSpacing: 5, color: 'var(--text2)', opacity: 0.4 }}>Certificate of Humanity</div>
                  <h2 className="font-black-han" style={{ fontSize: 'clamp(18px,3.5vw,36px)', color: 'var(--text)', lineHeight: 1.1, letterSpacing: -1, margin: 0 }}>인간다움 인증서</h2>
                  <div className="font-serif-kr" style={{ fontSize: 'clamp(22px,4.5vw,48px)', fontWeight: 900, color: 'var(--text)', borderBottom: `2px solid var(--primary)`, paddingBottom: 8, display: 'inline-block' }}>{result.name}</div>
                  <p style={{ fontSize: 'clamp(11px,1.8vw,15px)', color: 'var(--text2)', lineHeight: 1.9, maxWidth: 480 }}>위 사람은 모른다고 말할 권리, 침묵할 자유, 비효율을 사랑하는 능력을 가진 인간임을 이에 인증합니다.</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <div style={{ width: 140, height: 1, background: 'var(--primary)', opacity: 0.3, marginBottom: 4 }} />
                    <div className="font-mono-share" style={{ fontSize: 9, letterSpacing: 3, color: 'var(--text2)', opacity: 0.4 }}>DATE OF ISSUE</div>
                    <div className="font-black-han" style={{ fontSize: 'clamp(11px,1.8vw,14px)', color: 'var(--text)' }}>{today}</div>
                    <div className="font-mono-share" style={{ fontSize: 9, letterSpacing: 3, color: 'var(--text2)', opacity: 0.4, marginTop: 8 }}>ISSUED BY</div>
                    <div className="font-black-han" style={{ fontSize: 'clamp(11px,1.8vw,14px)', color: 'var(--text)' }}>인간연합</div>
                  </div>
                  <div style={{ width: 'clamp(56px,9vw,80px)', height: 'clamp(56px,9vw,80px)', border: `2.5px solid var(--primary)`, borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, opacity: 0.7 }}>
                    <span className="font-mono-share" style={{ fontSize: 'clamp(6px,1vw,8px)', letterSpacing: 2, color: 'var(--primary)' }}>HUMAN</span>
                    <span className="font-black-han" style={{ fontSize: 'clamp(10px,1.8vw,16px)', color: 'var(--primary)', letterSpacing: 1 }}>인간연합</span>
                    <span className="font-mono-share" style={{ fontSize: 'clamp(5px,0.8vw,7px)', letterSpacing: 1, color: 'var(--primary)', opacity: 0.7 }}>ALLIANCE</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
