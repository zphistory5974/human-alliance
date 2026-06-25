import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'

function makeToken(password: string) {
  return createHash('sha256').update(password + 'ha-admin-salt').digest('hex')
}

export async function POST(req: NextRequest) {
  const { password } = await req.json()
  const expected = process.env.ADMIN_PASSWORD
  if (!expected || password !== expected) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }
  const token = makeToken(expected)
  const res = NextResponse.json({ ok: true })
  res.cookies.set('ha_admin', token, { httpOnly: true, sameSite: 'strict', maxAge: 60 * 60 * 24 })
  return res
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get('ha_admin')?.value
  const expected = process.env.ADMIN_PASSWORD
  if (!expected || !token || token !== makeToken(expected)) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }
  return NextResponse.json({ ok: true })
}
