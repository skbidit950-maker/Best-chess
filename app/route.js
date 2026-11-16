import { serveProtectedPage } from "../lib/protected-page.js"

export const dynamic = "force-dynamic"

export function GET(request) {
  return serveProtectedPage(request, "index.html")
}
