'use client'

import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabase'
import NavBar from '../../components/NavBar'

/* ── SVG 일러스트 ── */
const BadgeSVG = () => (
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width={140}>
    <circle cx={100} cy={100} r={90} fill="var(--dark)" stroke="var(--border)" strokeWidth={2}/>
    <circle cx={100} cy={100} r={80} fill="none" stroke="var(--gold)" strokeWidth={1} opacity={0.3}/>
    <text x={100} y={90} textAnchor="middle" fill="var(--gold)" fontFamily="monospace" fontSize={11} letterSpacing={3} opacity={0.6}>I DON&apos;T</text>
    <text x={100} y={118} textAnchor="middle" fill="var(--cream)" fontFamily="Black Han Sans" fontSize={26} fontWeight="bold">KNOW</text>
    <text x={100} y={142} textAnchor="middle" fill="var(--gold)" fontFamily="monospace" fontSize={9} letterSpacing={3} opacity={0.4}>인간연합</text>
  </svg>
)
const StickerSVG = () => (
  <svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg" width={180}>
    <rect x={10} y={20} width={180} height={60} rx={4} fill="var(--dark)"/>
    <text x={100} y={58} textAnchor="middle" fill="var(--cream)" fontFamily="Black Han Sans" fontSize={24} letterSpacing={2}>아돈노</text>
    <rect x={10} y={90} width={85} height={50} rx={4} fill="var(--primary)"/>
    <text x={52} y={122} textAnchor="middle" fill="var(--cream)" fontFamily="monospace" fontSize={12} fontWeight="bold">몰라요</text>
    <rect x={105} y={90} width={85} height={50} rx={4} fill="var(--dark)"/>
    <text x={147} y={118} textAnchor="middle" fill="var(--cream)" fontFamily="monospace" fontSize={9}>I DON&apos;T</text>
    <text x={147} y={132} textAnchor="middle" fill="var(--gold)" fontFamily="monospace" fontSize={10} fontWeight="bold">KNOW</text>
  </svg>
)
const EcoBagOriginalSVG = () => (
  <svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" width={140}>
    <rect x={50} y={50} width={100} height={140} rx={4} fill="var(--bg2)" stroke="var(--border)" strokeWidth={2}/>
    <line x1={80} y1={50} x2={65} y2={20} stroke="var(--border)" strokeWidth={3} strokeLinecap="round"/>
    <line x1={120} y1={50} x2={135} y2={20} stroke="var(--border)" strokeWidth={3} strokeLinecap="round"/>
    <text x={100} y={115} textAnchor="middle" fill="var(--dark)" fontFamily="Black Han Sans" fontSize={18} letterSpacing={1}>아돈노</text>
    <text x={100} y={140} textAnchor="middle" fill="var(--primary)" fontFamily="monospace" fontSize={9} letterSpacing={3} opacity={0.6}>I DON&apos;T KNOW</text>
  </svg>
)
const TarotSVG = () => (
  <svg viewBox="0 0 160 220" xmlns="http://www.w3.org/2000/svg" width={110}>
    <rect x={8} y={8} width={144} height={204} rx={10} fill="var(--dark)" stroke="var(--gold)" strokeWidth={1.5}/>
    <rect x={16} y={16} width={128} height={188} rx={6} fill="none" stroke="var(--gold)" strokeWidth={0.5} opacity={0.35}/>
    <text x={80} y={40} textAnchor="middle" fill="var(--gold)" fontFamily="monospace" fontSize={9} letterSpacing={4} opacity={0.6}>✦ ✦ ✦</text>
    <text x={80} y={130} textAnchor="middle" fill="var(--cream)" fontFamily="Georgia,serif" fontSize={90} opacity={0.85}>?</text>
    <text x={80} y={196} textAnchor="middle" fill="var(--gold)" fontFamily="monospace" fontSize={8} letterSpacing={3} opacity={0.5}>I DON&apos;T KNOW</text>
  </svg>
)
const ClockSVG = () => (
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width={140}>
    <circle cx={100} cy={100} r={86} fill="var(--bg2)" stroke="var(--border)" strokeWidth={2}/>
    <circle cx={100} cy={100} r={79} fill="none" stroke="var(--gold)" strokeWidth={0.5} opacity={0.3}/>
    <line x1={100} y1={22} x2={100} y2={36} stroke="var(--primary)" strokeWidth={3} strokeLinecap="round"/>
    <line x1={178} y1={100} x2={164} y2={100} stroke="var(--primary)" strokeWidth={3} strokeLinecap="round"/>
    <line x1={100} y1={178} x2={100} y2={164} stroke="var(--primary)" strokeWidth={3} strokeLinecap="round"/>
    <line x1={22} y1={100} x2={36} y2={100} stroke="var(--primary)" strokeWidth={3} strokeLinecap="round"/>
    <line x1={100} y1={100} x2={100} y2={50} stroke="var(--dark)" strokeWidth={4} strokeLinecap="round"/>
    <line x1={100} y1={100} x2={138} y2={82} stroke="var(--dark)" strokeWidth={2.5} strokeLinecap="round"/>
    <line x1={100} y1={100} x2={72} y2={146} stroke="var(--primary)" strokeWidth={1.5} strokeLinecap="round"/>
    <circle cx={100} cy={100} r={5} fill="var(--primary)"/>
    <circle cx={100} cy={100} r={2} fill="var(--cream)"/>
  </svg>
)
const CalendarSVG = () => (
  <svg viewBox="0 0 200 190" xmlns="http://www.w3.org/2000/svg" width={160}>
    <rect x={10} y={20} width={180} height={160} rx={4} fill="var(--bg2)" stroke="var(--border)" strokeWidth={1.5}/>
    <rect x={10} y={20} width={180} height={40} rx={4} fill="var(--primary)"/>
    <rect x={10} y={46} width={180} height={14} fill="var(--primary)"/>
    <text x={100} y={47} textAnchor="middle" fill="var(--cream)" fontFamily="monospace" fontSize={14} letterSpacing={3} fontWeight="bold">2026</text>
    {[0,1,2,3,4].map(row => [0,1,2,3,4,5,6].map(col => (
      <rect key={`${row}-${col}`} x={14+col*25} y={68+row*20} width={21} height={16} rx={2} fill="none" stroke="var(--border)" strokeWidth={0.8} opacity={0.6}/>
    )))}
    <text x={100} y={182} textAnchor="middle" fill="var(--text2)" fontFamily="monospace" fontSize={8} letterSpacing={3} opacity={0.4}>내 시간은 내가 결정한다</text>
  </svg>
)
const TimerSVG = () => (
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width={140}>
    <rect x={30} y={60} width={140} height={110} rx={8} fill="var(--dark)" stroke="var(--gold)" strokeWidth={1.5}/>
    <rect x={75} y={45} width={50} height={18} rx={4} fill="var(--dark)" stroke="var(--gold)" strokeWidth={1}/>
    <line x1={100} y1={45} x2={100} y2={60} stroke="var(--gold)" strokeWidth={2}/>
    <circle cx={100} cy={120} r={32} fill="none" stroke="var(--cream)" strokeWidth={2} opacity={0.6}/>
    <circle cx={100} cy={120} r={24} fill="none" stroke="var(--gold)" strokeWidth={1} opacity={0.3}/>
    <line x1={100} y1={120} x2={100} y2={96} stroke="var(--cream)" strokeWidth={3} strokeLinecap="round"/>
    <line x1={100} y1={120} x2={120} y2={130} stroke="var(--gold)" strokeWidth={2} strokeLinecap="round"/>
    <circle cx={100} cy={120} r={4} fill="var(--gold)"/>
    <text x={100} y={162} textAnchor="middle" fill="var(--gold)" fontFamily="monospace" fontSize={8} letterSpacing={3} opacity={0.5}>SILENCE MODE</text>
  </svg>
)
const EcoBagSVG = () => (
  <svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" width={140}>
    <rect x={45} y={55} width={110} height={145} rx={4} fill="var(--bg2)" stroke="var(--border)" strokeWidth={2}/>
    <path d="M75 55 Q75 30 100 25 Q125 30 125 55" fill="none" stroke="var(--border)" strokeWidth={3} strokeLinecap="round"/>
    <text x={100} y={118} textAnchor="middle" fill="var(--dark)" fontFamily="Black Han Sans,sans-serif" fontSize={13} letterSpacing={1}>I DON&apos;T</text>
    <text x={100} y={138} textAnchor="middle" fill="var(--dark)" fontFamily="Black Han Sans,sans-serif" fontSize={13} letterSpacing={1}>KNOW</text>
    <text x={100} y={162} textAnchor="middle" fill="var(--primary)" fontFamily="monospace" fontSize={9} letterSpacing={2} opacity={0.6}>인간연합</text>
  </svg>
)
const HoodieSVG = () => (
  <svg viewBox="0 0 220 200" xmlns="http://www.w3.org/2000/svg" width={160}>
    <path d="M60 40 Q50 30 30 35 L20 80 L55 85 L55 180 L165 180 L165 85 L200 80 L190 35 Q170 30 160 40 Q145 25 110 22 Q110 22 110 22 Q75 25 60 40Z" fill="var(--dark)" stroke="var(--border)" strokeWidth={1.5}/>
    <path d="M85 24 Q100 32 115 24" fill="none" stroke="var(--gold)" strokeWidth={1.5} opacity={0.6}/>
    <text x={110} y={120} textAnchor="middle" fill="var(--cream)" fontFamily="Georgia,serif" fontSize={52} opacity={0.7}>?</text>
    <text x={110} y={170} textAnchor="middle" fill="var(--gold)" fontFamily="monospace" fontSize={8} letterSpacing={3} opacity={0.4}>인간연합</text>
  </svg>
)
const PinSVG = () => (
  <svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg" width={180}>
    {[
      { cx: 36, cy: 46, r: 28, bg: 'var(--dark)', text: '몰라요', fontSize: 9 },
      { cx: 100, cy: 36, r: 28, bg: 'var(--primary)', text: '?', fontSize: 22 },
      { cx: 164, cy: 46, r: 28, bg: 'var(--dark)', text: '그냥요', fontSize: 9 },
      { cx: 52, cy: 112, r: 28, bg: 'var(--primary)', text: '이유없어', fontSize: 8 },
      { cx: 148, cy: 112, r: 28, bg: 'var(--dark)', text: '모름', fontSize: 11 },
    ].map(({ cx, cy, r, bg, text, fontSize }) => (
      <g key={cx}>
        <circle cx={cx} cy={cy} r={r} fill={bg} stroke="var(--border)" strokeWidth={1.5}/>
        <circle cx={cx} cy={cy} r={r-4} fill="none" stroke="var(--gold)" strokeWidth={0.5} opacity={0.3}/>
        <text x={cx} y={cy+fontSize/3} textAnchor="middle" fill="var(--cream)" fontFamily="Black Han Sans,sans-serif" fontSize={fontSize} letterSpacing={0.5}>{text}</text>
      </g>
    ))}
  </svg>
)
const FaradaySVG = () => (
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width={140}>
    <rect x={40} y={50} width={120} height={130} rx={6} fill="var(--dark)" stroke="var(--gold)" strokeWidth={1.5}/>
    <rect x={55} y={38} width={90} height={16} rx={4} fill="var(--dark)" stroke="var(--gold)" strokeWidth={1}/>
    <path d="M80 118 Q100 95 120 118" fill="none" stroke="var(--cream)" strokeWidth={2} opacity={0.25}/>
    <path d="M70 130 Q100 100 130 130" fill="none" stroke="var(--cream)" strokeWidth={2} opacity={0.15}/>
    <line x1={72} y1={100} x2={128} y2={156} stroke="var(--primary)" strokeWidth={2.5} strokeLinecap="round"/>
    <line x1={128} y1={100} x2={72} y2={156} stroke="var(--primary)" strokeWidth={2.5} strokeLinecap="round"/>
    <circle cx={100} cy={128} r={10} fill="var(--cream)" opacity={0.15}/>
    <text x={100} y={174} textAnchor="middle" fill="var(--gold)" fontFamily="monospace" fontSize={7} letterSpacing={2} opacity={0.5}>SIGNAL BLOCKED</text>
  </svg>
)
const LetterSVG = () => (
  <svg viewBox="0 0 200 180" xmlns="http://www.w3.org/2000/svg" width={160}>
    {[3, 2, 1, 0].map(i => (
      <g key={i}><rect x={20+i*8} y={20+i*8} width={155} height={115} rx={3} fill="var(--bg2)" stroke="var(--border)" strokeWidth={1.2}/></g>
    ))}
    {[55, 72, 89, 106, 123].map(y => (
      <line key={y} x1={36} y1={y} x2={163} y2={y} stroke="var(--border)" strokeWidth={0.8} opacity={0.5}/>
    ))}
    <path d="M20 20 L100 72 L180 20" fill="none" stroke="var(--gold)" strokeWidth={1} opacity={0.5}/>
    <text x={100} y={152} textAnchor="middle" fill="var(--text2)" fontFamily="monospace" fontSize={8} letterSpacing={2} opacity={0.4}>손으로 쓴 감정</text>
  </svg>
)
const DiarySVG = () => (
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width={140}>
    <rect x={50} y={20} width={115} height={160} rx={4} fill="var(--bg2)" stroke="var(--border)" strokeWidth={1.5}/>
    <rect x={35} y={20} width={18} height={160} rx={4} fill="var(--primary)"/>
    {[0,1,2].map(i => (<circle key={i} cx={44} cy={60+i*44} r={5} fill="var(--cream)" opacity={0.6}/>))}
    {[60, 78, 96, 114, 132, 150].map(y => (
      <line key={y} x1={64} y1={y} x2={152} y2={y} stroke="var(--border)" strokeWidth={0.8} opacity={0.5}/>
    ))}
    <text x={108} y={44} textAnchor="middle" fill="var(--primary)" fontFamily="Black Han Sans,sans-serif" fontSize={10} letterSpacing={1}>일기</text>
    <rect x={84} y={155} width={48} height={20} rx={10} fill="var(--dark)" stroke="var(--gold)" strokeWidth={1}/>
    <text x={108} y={169} textAnchor="middle" fill="var(--gold)" fontFamily="monospace" fontSize={8} letterSpacing={1}>🔒 오프라인</text>
  </svg>
)

