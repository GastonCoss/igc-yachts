import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="wrap" style={{ padding: '120px 24px', textAlign: 'center' }}>
      <span className="eyebrow">404</span>
      <h1 style={{ fontSize: 64, margin: '16px 0' }}>Lost at sea.</h1>
      <p className="muted">This page doesn&apos;t exist — or the yacht isn&apos;t published yet.</p>
      <p style={{ marginTop: 28 }}>
        <Link href="/yachts" className="btn">
          Explore yachts
        </Link>
      </p>
    </div>
  )
}
