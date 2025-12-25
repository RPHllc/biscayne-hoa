import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Biscayne Point HOA',
  description:
    'Official digital hub for the Biscayne Point Homeowners Association',
};

type NavLink = {
  href: string;
  label: string;
};

const navLinks: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/events', label: 'Events' },
  { href: '/board', label: 'Board & Committees' },
  { href: '/documents', label: 'Documents' },
  { href: '/arb', label: 'ARB' },
  { href: '/portal', label: 'Resident Portal' },
  { href: '/contact', label: 'Contact' },
  { href: '/pay', label: 'Pay Dues' },
];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 font-sans text-slate-800">
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 h-20 flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-700 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">
                BP
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 leading-none">
                  Biscayne Point
                </h1>
                <p className="text-xs text-slate-500 uppercase tracking-wide">
                  HOA
                </p>
              </div>
            </Link>

            <nav className="hidden lg:flex gap-6 items-center">
              {navLinks.map((link) =>
                link.href === '/pay' ? (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="bg-teal-700 hover:bg-teal-800 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm font-semibold text-slate-600 hover:text-teal-700 transition-colors"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            <div className="lg:hidden flex items-center gap-3">
              <Link
                href="/pay"
                className="bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
              >
                Pay Dues
              </Link>
              <details className="relative">
                <summary
                  aria-label="Open navigation menu"
                  className="list-none cursor-pointer text-slate-600 border border-slate-200 rounded-lg p-2 hover:text-teal-700 hover:border-teal-200"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path d="M4 7h16v2H4zM4 11h16v2H4zM4 15h16v2H4z" />
                  </svg>
                </summary>
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white shadow-lg p-3 flex flex-col gap-2">
                  {navLinks
                    .filter((link) => link.href !== '/pay')
                    .map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-sm font-semibold text-slate-600 hover:text-teal-700 transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                </div>
              </details>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-12">{children}</main>

        <footer className="bg-slate-900 text-slate-400 py-12 text-center border-t border-slate-800">
          <p>
            &copy; {new Date().getFullYear()} Biscayne Point Homeowners
            Association.
          </p>
        </footer>
      </body>
    </html>
  );
}
