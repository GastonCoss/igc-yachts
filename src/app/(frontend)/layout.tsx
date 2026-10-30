import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import Link from 'next/link'
import React from 'react'
import { InstagramIcon } from '@/components/site/InstagramIcon'
import { SITE } from '@/lib/site'
import './styles.css'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: 'IGC Yachts — Find the yacht made for you', template: '%s — IGC Yachts' },
  description:
    'The most detailed searchable yacht database. Filter every model by length, price, cabins, propulsion, layout and on-board features.',
}

function Logo() {
  return (
    <Link href="/" className="logo" aria-label="IGC Yachts home">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo-igc-white.png" alt="" width={1014} height={194} />
      <span className="logo-word">
        IGC <span>YACHTS</span>
      </span>
    </Link>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body>
        <header className="site-header on-dark">
          <div className="wrap header-inner">
            <Logo />
            <nav className="nav" aria-label="Main">
              <Link href="/yachts">Yachts</Link>
              <Link href="/builders">Builders</Link>
              <a className="icon-link" href={SITE.instagram} target="_blank" rel="noreferrer" aria-label="IGC Yachts on Instagram">
                <InstagramIcon />
                <span>Instagram</span>
              </a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="site-footer on-dark">
          <div className="wrap">
            <div className="footer-top">
              <div>
                <Logo />
                <p className="footer-tagline">Every yacht, measured and compared.</p>
              </div>
              <div className="footer-links">
                <Link href="/yachts">Explore yachts</Link>
                <Link href="/builders">Builders</Link>
                <a className="icon-link" href={SITE.instagram} target="_blank" rel="noreferrer">
                  <InstagramIcon />
                  {SITE.instagramHandle}
                </a>
              </div>
            </div>
            <p className="footer-legal">
              Specifications are compiled from manufacturer data and public sources and may change. Always confirm
              with the builder or an authorised dealer. Trademarks belong to their respective owners. © {new Date().getFullYear()} IGC Yachts.
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
