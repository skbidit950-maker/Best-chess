"use client"

import { useState } from "react"

export default function AccessForm() {
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    if (isSubmitting) return

    const form = event.currentTarget
    const formData = new FormData(form)
    const key = formData.get("key")
    setError("")
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
        cache: "no-store",
      })
      const result = await response.json()

      if (!response.ok) {
        setError(result.error || "Unable to verify the key. Please try again.")
        return
      }

      const requestedPath = new URLSearchParams(window.location.search).get("next")
      const destination = requestedPath?.startsWith("/") && !requestedPath.startsWith("//")
        ? requestedPath
        : "/mate"
      window.location.replace(destination)
    } catch {
      setError("Unable to verify the key. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="access-form" onSubmit={handleSubmit}>
      <label htmlFor="access-key">Access key</label>
      <input
        id="access-key"
        name="key"
        type="password"
        autoComplete="current-password"
        autoCapitalize="none"
        spellCheck="false"
        required
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "access-error" : undefined}
        placeholder="Enter your key"
        disabled={isSubmitting}
      />
      {error ? <p id="access-error" className="access-error" role="alert">{error}</p> : null}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Checking key…" : "Enter study room"}
      </button>
    </form>
  )
}
