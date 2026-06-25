'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const TH = { padding: '12px 16px', textAlign: 'left' as const, fontFamily: "'Share Tech Mono',monospace", fontSize: 10, letterSpacing: 2, whiteSpace: 'nowrap' as const }
const TD = { padding: '10px 16px' }
const mono = { fontFamily: "'Share Tech Mono',monospace" }
const han = { fontFamily: "'Black Han Sans',sans-serif" }

type OathSigner = { id: number; oath_number: string; name: string; gender: string | null; nationality: string | null; occupation: string | null; email: string | null; created_at: string }
type ArchivePost = { id: number; title: string; category: string; created_at: string }
type NewsletterSub = { id: string; name: string | null; email: string; service: string; created_at: string }
type Advisor = { id: string; name: string; field: string | null; title: string | null; organization: string | null; bio: string | null }
type Partner = { id: string; name: string; type: string | null; description: string | null }
type LectureApplicant = { id: number; kakao_id: string | null; created_at: string }
type SilenceApplicant = { id: number; kakao_id: string | null; created_at: string }
type GoodsOrder = { kakao_id: string | null; goods_name: string | null; created_at: string }

const ADVISOR_FIELDS = ['철학', '심리학', 'AI 윤리', '법학', '사회학', '문화/예술', '국제관계']
const PARTNER_TYPES = ['학술기관', '기업', 'NGO', '정부기관', '미디어']

