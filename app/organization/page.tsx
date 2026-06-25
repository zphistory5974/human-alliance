'use client'

import { useEffect, useState } from 'react'
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

const ADVISOR_FIELD_GROUPS = [
  { category: '인문학', fields: ['철학', '역사학', '문학', '언어학', '종교학'] },
  { category: '사회과학', fields: ['심리학', '사회학', '정치학', '경제학', '행정학', '국제관계학'] },
  { category: '공학', fields: ['AI/컴퓨터공학', '전자전기공학', '기계공학', '화학공학', '건설환경공학', '산업공학', '로봇공학'] },
  { category: '자연과학', fields: ['물리학', '화학', '생물학', '수학', '천문학'] },
  { category: '의학/생명과학', fields: ['의학', '간호학', '약학', '생명과학', '공공보건학'] },
  { category: '법학', fields: ['법학', '법조계'] },
  { category: '경영/경제', fields: ['경영학', '경제학', '회계학'] },
  { category: '예술/디자인', fields: ['미술', '디자인', '음악', '영화/미디어'] },
  { category: '교육', fields: ['교육학'] },
  { category: '환경/지구과학', fields: ['환경공학', '지구과학', '기후학'] },
  { category: '기타', fields: ['윤리학', '미래학', '데이터사이언스'] },
]

const PARTNER_TYPES = ['학술기관', '기업', 'NGO', '정부기관', '미디어']
const CONTACT_EMAIL = 'zphistory5974@gmail.com'
const ALL_KNOWN_FIELDS = ADVISOR_FIELD_GROUPS.flatMap(g => g.fields)

