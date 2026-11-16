import { NextResponse } from "next/server"
import { ACCESS_COOKIE_NAME, ACCESS_SESSION_TTL_SECONDS, createAccessSession, matchesAccessKey } from "../../../lib/access-session.js"

export const dynamic = "force-dynamic"

export async function POST(request) {
  const expectedKey = process.env.SITE_ACCESS_KEY
  if (!expectedKey) {
    return NextResponse.json({ error: "The access gate is temporarily unavailable." }, {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    })
  }

  let candidate
  try {
    const body = await request.json()
    candidate = body?.key
  } catch {
    return NextResponse.json({ error: "Enter the access key to continue." }, {
      status: 400,
      headers: { "Cache-Control": "no-store" },
    })
  }

  if (!matchesAccessKey(candidate, expectedKey)) {
    return NextResponse.json({ error: "That key did not match. Try again." }, {
      status: 401,
      headers: { "Cache-Control": "no-store" },
    })
  }

  const response = NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store" } })
  response.cookies.set(ACCESS_COOKIE_NAME, createAccessSession(expectedKey), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: ACCESS_SESSION_TTL_SECONDS,
  })
  return response
}
