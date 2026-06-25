'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import NavBar from '../../components/NavBar'
import { supabase } from '../../lib/supabase'

type Advisor = {
  id: string
  name: string
  field: string | null
  title: string | null
  organization: string | null
  bio: string | null
}

type Partner = {
  id: string
  name: string
  type: string | null
  description: string | null
}

const ADVISOR_FIELDS = ['철학', '심리학', 'AI 윤리', '법학', '사회학', '문화/예술', '국제관계']
const PARTNER_TYPES = ['학술기관', '기업', 'NGO', '정부기관', '미디어']
const CONTACT_EMAIL = 'zphistory5974@gmail.com'

export default function OrganizationPage() {
  const [advisors, setAdvisors] = useState<Advisor[]>([])
  const [partners, setPartners] = useState<Partner[]>([])

  useEffect(() => {
    supabase.from('advisors').select('id,name,field,title,organization,bio').order('created_at', { ascending: true }).then(({ data }) => { if (data) setAdvisors(data) })
    supabase.from('partners').select('id,name,type,description').order('created_at', { ascending: true }).then(({ data }) => { if (data) setPartners(data) })
  }, [])

  function getAdvisorsByField(field: string) {
    return advisors.filter(a => a.field === field)
  }

  function getPartnersByType(type: string) {
    return partners.filter(p => p.type === type)
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <NavBar title="조직도" />

      {/* HERO */}
      <div style={{ background: 'var(--dark)', padding: '64px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: `repeating-linear-gradient(0deg,transparent,transparent 79px,rgba(196,136,42,0.03) 79px,rgba(196,136,42,0.03) 80px)` }} />
        <div style={{ position: 'relative' }}>
          <div className="font-mono-share" style={{ fontSize: 10, letterSpacing: 6, color: 'var(--gold)', opacity: 0.5, marginBottom: 16 }}>HUMAN ALLIANCE · ORGANIZATION</div>
          <h1 className="font-black-han" style={{ fontSize: 'clamp(28px,6vw,56px)', color: 'var(--cream)', letterSpacing: -1 }}>조직도</h1>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '64px 24px' }}>

        {/* TOP NODE */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ background: 'var(--primary)', color: 'var(--cream)', padding: '28px 60px', textAlign: 'center' }}>
            <div className="font-mono-share" style={{ fontSize: 9, letterSpacing: 4, opacity: 0.5, marginBottom: 6 }}>FOUNDED 2026</div>
            <div className="font-black-han" style={{ fontSize: 28, letterSpacing: -1, marginBottom: 4 }}>인간연합</div>
            <div className="font-mono-share" style={{ fontSize: 10, letterSpacing: 3, opacity: 0.4 }}>HUMAN ALLIANCE</div>
          </div>
          <div style={{ width: 1, height: 40, background: 'var(--border)' }} />
          {/* Horizontal branch */}
          <div style={{ width: '70%', height: 1, background: 'var(--border)', position: 'relative' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, width: 1, height: 32, background: 'var(--border)' }} />
            <div style={{ position: 'absolute', right: 0, top: 0, width: 1, height: 32, background: 'var(--border)' }} />
          </div>
        </div>

        {/* BRANCH HEADERS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 40 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ background: 'var(--bg-card)', border: '1.5px solid var(--primary)', padding: '14px 28px', textAlign: 'center', marginBottom: 28 }}>
              <div className="font-mono-share" style={{ fontSize: 9, letterSpacing: 3, color: 'var(--text2)', marginBottom: 4 }}>ADVISORY BOARD</div>
              <div className="font-black-han" style={{ fontSize: 17 }}>고문위원회</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border)', padding: '14px 28px', textAlign: 'center', marginBottom: 28 }}>
              <div className="font-mono-share" style={{ fontSize: 9, letterSpacing: 3, color: 'var(--text2)', marginBottom: 4 }}>PARTNERSHIPS</div>
              <div className="font-black-han" style={{ fontSize: 17 }}>파트너십</div>
            </div>
          </div>
        </div>

        {/* ADVISORS + PARTNERS GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>

          {/* ADVISORS — 7 fields, multiple per field */}
          <div>
            <div className="font-mono-share" style={{ fontSize: 10, letterSpacing: 5, color: 'var(--text2)', marginBottom: 16 }}>분야별 고문위원</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {ADVISOR_FIELDS.map(field => {
                const filled = getAdvisorsByField(field)
                return (
                  <div key={field}>
                    {/* 채워진 슬롯 */}
                    {filled.map(a => (
                      <div key={a.id} style={{ padding: '16px 18px', background: 'var(--bg-card)', border: '1.5px solid var(--primary)', marginBottom: 4 }}>
                        <div className="font-mono-share" style={{ fontSize: 9, letterSpacing: 3, color: 'var(--primary)', marginBottom: 5 }}>{field.toUpperCase()}</div>
                        <div className="font-black-han" style={{ fontSize: 16, marginBottom: 3 }}>{a.name}</div>
                        {a.title && <div style={{ fontSize: 12, color: 'var(--text2)' }}>{a.title}</div>}
                        {a.organization && <div style={{ fontSize: 11, color: 'var(--text2)', opacity: 0.7 }}>{a.organization}</div>}
                      </div>
                    ))}
                    {/* 빈 슬롯 (항상 1개) */}
                    <div style={{ padding: '14px 18px', background: 'var(--bg)', border: '1.5px dashed var(--border)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 24, height: 24, border: '1.5px dashed var(--border)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontSize: 14, color: 'var(--border)', lineHeight: 1 }}>+</span>
                      </div>
                      <div>
                        <div className="font-mono-share" style={{ fontSize: 8, letterSpacing: 3, color: 'var(--text2)', opacity: 0.4, marginBottom: 3 }}>{field.toUpperCase()}</div>
                        <div style={{ fontSize: 12, color: 'var(--text2)', opacity: 0.45 }}>고문위원 모집 중</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* PARTNERS */}
          <div>
            <div className="font-mono-share" style={{ fontSize: 10, letterSpacing: 5, color: 'var(--text2)', marginBottom: 16 }}>협력 기관 및 기업</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 24 }}>
              {PARTNER_TYPES.map(type => {
                const filled = getPartnersByType(type)
                return (
                  <div key={type}>
                    {filled.map(p => (
                      <div key={p.id} style={{ padding: '16px 18px', background: 'var(--bg-card)', border: '1.5px solid var(--border)', marginBottom: 4 }}>
                        <div className="font-mono-share" style={{ fontSize: 9, letterSpacing: 3, color: 'var(--text2)', marginBottom: 5 }}>{type.toUpperCase()}</div>
                        <div className="font-black-han" style={{ fontSize: 16, marginBottom: 3 }}>{p.name}</div>
                        {p.description && <div style={{ fontSize: 12, color: 'var(--text2)' }}>{p.description}</div>}
                      </div>
                    ))}
                    <div style={{ padding: '14px 18px', background: 'var(--bg)', border: '1.5px dashed var(--border)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 24, height: 24, border: '1.5px dashed var(--border)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontSize: 14, color: 'var(--border)', lineHeight: 1 }}>+</span>
                      </div>
                      <div>
                        <div className="font-mono-share" style={{ fontSize: 8, letterSpacing: 3, color: 'var(--text2)', opacity: 0.4, marginBottom: 3 }}>{type.toUpperCase()}</div>
                        <div style={{ fontSize: 12, color: 'var(--text2)', opacity: 0.45 }}>파트너 모집 중</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* CONTACT */}
            <div style={{ padding: '24px', background: 'var(--primary)', color: 'var(--cream)' }}>
              <div className="font-mono-share" style={{ fontSize: 9, letterSpacing: 3, opacity: 0.5, marginBottom: 10 }}>CONTACT</div>
              <div className="font-black-han" style={{ fontSize: 16, marginBottom: 8 }}>고문위원 · 파트너십 문의</div>
              <div style={{ fontSize: 13, opacity: 0.75, lineHeight: 1.8, marginBottom: 14 }}>
                고문위원 제안 또는 파트너십 문의는<br />아래 이메일로 연락해주세요.
              </div>
              <a href={`mailto:${CONTACT_EMAIL}?subject=인간연합 고문위원/파트너십 문의`}
                style={{ display: 'inline-block', background: 'var(--dark)', color: 'var(--cream)', padding: '10px 20px', fontFamily: "'Share Tech Mono',monospace", fontSize: 11, letterSpacing: 2, textDecoration: 'none' }}>
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