function AdvisorModal({ advisor, onClose }: { advisor: Advisor; onClose: () => void }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="advisor-modal-backdrop"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(42, 21, 6, 0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        className="advisor-modal-card"
        style={{
          width: '100%', maxWidth: 480,
          background: 'var(--bg-card)',
          border: '1.5px solid var(--border)',
          boxShadow: '0 24px 64px rgba(42, 21, 6, 0.35)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{ background: 'var(--primary)', padding: '32px 32px 28px', position: 'relative' }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 16, right: 16,
              width: 32, height: 32,
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'var(--cream)', cursor: 'pointer',
              fontFamily: "'Share Tech Mono',monospace", fontSize: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            aria-label="닫기"
          >✕</button>

          {/* Field badge */}
          {advisor.field && (
            <div style={{
              display: 'inline-block',
              padding: '3px 10px',
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.25)',
              fontFamily: "'Share Tech Mono',monospace",
              fontSize: 9, letterSpacing: 3,
              color: 'var(--cream)', opacity: 0.85,
              marginBottom: 12,
            }}>
              {advisor.field.toUpperCase()}
            </div>
          )}

          <div className="font-black-han" style={{ fontSize: 28, color: 'var(--cream)', letterSpacing: -1, marginBottom: advisor.title ? 6 : 0 }}>
            {advisor.name}
          </div>
          {advisor.title && (
            <div style={{ fontFamily: "'Noto Serif KR',serif", fontSize: 14, color: 'var(--cream)', opacity: 0.7 }}>
              {advisor.title}
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: '28px 32px 32px' }}>
          {advisor.organization && (
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 20 }}>
              <div className="font-mono-share" style={{ fontSize: 9, letterSpacing: 3, color: 'var(--text2)', opacity: 0.6, whiteSpace: 'nowrap' }}>ORGANIZATION</div>
              <div style={{ width: 1, height: 12, background: 'var(--border)' }} />
              <div style={{ fontFamily: "'Noto Serif KR',serif", fontSize: 14, color: 'var(--text)' }}>{advisor.organization}</div>
            </div>
          )}

          {advisor.bio ? (
            <>
              <div className="font-mono-share" style={{ fontSize: 9, letterSpacing: 3, color: 'var(--text2)', opacity: 0.6, marginBottom: 10 }}>ABOUT</div>
              <p style={{
                fontFamily: "'Noto Serif KR',serif",
                fontSize: 14, lineHeight: 1.9,
                color: 'var(--text)', margin: 0,
              }}>
                {advisor.bio}
              </p>
            </>
          ) : (
            <div style={{ fontFamily: "'Noto Serif KR',serif", fontSize: 13, color: 'var(--text2)', opacity: 0.5, fontStyle: 'italic' }}>
              소개글이 없습니다.
            </div>
          )}

          <div style={{ marginTop: 28, display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={onClose}
              style={{
                padding: '9px 22px',
                background: 'transparent',
                border: '1.5px solid var(--border)',
                color: 'var(--text2)', cursor: 'pointer',
                fontFamily: "'Share Tech Mono',monospace",
                fontSize: 11, letterSpacing: 2,
              }}
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function OrganizationPage() {
  const [advisors, setAdvisors] = useState<Advisor[]>([])
  const [partners, setPartners] = useState<Partner[]>([])
  const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null)

  useEffect(() => {
    supabase.from('advisors').select('id,name,field,title,organization,bio').order('created_at', { ascending: true }).then(({ data }) => { if (data) setAdvisors(data) })
    supabase.from('partners').select('id,name,type,description').order('created_at', { ascending: true }).then(({ data }) => { if (data) setPartners(data) })
  }, [])

  function getAdvisorsByCategory(fields: string[]) {
    return advisors.filter(a => fields.includes(a.field ?? ''))
  }

  function getPartnersByType(type: string) {
    return partners.filter(p => p.type === type)
  }

  const uncategorizedAdvisors = advisors.filter(a => !ALL_KNOWN_FIELDS.includes(a.field ?? ''))

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <NavBar title="조직도" />

      {selectedAdvisor && (
        <AdvisorModal advisor={selectedAdvisor} onClose={() => setSelectedAdvisor(null)} />
      )}

      {/* HERO */}
      <div style={{ background: 'var(--dark)', padding: 'clamp(40px,6vw,64px) clamp(16px,4vw,40px)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
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
          <div style={{ width: '70%', height: 1, background: 'var(--border)', position: 'relative' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, width: 1, height: 32, background: 'var(--border)' }} />
            <div style={{ position: 'absolute', right: 0, top: 0, width: 1, height: 32, background: 'var(--border)' }} />
          </div>
        </div>

        {/* BRANCH HEADERS */}
        <div className="grid-2col-to-1col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 40 }}>
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
        <div className="grid-2col-to-1col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>

          {/* ADVISORS */}
          <div>
            <div className="font-mono-share" style={{ fontSize: 10, letterSpacing: 5, color: 'var(--text2)', marginBottom: 16 }}>분야별 고문위원</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {ADVISOR_FIELD_GROUPS.map(group => {
                const filled = getAdvisorsByCategory(group.fields)
                return (
                  <div key={group.category} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <div className="font-mono-share" style={{ fontSize: 8, letterSpacing: 3, color: 'var(--text2)', opacity: 0.55 }}>{group.category.toUpperCase()}</div>
                      <div style={{ flex: 1, height: 1, background: 'var(--border)', opacity: 0.4 }} />
                    </div>
                    {filled.map(a => (
                      <div
                        key={a.id}
                        className="advisor-card"
                        onClick={() => setSelectedAdvisor(a)}
                        style={{ padding: '14px 16px', background: 'var(--bg-card)', border: '1.5px solid var(--primary)', marginBottom: 4 }}
                      >
                        <div className="font-mono-share" style={{ fontSize: 8, letterSpacing: 3, color: 'var(--primary)', marginBottom: 4 }}>{(a.field ?? '').toUpperCase()}</div>
                        <div className="font-black-han" style={{ fontSize: 15, marginBottom: 2 }}>{a.name}</div>
                        {a.title && <div style={{ fontSize: 12, color: 'var(--text2)' }}>{a.title}</div>}
                        {a.organization && <div style={{ fontSize: 11, color: 'var(--text2)', opacity: 0.7 }}>{a.organization}</div>}
                      </div>
                    ))}
                    <div style={{ padding: '12px 16px', background: 'var(--bg)', border: '1.5px dashed var(--border)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 20, height: 20, border: '1.5px dashed var(--border)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontSize: 12, color: 'var(--border)', lineHeight: 1 }}>+</span>
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text2)', opacity: 0.45 }}>고문위원 모집 중</div>
                    </div>
                  </div>
                )
              })}
              {uncategorizedAdvisors.length > 0 && (
                <div style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <div className="font-mono-share" style={{ fontSize: 8, letterSpacing: 3, color: 'var(--text2)', opacity: 0.55 }}>기타</div>
                    <div style={{ flex: 1, height: 1, background: 'var(--border)', opacity: 0.4 }} />
                  </div>
                  {uncategorizedAdvisors.map(a => (
                    <div
                      key={a.id}
                      className="advisor-card"
                      onClick={() => setSelectedAdvisor(a)}
                      style={{ padding: '14px 16px', background: 'var(--bg-card)', border: '1.5px solid var(--primary)', marginBottom: 4 }}
                    >
                      <div className="font-mono-share" style={{ fontSize: 8, letterSpacing: 3, color: 'var(--primary)', marginBottom: 4 }}>{(a.field ?? '').toUpperCase()}</div>
                      <div className="font-black-han" style={{ fontSize: 15, marginBottom: 2 }}>{a.name}</div>
                      {a.title && <div style={{ fontSize: 12, color: 'var(--text2)' }}>{a.title}</div>}
                      {a.organization && <div style={{ fontSize: 11, color: 'var(--text2)', opacity: 0.7 }}>{a.organization}</div>}
                    </div>
                  ))}
                </div>
              )}
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