/* ── 굿즈 데이터 ── */
type GoodsItem = { id: string; name: string; desc: string; tag: string; Svg: () => React.ReactElement }
type GoodsCategory = { id: string; name: string; items: GoodsItem[] }

const GOODS_CATEGORIES: GoodsCategory[] = [
  {
    id: 'adonno', name: '아돈노 라인업',
    items: [
      { id: 'badge', name: '아돈노 배지', desc: '가방이나 옷에 달고 다니는 멤버십 증명 배지. 들고 다니는 순간 "나는 인간연합이다"가 된다.', tag: 'BADGE · 44mm', Svg: BadgeSVG },
      { id: 'sticker', name: '아돈노 스티커 팩', desc: '노트북, 텀블러, 다이어리 어디든. "몰라요", "I DON\'T KNOW" 등 다양한 디자인 6종 세트.', tag: 'STICKER · 6종 세트', Svg: StickerSVG },
      { id: 'ecobag_original', name: '아돈노 에코백', desc: '일상 속에서 조용히 선언하는 에코백. "몰라요"가 당당한 한 마디가 되는 순간.', tag: 'ECO BAG · 36×40cm', Svg: EcoBagOriginalSVG },
    ],
  },
  {
    id: 'philosophy', name: '철학 오브제',
    items: [
      { id: 'tarot', name: '모름 타로카드', desc: 'AI는 점을 치지 못한다. 불확실성을 즐기는 카드 덱. 미래를 AI에게 묻지 않고, 스스로 상상하는 경험.', tag: 'TAROT DECK · 22장', Svg: TarotSVG },
      { id: 'clock', name: '아날로그 시계', desc: '초침 소리만 있는 시계. 알림 없음. AI 없음. 시간을 AI가 아닌 내가 관리한다.', tag: 'CLOCK · 데스크 오브제', Svg: ClockSVG },
      { id: 'calendar', name: '빈 달력', desc: '날짜만 있고 일정 칸이 없는 달력. AI가 채워주지 않는다. 내 시간은 내가 결정한다.', tag: 'CALENDAR · 연간', Svg: CalendarSVG },
      { id: 'timer', name: '침묵 타이머', desc: '정해진 시간 동안 폰을 잠그는 물리적 박스. 디지털 세계에서 벗어나는 유일한 방법.', tag: 'TIMER BOX · 디지털 디톡스', Svg: TimerSVG },
    ],
  },
  {
    id: 'wearable', name: '웨어러블',
    items: [
      { id: 'ecobag2', name: '에코백', desc: '"I Don\'t Know" 프린트. 들고 다니는 순간 선언이 된다.', tag: 'ECO BAG · 캔버스', Svg: EcoBagSVG },
      { id: 'hoodie', name: '후드티', desc: '앞면 "?" 뒷면 "인간연합". 입는 순간 인간연합 멤버임을 선언한다.', tag: 'HOODIE · 유니섹스', Svg: HoodieSVG },
      { id: 'pin', name: '핀버튼 세트', desc: '"몰라요" "그냥요" "이유없어요" 등 다양한 문구. 달고 다니면 일상이 선언이 된다.', tag: 'PIN SET · 6종', Svg: PinSVG },
    ],
  },
  {
    id: 'detox', name: '디지털 디톡스',
    items: [
      { id: 'faraday', name: '패러데이 파우치', desc: '폰을 넣으면 신호가 완전 차단된다. 진짜 침묵. AI에게 닿지 않는 유일한 공간.', tag: 'FARADAY POUCH · 신호차단', Svg: FaradaySVG },
      { id: 'letter', name: '손글씨 편지지 세트', desc: 'AI 없이 전달하는 감정. 손으로 쓴 글은 AI가 쓴 글과 다르다.', tag: 'LETTER SET · 20매', Svg: LetterSVG },
      { id: 'diary', name: '오프라인 일기장', desc: '"이 일기는 AI가 읽을 수 없습니다." 가장 인간적인 공간.', tag: 'DIARY · A5', Svg: DiarySVG },
    ],
  },
]

