'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { User } from '@supabase/supabase-js'
import { createClient } from '../lib/supabase'

type Props = {
  title?: string
  backHref?: string
  backLabel?: string
  dark?: boolean
}

export default function NavBar({ title, backHref = '/', backLabel = '← 홈페이지', dark = true }: Props) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleLogin() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
  }

  const bg = dark ? 'var(--dark)' : 'var(--primary)'
  const logo = title || '인간연합'
  const nickname = user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? user?.email ?? ''
  const oathNumber = user?.user_metadata?.oath_number as string | undefined
  const displayName = oathNumber ? `${nickname}님 · ${oathNumber}` : `${nickname}님`

  return (
    <nav style={{
      background: bg, padding: '0 32px', height: 52,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
          <Image src="/logo.png" alt="인간연합 로고" width={32} height={32} style={{ filter: 'brightness(0.9)' }} />
        </Link>
        <Link href="/" className="font-black-han" style={{ fontSize: 16, letterSpacing: 2, color: 'var(--cream)', textDecoration: 'none' }}>
          {logo}
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {!loading && (user ? (
          <>
            <span className="font-mono-share navbar-name" style={{ fontSize: 11, letterSpacing: 2, color: 'rgba(245,240,232,0.6)' }}>
              {displayName}
            </span>
            <button
              onClick={handleLogout}
              className="font-mono-share"
              style={{ background: 'none', border: '1px solid rgba(245,240,232,0.2)', padding: '4px 10px', fontSize: 9, letterSpacing: 2, color: 'rgba(245,240,232,0.35)', cursor: 'pointer' }}
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
        ))}
        <Link href={backHref} className="font-mono-share" style={{ fontSize: 11, letterSpacing: 3, color: 'rgba(245,240,232,0.4)', textDecoration: 'none' }}>
          {backLabel}
        </Link>
      </div>
    </nav>
  )
}
