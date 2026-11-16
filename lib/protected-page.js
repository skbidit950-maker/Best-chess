import { readFile } from "node:fs/promises"
import path from "node:path"
import { NextResponse } from "next/server"
import { ACCESS_COOKIE_NAME, verifyAccessSession } from "./access-session.js"

export async function serveProtectedPage(request, filename) {
  const secret = process.env.SITE_ACCESS_KEY
  const token = request.cookies.get(ACCESS_COOKIE_NAME)?.value

  if (!verifyAccessSession(token, secret)) {
    const loginUrl = new URL("/access", request.url)
    loginUrl.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`)
    return NextResponse.redirect(loginUrl)
  }

  try {
    const html = await readFile(path.join(process.cwd(), "private", filename), "utf8")
    return new Response(html, {
      headers: {
        "Cache-Control": "private, no-store, max-age=0",
        "Content-Type": "text/html; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
      },
    })
  } catch {
    return new Response("The protected page could not be loaded.", {
      status: 500,
      headers: { "Cache-Control": "no-store" },
    })
  }
}
