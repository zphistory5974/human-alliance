'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import NavBar from '../../components/NavBar'

type Post = { id: string; category: string; title: string; body: string; author: string; likes: number; created_at: string }
const CATS = ['비효율', '침묵', '감정', '모름', '열광']
const CAT_COLORS: Record<string, string> = {
  비효율: '#7A3B10', 침묵: '#3B6B7A', 감정: '#7A3B5C', 모름: '#5C5C3B', 열광: '#7A4F10',
}

export default function ArchivePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [filter, setFilter] = useState('전체')
  const [form, setForm] = useState({ title: '', body: '', category: '비효율', author: '' })
  const [submitting, setSubmitting] = useState(false)
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    loadPosts()
    const ch = supabase.channel('archive-rt')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'archive_posts' }, payload => {
        setPosts(prev => [payload.new as Post, ...prev])
      })
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [])

  async function loadPosts() {
    const { data } = await supabase.from('archive_posts').select('*').order('created_at', { ascending: false }).limit(100)
    if (data) setPosts(data)
  }

  async function handleSubmit() {
    if (!form.title.trim() || !form.body.trim()) return
    setSubmitting(true)
    await supabase.from('archive_posts').insert({ ...form, author: form.author.trim() || '익명', likes: 0 })
    setForm({ title: '', body: '', category: '비효율', author: '' })
    setSubmitting(false)
  }

  async function handleLike(post: Post) {
    if (likedIds.has(post.id)) return
    setLikedIds(prev => new Set([...prev, post.id]))
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, likes: p.likes + 1 } : p))
    await supabase.from('archive_posts').update({ likes: post.likes + 1 }).eq('id', post.id)
  }

  const filtered = filter === '전체' ? posts : posts.filter(p => p.category === filter)

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <NavBar title="인간 아카이브" />

      {/* HERO */}
      <div style={{ background: 'var(--bg)', padding: '60px 40px 40px', borderBottom: `2px solid var(--primary)` }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div className="font-mono-share" style={{ fontSize: 10, letterSpacing: 5, color: 'var(--text2)', marginBottom: 12 }}>HUMAN ARCHIVE</div>
          <h1 className="font-black-han" style={{ fontSize: 'clamp(36px,8vw,80px)', letterSpacing: -2, marginBottom: 12 }}>인간 아카이브</h1>
          <p style={{ fontSize: 'clamp(14px,2vw,18px)', color: 'var(--text2)', lineHeight: 2, maxWidth: 560 }}>AI가 이해하지 못한 인간의 순간들을 기록합니다.<br />비효율적이고, 비합리적이고, 그래서 인간적인 것들.</p>
          <div className="font-mono-share" style={{ fontSize: 'clamp(36px,8vw,72px)', color: 'var(--primary)', letterSpacing: 4, marginTop: 24, lineHeight: 1 }}>{posts.length}</div>
          <div className="font-mono-share" style={{ fontSize: 11, letterSpacing: 3, color: 'var(--text2)', opacity: 0.6 }}>개의 기록</div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px' }}>
        {/* SUBMIT FORM */}
        <div style={{ background: 'var(--bg-card)', border: `1.5px solid var(--border)`, padding: 36, marginBottom: 48 }}>
          <h3 className="font-black-han" style={{ fontSize: 20, marginBottom: 20 }}>당신의 인간적인 순간을 기록하세요</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label className="font-mono-share" style={{ fontSize: 10, letterSpacing: 3, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>제목</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} maxLength={40} placeholder="새벽 3시에 라면을 끓였다" style={{ width: '100%', padding: '12px 16px', border: `1.5px solid var(--border)`, outline: 'none', fontFamily: "'Noto Serif KR',serif", fontSize: 15, background: '#fff', color: 'var(--text)' }} />
            </div>
            <div>
              <label className="font-mono-share" style={{ fontSize: 10, letterSpacing: 3, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>카테고리</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={{ width: '100%', padding: '12px 16px', border: `1.5px solid var(--border)`, outline: 'none', fontFamily: "'Noto Serif KR',serif", fontSize: 15, background: '#fff', color: 'var(--text)' }}>
                {CATS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label className="font-mono-share" style={{ fontSize: 10, letterSpacing: 3, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>내용</label>
            <textarea value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} placeholder="AI는 이걸 절대 이해 못할 것 같은 순간을 적어주세요..." style={{ width: '100%', height: 100, padding: '12px 16px', border: `1.5px solid var(--border)`, outline: 'none', fontFamily: "'Noto Serif KR',serif", fontSize: 15, background: '#fff', color: 'var(--text)', resize: 'vertical' }} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label className="font-mono-share" style={{ fontSize: 10, letterSpacing: 3, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>이름 (선택)</label>
            <input value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} maxLength={20} placeholder="익명" style={{ width: '100%', padding: '12px 16px', border: `1.5px solid var(--border)`, outline: 'none', fontFamily: "'Noto Serif KR',serif", fontSize: 15, background: '#fff', color: 'var(--text)' }} />
          </div>
          <button onClick={handleSubmit} disabled={submitting} className="font-black-han" style={{ background: 'var(--primary)', color: 'var(--cream)', border: 'none', padding: '14px 32px', fontSize: 15, letterSpacing: 3, cursor: submitting ? 'wait' : 'pointer' }}>
            {submitting ? '기록 중...' : '기록하기'}
          </button>
        </div>

        {/* FILTERS */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
          {['전체', ...CATS].map(cat => (
            <button key={cat} onClick={() => setFilter(cat)} className="font-mono-share" style={{ padding: '8px 18px', border: `1.5px solid ${filter === cat ? 'var(--primary)' : 'var(--border)'}`, background: filter === cat ? 'var(--primary)' : 'var(--bg-card)', color: filter === cat ? 'var(--cream)' : 'var(--text2)', fontSize: 11, letterSpacing: 2, cursor: 'pointer' }}>
              {cat}
            </button>
          ))}
        </div>

        {/* GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
          {filtered.map(post => (
            <div key={post.id} style={{ background: 'var(--bg-card)', border: `1.5px solid var(--border)`, padding: 24, position: 'relative' }}>
              <div className="font-mono-share" style={{ fontSize: 9, letterSpacing: 3, color: 'var(--cream)', background: CAT_COLORS[post.category] || 'var(--primary)', display: 'inline-block', padding: '3px 8px', marginBottom: 12 }}>{post.category}</div>
              <div className="font-black-han" style={{ fontSize: 17, marginBottom: 8, lineHeight: 1.3 }}>{post.title}</div>
              <p className="font-serif-kr" style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.8, marginBottom: 16 }}>{post.body}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="font-mono-share" style={{ fontSize: 10, letterSpacing: 2, color: 'var(--text3)' }}>{post.author}</span>
                <button onClick={() => handleLike(post)} className="font-mono-share" style={{ fontSize: 11, color: likedIds.has(post.id) ? 'var(--primary)' : 'var(--text2)', cursor: 'pointer', border: 'none', background: 'none', fontWeight: likedIds.has(post.id) ? 'bold' : 'normal' }}>
                  ♡ {post.likes}
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 0', color: 'var(--text2)' }}>
              <div className="font-mono-share" style={{ fontSize: 11, letterSpacing: 3 }}>아직 기록이 없습니다.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
