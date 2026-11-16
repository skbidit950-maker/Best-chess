import { NextResponse } from "next/server"
import { ACCESS_COOKIE_NAME, verifyAccessSession } from "./lib/access-session.js"

export function proxy(request) {
  const secret = process.env.SITE_ACCESS_KEY
  const token = request.cookies.get(ACCESS_COOKIE_NAME)?.value

  if (verifyAccessSession(token, secret)) return NextResponse.next()

  const loginUrl = new URL("/access", request.url)
  loginUrl.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ["/", "/mate", "/mate/:path*"],
}
