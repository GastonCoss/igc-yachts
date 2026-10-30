import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="wrap notfound">
      <h1>Lost at sea.</h1>
      <p className="muted">This page doesn&apos;t exist, or the yacht isn&apos;t published yet.</p>
      <p style={{ marginTop: 36 }}>
        <Link href="/yachts" className="btn">
          Explore yachts
        </Link>
      </p>
    </div>
  )
}