export default function GoodsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [appliedGoods, setAppliedGoods] = useState<Set<string>>(new Set())
  const [applyingId, setApplyingId] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!user) return
    supabase
      .from('goods_orders')
      .select('goods_name')
      .eq('kakao_id', user.id)
      .then(({ data }) => {
        if (data) setAppliedGoods(new Set(data.map(r => r.goods_name as string)))
      })
  }, [user?.id])

  async function handleApply(item: GoodsItem) {
    if (!user) return
    if (appliedGoods.has(item.id)) return
    setApplyingId(item.id)
    const { error } = await supabase.from('goods_orders').insert({ kakao_id: user.id, goods_name: item.id })
    if (!error || error.code === '23505') {
      setAppliedGoods(prev => new Set([...prev, item.id]))
    }
    setApplyingId(null)
  }

  async function handleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: { redirectTo: `${window.location.origin}/auth/callback?returnTo=/goods` },
    })
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <NavBar title="인간연합 × 아돈노" />

      {/* HERO */}
      <div style={{ background: 'var(--dark)', padding: '80px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: `repeating-linear-gradient(90deg,transparent,transparent 59px,rgba(196,136,42,0.05) 59px,rgba(196,136,42,0.05) 60px)` }} />
        <div className="font-mono-share" style={{ fontSize: 10, letterSpacing: 6, color: 'var(--gold)', opacity: 0.5, marginBottom: 16, position: 'relative' }}>{"I DON'T KNOW GOODS"}</div>
        <h1 className="font-black-han" style={{ fontSize: 'clamp(52px,13vw,120px)', color: 'var(--cream)', lineHeight: 0.88, letterSpacing: -2, position: 'relative' }}>아돈노</h1>
        <div className="font-mono-share" style={{ fontSize: 13, letterSpacing: 5, color: 'var(--cream)', opacity: 0.3, marginTop: 8, position: 'relative' }}>{"I DON'T KNOW"}</div>
        <p style={{ fontSize: 'clamp(14px,2vw,18px)', color: 'var(--cream)', opacity: 0.6, lineHeight: 2, maxWidth: 480, margin: '24px auto 0', position: 'relative' }}>
          인간연합 멤버십 굿즈 브랜드.<br />모른다는 것을 자랑스럽게.
        </p>
        <div style={{ marginTop: 20, position: 'relative', display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <span className="font-mono-share" style={{ fontSize: 10, letterSpacing: 3, color: 'var(--dark)', background: 'var(--gold)', padding: '5px 14px' }}>COMING SOON</span>
          <span className="font-mono-share" style={{ fontSize: 10, letterSpacing: 3, color: 'rgba(245,240,232,0.5)', border: '1px solid rgba(245,240,232,0.2)', padding: '5px 14px' }}>서약자 우선 제공</span>
        </div>
      </div>

      {/* 안내 배너 */}
      <div style={{ background: 'var(--primary)', padding: '14px 40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
        <span className="font-mono-share" style={{ fontSize: 10, letterSpacing: 3, color: 'var(--cream)', opacity: 0.7 }}>
          인간연합 서약자에게 우선 제공될 예정입니다
        </span>
        <span style={{ color: 'rgba(245,240,232,0.3)', fontSize: 12 }}>·</span>
        <span className="font-mono-share" style={{ fontSize: 10, letterSpacing: 2, color: 'var(--gold)', opacity: 0.8 }}>
          아직 판매 전입니다
        </span>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '60px 24px' }}>

        {/* 카테고리별 굿즈 */}
        {GOODS_CATEGORIES.map(cat => (
          <div key={cat.id} style={{ marginBottom: 64 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
              <span className="font-mono-share" style={{ fontSize: 9, letterSpacing: 4, color: 'var(--cream)', background: 'var(--dark)', padding: '4px 12px', whiteSpace: 'nowrap' }}>
                {cat.name}
              </span>
              <div style={{ flex: 1, height: 1, background: 'var(--border)', opacity: 0.5 }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20 }}>
              {cat.items.map((item) => {
                const { id, name, desc, tag, Svg } = item
                const isApplied = appliedGoods.has(id)
                const isApplying = applyingId === id
                return (
                  <div key={id} style={{ border: '1.5px solid var(--border)', background: 'var(--bg-card)', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 1 }}>
                      <div className="font-mono-share" style={{ fontSize: 8, letterSpacing: 2, color: 'var(--cream)', background: 'var(--primary)', padding: '4px 10px' }}>
                        COMING SOON
                      </div>
                    </div>
                    <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg2)' }}>
                      <Svg />
                    </div>
                    <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div className="font-black-han" style={{ fontSize: 19, marginBottom: 8 }}>{name}</div>
                      <div className="font-serif-kr" style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.8, marginBottom: 14, flex: 1 }}>{desc}</div>
                      <div className="font-mono-share" style={{ fontSize: 10, letterSpacing: 3, color: 'var(--text2)', border: '1px solid var(--border)', display: 'inline-block', padding: '4px 10px', marginBottom: 14 }}>{tag}</div>
                      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
                        {isApplied ? (
                          <button disabled className="font-black-han" style={{ width: '100%', padding: '11px 0', background: 'var(--dark)', color: 'var(--gold)', border: 'none', fontSize: 13, letterSpacing: 3, cursor: 'default' }}>
                            신청 완료 ✓
                          </button>
                        ) : !user ? (
                          <button
                            onClick={handleLogin}
                            className="font-black-han"
                            style={{ width: '100%', padding: '11px 0', background: '#FEE500', color: '#3C1E1E', border: 'none', fontSize: 12, letterSpacing: 1, cursor: 'pointer' }}
                          >
                            카카오 로그인 후 신청하기
                          </button>
                        ) : (
                          <button
                            onClick={() => handleApply(item)}
                            disabled={isApplying}
                            className="font-black-han"
                            style={{ width: '100%', padding: '11px 0', background: 'var(--primary)', color: 'var(--cream)', border: 'none', fontSize: 13, letterSpacing: 3, cursor: isApplying ? 'wait' : 'pointer' }}
                          >
                            {isApplying ? '처리중...' : '관심 신청'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {/* 안내 */}
        <div style={{ background: 'var(--dark)', padding: '40px 48px', textAlign: 'center' }}>
          <div className="font-mono-share" style={{ fontSize: 10, letterSpacing: 4, color: 'rgba(245,240,232,0.4)', marginBottom: 12 }}>NOTICE</div>
          <p className="font-serif-kr" style={{ fontSize: 14, color: 'rgba(245,240,232,0.6)', lineHeight: 2 }}>
            관심 신청은 구매 예약이 아닙니다.<br />
            출시 시 신청자에게 가장 먼저 안내드립니다.
          </p>
        </div>
      </div>
    </div>
  )
}