function Section({ title }: { title: string }) {
  return <h2 style={{ ...han, fontSize: 22, letterSpacing: -1, marginBottom: 20 }}>{title}</h2>
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(true)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  // Data
  const [signers, setSigners] = useState<OathSigner[]>([])
  const [goodsCount, setGoodsCount] = useState<number | null>(null)
  const [archive, setArchive] = useState<ArchivePost[]>([])
  const [newsletter, setNewsletter] = useState<NewsletterSub[]>([])
  const [newsletterFilter, setNewsletterFilter] = useState('전체')
  const [advisors, setAdvisors] = useState<Advisor[]>([])
  const [partners, setPartners] = useState<Partner[]>([])
  const [lectureApplicants, setLectureApplicants] = useState<LectureApplicant[]>([])
  const [silenceApplicants, setSilenceApplicants] = useState<SilenceApplicant[]>([])
  const [goodsOrders, setGoodsOrders] = useState<GoodsOrder[]>([])

  // Advisor form
  const [aForm, setAForm] = useState({ name: '', field: '철학', title: '', organization: '', bio: '' })
  const [aSaving, setASaving] = useState(false)
  const [aError, setAError] = useState('')

  // Partner form
  const [pForm, setPForm] = useState({ name: '', type: '학술기관', description: '' })
  const [pSaving, setPSaving] = useState(false)
  const [pError, setPError] = useState('')

  useEffect(() => {
    fetch('/api/admin/auth').then(r => { setAuthed(r.ok); setChecking(false) })
  }, [])

  useEffect(() => {
    if (!authed) return
    loadData()
  }, [authed])

  async function loadData() {
    const [s, g, l, sd, a, n, adv, par] = await Promise.all([
      supabase.from('oath_signers').select('id,oath_number,name,gender,nationality,occupation,email,created_at').order('created_at', { ascending: false }),
      supabase.from('goods_orders').select('kakao_id,goods_name,created_at').not('kakao_id', 'is', null).order('created_at', { ascending: false }),
      supabase.from('lecture_waitlist').select('id,kakao_id,created_at').order('created_at', { ascending: false }),
      supabase.from('silence_day_participants').select('id,kakao_id,created_at').order('created_at', { ascending: false }),
      supabase.from('archive_posts').select('id,title,category,created_at').order('created_at', { ascending: false }),
      supabase.from('newsletter_subscribers').select('id,name,email,service,created_at').order('created_at', { ascending: false }),
      supabase.from('advisors').select('id,name,field,title,organization,bio').order('created_at', { ascending: true }),
      supabase.from('partners').select('id,name,type,description').order('created_at', { ascending: true }),
    ])
    if (s.data) setSigners(s.data)
    if (g.data) { setGoodsOrders(g.data); setGoodsCount(g.data.length) }
    if (l.data) setLectureApplicants(l.data)
    if (sd.data) setSilenceApplicants(sd.data)
    if (a.data) setArchive(a.data)
    if (n.data) setNewsletter(n.data)
    if (adv.data) setAdvisors(adv.data)
    if (par.data) setPartners(par.data)
  }

  async function handleLogin() {
    setLoginError('')
    const res = await fetch('/api/admin/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) })
    if (res.ok) setAuthed(true)
    else setLoginError('비밀번호가 틀렸습니다.')
  }

  async function deleteArchivePost(id: number) {
    if (!confirm('정말 삭제하시겠습니까?')) return
    const { error } = await supabase.from('archive_posts').delete().eq('id', id)
    if (!error) setArchive(prev => prev.filter(p => p.id !== id))
  }

  async function addAdvisor() {
    if (!aForm.name.trim()) return
    setASaving(true)
    setAError('')
    const { data, error } = await supabase
      .from('advisors')
      .insert({ name: aForm.name.trim(), field: aForm.field, title: aForm.title.trim() || null, organization: aForm.organization.trim() || null, bio: aForm.bio.trim() || null })
      .select('id,name,field,title,organization,bio')
      .single()
    if (error) { setAError(error.message) }
    else if (data) { setAdvisors(prev => [...prev, data]); setAForm({ name: '', field: '철학', title: '', organization: '', bio: '' }) }
    setASaving(false)
  }

  async function deleteAdvisor(id: string) {
    if (!confirm('삭제하시겠습니까?')) return
    const { error } = await supabase.from('advisors').delete().eq('id', id)
    if (error) alert('삭제 실패: ' + error.message)
    else setAdvisors(prev => prev.filter(a => a.id !== id))
  }

  async function addPartner() {
    if (!pForm.name.trim()) return
    setPSaving(true)
    setPError('')
    const { data, error } = await supabase
      .from('partners')
      .insert({ name: pForm.name.trim(), type: pForm.type, description: pForm.description.trim() || null })
      .select('id,name,type,description')
      .single()
    if (error) { setPError(error.message) }
    else if (data) { setPartners(prev => [...prev, data]); setPForm({ name: '', type: '학술기관', description: '' }) }
    setPSaving(false)
  }

  async function deletePartner(id: string) {
    if (!confirm('삭제하시겠습니까?')) return
    const { error } = await supabase.from('partners').delete().eq('id', id)
    if (error) alert('삭제 실패: ' + error.message)
    else setPartners(prev => prev.filter(p => p.id !== id))
  }

  if (checking) {
    return <div style={{ background: 'var(--dark)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ ...mono, color: 'var(--cream)', letterSpacing: 4 }}>LOADING...</span></div>
  }

  if (!authed) {
    return (
      <div style={{ background: 'var(--dark)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 360, padding: 48, background: 'var(--primary)' }}>
          <div style={{ ...mono, fontSize: 10, letterSpacing: 6, color: 'var(--cream)', opacity: 0.5, marginBottom: 24 }}>HUMAN ALLIANCE ADMIN</div>
          <h1 style={{ ...han, fontSize: 28, color: 'var(--cream)', marginBottom: 32, letterSpacing: -1 }}>관리자 로그인</h1>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} placeholder="비밀번호"
            style={{ width: '100%', padding: '14px 18px', border: 'none', outline: 'none', fontSize: 16, fontFamily: "'Noto Serif KR',serif", marginBottom: 12, background: '#fff', color: 'var(--text)' }} />
          {loginError && <p style={{ color: '#ffb3b3', fontSize: 13, marginBottom: 12 }}>{loginError}</p>}
          <button onClick={handleLogin} style={{ width: '100%', padding: 16, background: 'var(--dark)', color: 'var(--cream)', border: 'none', ...han, fontSize: 16, letterSpacing: 4, cursor: 'pointer' }}>로그인</button>
        </div>
      </div>
    )
  }

  const inputStyle = { padding: '10px 14px', border: '1.5px solid var(--border)', outline: 'none', fontFamily: "'Noto Serif KR',serif", fontSize: 14, background: '#fff', color: 'var(--text)', borderRadius: 0 }
  const selectStyle = { ...inputStyle, appearance: 'none' as const }

  return (
    <div style={{ background: 'var(--bg2)', minHeight: '100vh', fontFamily: "'Noto Serif KR',serif" }}>
      <nav style={{ background: 'var(--dark)', height: 52, display: 'flex', alignItems: 'center', padding: '0 32px', justifyContent: 'space-between' }}>
        <span style={{ ...han, fontSize: 16, letterSpacing: 2, color: 'var(--cream)' }}>인간연합 관리자</span>
        <span style={{ ...mono, fontSize: 10, letterSpacing: 3, color: 'rgba(255,255,255,0.3)' }}>ADMIN DASHBOARD</span>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>

        {/* STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16, marginBottom: 48 }}>
          {[
            { label: '총 서약자', value: signers.length, sub: 'OATH SIGNERS' },
            { label: '굿즈 관심 신청', value: goodsOrders.length, sub: 'GOODS ORDERS' },
            { label: '강의 신청', value: lectureApplicants.length, sub: 'LECTURE WAITLIST' },
            { label: '침묵의 날 신청', value: silenceApplicants.length, sub: 'SILENCE DAY' },
          ].map(({ label, value, sub }) => (
            <div key={label} style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border)', padding: '28px 24px' }}>
              <div style={{ ...mono, fontSize: 9, letterSpacing: 4, color: 'var(--text2)', marginBottom: 8 }}>{sub}</div>
              <div style={{ ...han, fontSize: 40, color: 'var(--primary)', lineHeight: 1 }}>{value}</div>
              <div style={{ ...mono, fontSize: 11, letterSpacing: 2, color: 'var(--text2)', marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* OATH SIGNERS */}
        <div style={{ marginBottom: 48 }}>
          <Section title="서약자 목록" />
          <div style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border)', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead><tr style={{ background: 'var(--dark)', color: 'var(--cream)' }}>
                {['번호', '이름', '성별', '국적', '직업', '이메일', '날짜'].map(h => <th key={h} style={TH}>{h}</th>)}
              </tr></thead>
              <tbody>
                {signers.map((s, i) => (
                  <tr key={s.id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg)' }}>
                    <td style={{ ...TD, ...mono, color: 'var(--primary)', whiteSpace: 'nowrap' }}>{s.oath_number}</td>
                    <td style={{ ...TD, whiteSpace: 'nowrap' }}>{s.name}</td>
                    <td style={{ ...TD, color: 'var(--text2)' }}>{s.gender ?? '—'}</td>
                    <td style={{ ...TD, color: 'var(--text2)', whiteSpace: 'nowrap' }}>{s.nationality ?? '—'}</td>
                    <td style={{ ...TD, color: 'var(--text2)' }}>{s.occupation ?? '—'}</td>
                    <td style={{ ...TD, color: 'var(--text2)', fontSize: 12 }}>{s.email ?? '—'}</td>
                    <td style={{ ...TD, ...mono, fontSize: 11, color: 'var(--text2)', whiteSpace: 'nowrap' }}>{new Date(s.created_at).toLocaleDateString('ko-KR')}</td>
                  </tr>
                ))}
                {signers.length === 0 && <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: 'var(--text2)' }}>서약자가 없습니다.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        {/* GOODS ORDERS */}
        <div style={{ marginBottom: 48 }}>
          <Section title={`굿즈 관심 신청 (${goodsOrders.length}건)`} />
          <div style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border)', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead><tr style={{ background: 'var(--dark)', color: 'var(--cream)' }}>
                {['#', '굿즈', 'Kakao ID', '신청일'].map(h => <th key={h} style={TH}>{h}</th>)}
              </tr></thead>
              <tbody>
                {goodsOrders.map((o, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg)' }}>
                    <td style={{ ...TD, ...mono, color: 'var(--text2)', fontSize: 11 }}>{i + 1}</td>
                    <td style={{ ...TD, ...mono, fontSize: 11, color: 'var(--primary)' }}>{o.goods_name ?? '—'}</td>
                    <td style={{ ...TD, ...mono, fontSize: 12, color: 'var(--text2)' }}>{o.kakao_id ?? '—'}</td>
                    <td style={{ ...TD, ...mono, fontSize: 11, color: 'var(--text2)', whiteSpace: 'nowrap' }}>{new Date(o.created_at).toLocaleDateString('ko-KR')}</td>
                  </tr>
                ))}
                {goodsOrders.length === 0 && <tr><td colSpan={4} style={{ padding: 40, textAlign: 'center', color: 'var(--text2)' }}>신청 내역이 없습니다.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        {/* LECTURE APPLICANTS */}
        <div style={{ marginBottom: 48 }}>
          <Section title={`강의 신청자 (${lectureApplicants.length}명)`} />
          <div style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border)', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead><tr style={{ background: 'var(--dark)', color: 'var(--cream)' }}>
                {['#', 'Kakao ID', '신청일'].map(h => <th key={h} style={TH}>{h}</th>)}
              </tr></thead>
              <tbody>
                {lectureApplicants.map((a, i) => (
                  <tr key={a.id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg)' }}>
                    <td style={{ ...TD, ...mono, color: 'var(--text2)', fontSize: 11 }}>{i + 1}</td>
                    <td style={{ ...TD, ...mono, fontSize: 12, color: 'var(--primary)' }}>{a.kakao_id ?? '—'}</td>
                    <td style={{ ...TD, ...mono, fontSize: 11, color: 'var(--text2)', whiteSpace: 'nowrap' }}>{new Date(a.created_at).toLocaleDateString('ko-KR')}</td>
                  </tr>
                ))}
                {lectureApplicants.length === 0 && <tr><td colSpan={3} style={{ padding: 40, textAlign: 'center', color: 'var(--text2)' }}>신청자가 없습니다.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        {/* SILENCE DAY APPLICANTS */}
        <div style={{ marginBottom: 48 }}>
          <Section title={`침묵의 날 신청자 (${silenceApplicants.length}명)`} />
          <div style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border)', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead><tr style={{ background: 'var(--dark)', color: 'var(--cream)' }}>
                {['#', 'Kakao ID', '신청일'].map(h => <th key={h} style={TH}>{h}</th>)}
              </tr></thead>
              <tbody>
                {silenceApplicants.map((a, i) => (
                  <tr key={a.id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg)' }}>
                    <td style={{ ...TD, ...mono, color: 'var(--text2)', fontSize: 11 }}>{i + 1}</td>
                    <td style={{ ...TD, ...mono, fontSize: 12, color: 'var(--primary)' }}>{a.kakao_id ?? '—'}</td>
                    <td style={{ ...TD, ...mono, fontSize: 11, color: 'var(--text2)', whiteSpace: 'nowrap' }}>{new Date(a.created_at).toLocaleDateString('ko-KR')}</td>
                  </tr>
                ))}
                {silenceApplicants.length === 0 && <tr><td colSpan={3} style={{ padding: 40, textAlign: 'center', color: 'var(--text2)' }}>신청자가 없습니다.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        {/* ADVISORS */}
        <div style={{ marginBottom: 48 }}>
          <Section title="고문위원 관리" />
          {/* Add form */}
          <div style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border)', padding: '24px', marginBottom: 16 }}>
            <div style={{ ...mono, fontSize: 9, letterSpacing: 3, color: 'var(--text2)', marginBottom: 14 }}>고문위원 추가</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 10, marginBottom: 10 }}>
              <input value={aForm.name} onChange={e => setAForm(f => ({ ...f, name: e.target.value }))} placeholder="이름 *" style={inputStyle} />
              <select value={aForm.field} onChange={e => setAForm(f => ({ ...f, field: e.target.value }))} style={selectStyle}>
                {ADVISOR_FIELDS.map(f => <option key={f}>{f}</option>)}
              </select>
              <input value={aForm.title} onChange={e => setAForm(f => ({ ...f, title: e.target.value }))} placeholder="직함 (예: 교수)" style={inputStyle} />
              <input value={aForm.organization} onChange={e => setAForm(f => ({ ...f, organization: e.target.value }))} placeholder="소속 기관" style={inputStyle} />
            </div>
            <textarea value={aForm.bio} onChange={e => setAForm(f => ({ ...f, bio: e.target.value }))} placeholder="소개글 (선택)" rows={2} style={{ ...inputStyle, width: '100%', resize: 'vertical', marginBottom: 10, display: 'block' }} />
            {aError && <p style={{ color: '#c0392b', fontSize: 12, marginBottom: 10, ...mono }}>{aError}</p>}
            <button onClick={addAdvisor} disabled={aSaving || !aForm.name.trim()} style={{ padding: '10px 24px', background: 'var(--primary)', color: 'var(--cream)', border: 'none', ...han, fontSize: 14, letterSpacing: 2, cursor: aSaving ? 'wait' : 'pointer', opacity: !aForm.name.trim() ? 0.5 : 1 }}>
              {aSaving ? '저장 중...' : '추가하기'}
            </button>
          </div>
          {/* Table */}
          <div style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border)', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead><tr style={{ background: 'var(--dark)', color: 'var(--cream)' }}>
                {['이름', '분야', '직함', '소속', '소개', ''].map(h => <th key={h} style={TH}>{h}</th>)}
              </tr></thead>
              <tbody>
                {advisors.map((a, i) => (
                  <tr key={a.id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg)' }}>
                    <td style={{ ...TD, whiteSpace: 'nowrap' }}>{a.name}</td>
                    <td style={{ ...TD, ...mono, fontSize: 11, color: 'var(--primary)', whiteSpace: 'nowrap' }}>{a.field}</td>
                    <td style={{ ...TD, color: 'var(--text2)', whiteSpace: 'nowrap' }}>{a.title ?? '—'}</td>
                    <td style={{ ...TD, color: 'var(--text2)', whiteSpace: 'nowrap' }}>{a.organization ?? '—'}</td>
                    <td style={{ ...TD, color: 'var(--text2)', fontSize: 12, maxWidth: 240 }}>{a.bio ? <span title={a.bio}>{a.bio.length > 40 ? a.bio.slice(0, 40) + '…' : a.bio}</span> : '—'}</td>
                    <td style={TD}><button onClick={() => deleteAdvisor(a.id)} style={{ padding: '4px 12px', background: '#c0392b', color: '#fff', border: 'none', cursor: 'pointer', ...mono, fontSize: 10 }}>삭제</button></td>
                  </tr>
                ))}
                {advisors.length === 0 && <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: 'var(--text2)' }}>등록된 고문위원이 없습니다.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        {/* PARTNERS */}
        <div style={{ marginBottom: 48 }}>
          <Section title="파트너십 관리" />
          {/* Add form */}
          <div style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border)', padding: '24px', marginBottom: 16 }}>
            <div style={{ ...mono, fontSize: 9, letterSpacing: 3, color: 'var(--text2)', marginBottom: 14 }}>파트너 추가</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 10, marginBottom: 10 }}>
              <input value={pForm.name} onChange={e => setPForm(f => ({ ...f, name: e.target.value }))} placeholder="기관/기업명 *" style={inputStyle} />
              <select value={pForm.type} onChange={e => setPForm(f => ({ ...f, type: e.target.value }))} style={selectStyle}>
                {PARTNER_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
              <input value={pForm.description} onChange={e => setPForm(f => ({ ...f, description: e.target.value }))} placeholder="설명 (선택)" style={inputStyle} />
            </div>
            {pError && <p style={{ color: '#c0392b', fontSize: 12, marginBottom: 10, ...mono }}>{pError}</p>}
            <button onClick={addPartner} disabled={pSaving || !pForm.name.trim()} style={{ padding: '10px 24px', background: 'var(--primary)', color: 'var(--cream)', border: 'none', ...han, fontSize: 14, letterSpacing: 2, cursor: pSaving ? 'wait' : 'pointer', opacity: !pForm.name.trim() ? 0.5 : 1 }}>
              {pSaving ? '저장 중...' : '추가하기'}
            </button>
          </div>
          {/* Table */}
          <div style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border)', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead><tr style={{ background: 'var(--dark)', color: 'var(--cream)' }}>
                {['기관/기업명', '유형', '설명', ''].map(h => <th key={h} style={TH}>{h}</th>)}
              </tr></thead>
              <tbody>
                {partners.map((p, i) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg)' }}>
                    <td style={TD}>{p.name}</td>
                    <td style={{ ...TD, ...mono, fontSize: 11, color: 'var(--text2)' }}>{p.type}</td>
                    <td style={{ ...TD, color: 'var(--text2)' }}>{p.description ?? '—'}</td>
                    <td style={TD}><button onClick={() => deletePartner(p.id)} style={{ padding: '4px 12px', background: '#c0392b', color: '#fff', border: 'none', cursor: 'pointer', ...mono, fontSize: 10 }}>삭제</button></td>
                  </tr>
                ))}
                {partners.length === 0 && <tr><td colSpan={4} style={{ padding: 40, textAlign: 'center', color: 'var(--text2)' }}>등록된 파트너가 없습니다.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        {/* NEWSLETTER */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20, flexWrap: 'wrap' }}>
            <Section title="소식받기 신청자" />
            <div style={{ display: 'flex', gap: 8 }}>
              {['전체', '인간연합 강의', '침묵의 날'].map(s => (
                <button key={s} onClick={() => setNewsletterFilter(s)} style={{ padding: '4px 12px', background: newsletterFilter === s ? 'var(--primary)' : 'var(--bg-card)', color: newsletterFilter === s ? 'var(--cream)' : 'var(--text2)', border: '1px solid var(--border)', cursor: 'pointer', ...mono, fontSize: 10 }}>{s}</button>
              ))}
            </div>
          </div>
          <div style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border)', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead><tr style={{ background: 'var(--dark)', color: 'var(--cream)' }}>
                {['이름', '이메일', '서비스', '날짜'].map(h => <th key={h} style={TH}>{h}</th>)}
              </tr></thead>
              <tbody>
                {newsletter.filter(n => newsletterFilter === '전체' || n.service === newsletterFilter).map((n, i) => (
                  <tr key={n.id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg)' }}>
                    <td style={TD}>{n.name ?? '—'}</td>
                    <td style={{ ...TD, fontSize: 12, color: 'var(--text2)' }}>{n.email}</td>
                    <td style={TD}><span style={{ background: 'var(--primary)', color: 'var(--cream)', padding: '2px 8px', ...mono, fontSize: 10 }}>{n.service}</span></td>
                    <td style={{ ...TD, ...mono, fontSize: 11, color: 'var(--text2)', whiteSpace: 'nowrap' }}>{new Date(n.created_at).toLocaleDateString('ko-KR')}</td>
                  </tr>
                ))}
                {newsletter.filter(n => newsletterFilter === '전체' || n.service === newsletterFilter).length === 0 && <tr><td colSpan={4} style={{ padding: 40, textAlign: 'center', color: 'var(--text2)' }}>신청자가 없습니다.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        {/* ARCHIVE */}
        <div>
          <Section title="아카이브 게시글 관리" />
          <div style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border)', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead><tr style={{ background: 'var(--dark)', color: 'var(--cream)' }}>
                {['제목', '카테고리', '날짜', ''].map(h => <th key={h} style={TH}>{h}</th>)}
              </tr></thead>
              <tbody>
                {archive.map((p, i) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg)' }}>
                    <td style={TD}>{p.title}</td>
                    <td style={{ ...TD, color: 'var(--text2)' }}>{p.category}</td>
                    <td style={{ ...TD, ...mono, fontSize: 11, color: 'var(--text2)' }}>{new Date(p.created_at).toLocaleDateString('ko-KR')}</td>
                    <td style={TD}><button onClick={() => deleteArchivePost(p.id)} style={{ padding: '4px 12px', background: '#c0392b', color: '#fff', border: 'none', cursor: 'pointer', ...mono, fontSize: 10 }}>삭제</button></td>
                  </tr>
                ))}
                {archive.length === 0 && <tr><td colSpan={4} style={{ padding: 40, textAlign: 'center', color: 'var(--text2)' }}>게시글이 없습니다.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
