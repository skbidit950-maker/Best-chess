import AccessForm from "./access-form.js"

export const metadata = {
  title: "Private Study Room",
  description: "Enter the access key to continue to the private chess study room.",
}

export default function AccessPage() {
  return (
    <main className="access-shell">
      <section className="access-card" aria-labelledby="access-title">
        <div className="access-mark" aria-hidden="true">M</div>
        <p className="access-eyebrow">MATE STUDY ROOM</p>
        <h1 id="access-title">A private place to play.</h1>
        <p className="access-copy">Enter your access key to continue to the study room.</p>
        <AccessForm />
        <p className="access-footnote">Your key is checked securely and is never stored in this browser.</p>
      </section>
    </main>
  )
}
