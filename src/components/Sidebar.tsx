'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Fingerprint, 
  Wrench,
  ExternalLink
} from 'lucide-react'

const tools = [
  {
    name: 'Meta Shift',
    description: 'Transformar metadados',
    href: '/tools/meta-shift',
    icon: Fingerprint,
    status: 'active' as const,
  },
  // Adicione mais tools aqui
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-zoopi-card border-r border-zoopi-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-zoopi-border">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-zoopi-accent flex items-center justify-center">
            <span className="text-white font-bold text-lg">Z</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-zoopi-text">Zoopi Tools</h1>
            <p className="text-xs text-zoopi-text-muted">by Zoopi Group</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <Link
          href="/"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
            pathname === '/' 
              ? 'bg-zoopi-accent/10 text-zoopi-accent' 
              : 'text-zoopi-text-muted hover:text-zoopi-text hover:bg-zoopi-hover'
          }`}
        >
          <Home size={18} />
          <span className="text-sm font-medium">Início</span>
        </Link>

        <div className="pt-4 pb-2">
          <span className="px-3 text-xs font-medium text-zoopi-text-muted uppercase tracking-wider">
            Ferramentas
          </span>
        </div>

        {tools.map((tool) => {
          const Icon = tool.icon
          const isActive = pathname === tool.href

          return (
            <Link
              key={tool.href}
              href={tool.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? 'bg-zoopi-accent/10 text-zoopi-accent'
                  : 'text-zoopi-text-muted hover:text-zoopi-text hover:bg-zoopi-hover'
              }`}
            >
              <Icon size={18} />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium block truncate">{tool.name}</span>
              </div>
              {tool.status === 'active' && (
                <span className="w-1.5 h-1.5 rounded-full bg-zoopi-success" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-zoopi-border">
        <a
          href="https://zoopfinance.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 text-sm text-zoopi-text-muted hover:text-zoopi-text transition-colors"
        >
          <span>Zoopi Finance</span>
          <ExternalLink size={14} />
        </a>
      </div>
    </aside>
  )
}
