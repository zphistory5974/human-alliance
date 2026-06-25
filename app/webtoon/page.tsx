'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function WebtoonRedirect() {
  const router = useRouter()
  useEffect(() => { router.replace('/novel') }, [router])
  return null
}
