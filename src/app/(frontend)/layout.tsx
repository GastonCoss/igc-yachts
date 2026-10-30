import type { Metadata } from 'next'
import { Geist, Instrument_Serif } from 'next/font/google'
import Link from 'next/link'
import React from 'react'
import './styles.css'

const sans = Geist({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', variable: '--font-serif', display: 'swap' })

export const metadata: Metadata = {
  title: { default: 'IGC Yachts — Find the yacht made for you', template: '%s — IGC Yachts' },
  description:
    'The most detailed searchable yacht database. Filter every model by length, price, cabins, propulsion, layout and on-board features.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <header className="site-header">
          <div className="wrap header-inner">
            <Link href="/" className="logo" aria-label="IGC Yachts home">
              IGC <span>Yachts</span>
            </Link>
            <nav className="nav">
              <Link href="/yachts">Explore yachts</Link>
              <Link href="/builders">Builders</Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <div className="wrap footer-inner">
            <div>
              <div className="logo logo-small">
                IGC <span>Yachts</span>
              </div>
              <p className="muted">The world&apos;s most detailed searchable yacht database.</p>
            </div>
            <p className="muted small">
              Specifications are compiled from manufacturer data and public sources and may change. Always confirm with the
              builder or an authorised dealer. Trademarks belong to their respective owners.
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
