'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'

type Props = {
  service: string
  label?: string
}

export default function NewsletterModal({ service, label = '소식 받기' }: Props) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '' })
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit() {
    if (!form.name.trim() || !form.email.trim()) { setError('이름과 이메일을 모두 입력해주세요.'); return }
    setError('')
    setLoading(true)
    const { error: dbError } = await supabase.from('newsletter_subscribers').insert({
      name: form.name.trim(),
      email: form.email.trim(),
      service,
    })
    if (dbError) { setError('저장 중 오류가 발생했습니다.'); setLoading(false); return }
    setDone(true)
    setLoading(false)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="font-black-han"
        style={{ padding: '14px 32px', background: 'var(--primary)', color: 'var(--cream)', border: 'none', fontSize: 15, letterSpacing: 3, cursor: 'pointer' }}
      >
        {label}
      </button>

      {open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(42,21,6,0.7)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={e => { if (e.target === e.currentTarget) setOpen(false) }}>
          <div style={{ background: 'var(--bg-card)', border: '2px solid var(--primary)', padding: '48px 40px', width: '100%', maxWidth: 460, position: 'relative' }}>
            <button onClick={() => setOpen(false)} style={{ position: 'absolute', top: 16, right: 20, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: 'var(--text2)', lineHeight: 1 }}>×</button>
            {done ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div className="font-black-han" style={{ fontSize: 24, marginBottom: 12 }}>신청 완료</div>
                <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.9, marginBottom: 28 }}>출시 시 이메일로 가장 먼저 알려드리겠습니다.</p>
                <button onClick={() => { setOpen(false); setDone(false); setForm({ name: '', email: '' }) }} className="font-mono-share" style={{ fontSize: 11, letterSpacing: 2, color: 'var(--text2)', border: '1px solid var(--border)', background: 'none', padding: '8px 20px', cursor: 'pointer' }}>닫기</button>
              </div>
            ) : (
              <>
                <div className="font-mono-share" style={{ fontSize: 10, letterSpacing: 5, color: 'var(--text2)', marginBottom: 12 }}>{service.toUpperCase()} · 출시 알림</div>
                <h3 className="font-black-han" style={{ fontSize: 22, letterSpacing: -1, marginBottom: 8 }}>소식 받기</h3>
                <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.9, marginBottom: 28 }}>출시 소식을 이메일로 가장 먼저 받아보세요.</p>
                <div style={{ marginBottom: 16 }}>
                  <label className="font-mono-share" style={{ fontSize: 10, letterSpacing: 3, color: 'var(--text2)', display: 'block', marginBottom: 8 }}>이름</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="홍길동" style={{ width: '100%', padding: '12px 16px', border: '1.5px solid var(--border)', outline: 'none', fontFamily: "'Noto Serif KR',serif", fontSize: 15, background: '#fff', color: 'var(--text)', borderRadius: 0 }} />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label className="font-mono-share" style={{ fontSize: 10, letterSpacing: 3, color: 'var(--text2)', display: 'block', marginBottom: 8 }}>이메일</label>
                  <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} onKeyDown={e => e.key === 'Enter' && handleSubmit()} type="email" placeholder="human@example.com" style={{ width: '100%', padding: '12px 16px', border: '1.5px solid var(--border)', outline: 'none', fontFamily: "'Noto Serif KR',serif", fontSize: 15, background: '#fff', color: 'var(--text)', borderRadius: 0 }} />
                </div>
                {error && <p style={{ color: '#c0392b', fontSize: 13, marginBottom: 12 }}>{error}</p>}
                <button onClick={handleSubmit} disabled={loading} className="font-black-han" style={{ width: '100%', padding: 16, background: 'var(--primary)', color: 'var(--cream)', border: 'none', fontSize: 16, letterSpacing: 3, cursor: loading ? 'wait' : 'pointer' }}>
                  {loading ? '처리 중...' : '신청하기'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
