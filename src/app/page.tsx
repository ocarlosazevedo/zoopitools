import Link from 'next/link'
import { Fingerprint, ArrowRight, Sparkles } from 'lucide-react'

const tools = [
  {
    id: 'meta-shift',
    name: 'Meta Shift',
    description: 'Transforme metadados de imagens e vídeos para evitar bloqueios de criativos.',
    href: '/tools/meta-shift',
    icon: Fingerprint,
    features: ['Imagens & Vídeos', 'Presets realistas', 'Hash único'],
    status: 'Disponível',
  },
]

const comingSoon = [
  { name: 'Thumbnail Generator', description: 'Gere thumbnails otimizadas para anúncios' },
  { name: 'Copy Spinner', description: 'Variações de copy para testes A/B' },
  { name: 'Creative Analyzer', description: 'Análise de performance de criativos' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-12 animate-fade-in">
          <div className="flex items-center gap-2 text-zoopi-accent mb-4">
            <Sparkles size={20} />
            <span className="text-sm font-medium">Zoopi Group</span>
          </div>
          <h1 className="text-4xl font-bold text-zoopi-text mb-3">
            Zoopi Tools
          </h1>
          <p className="text-lg text-zoopi-text-muted max-w-2xl">
            Ferramentas profissionais para media buyers. Otimize seus criativos, 
            evite bloqueios e escale suas campanhas.
          </p>
        </header>

        {/* Available Tools */}
        <section className="mb-16">
          <h2 className="text-sm font-medium text-zoopi-text-muted uppercase tracking-wider mb-6">
            Ferramentas Disponíveis
          </h2>
          <div className="grid gap-4">
            {tools.map((tool, index) => {
              const Icon = tool.icon
              return (
                <Link
                  key={tool.id}
                  href={tool.href}
                  className="group block animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="bg-zoopi-card border border-zoopi-border rounded-xl p-6 transition-all hover:border-zoopi-accent/50 hover:bg-zoopi-hover">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-zoopi-accent/10 flex items-center justify-center text-zoopi-accent">
                          <Icon size={24} />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-lg font-semibold text-zoopi-text">
                              {tool.name}
                            </h3>
                            <span className="px-2 py-0.5 text-xs font-medium bg-zoopi-success/10 text-zoopi-success rounded-full">
                              {tool.status}
                            </span>
                          </div>
                          <p className="text-zoopi-text-muted mb-3">
                            {tool.description}
                          </p>
                          <div className="flex gap-2">
                            {tool.features.map((feature) => (
                              <span
                                key={feature}
                                className="px-2 py-1 text-xs bg-zoopi-bg border border-zoopi-border rounded-md text-zoopi-text-muted"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-zoopi-text-muted group-hover:text-zoopi-accent transition-colors">
                        <ArrowRight size={20} />
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Coming Soon */}
        <section>
          <h2 className="text-sm font-medium text-zoopi-text-muted uppercase tracking-wider mb-6">
            Em Breve
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {comingSoon.map((item, index) => (
              <div
                key={item.name}
                className="bg-zoopi-card/50 border border-zoopi-border/50 rounded-xl p-5 opacity-60 animate-slide-up"
                style={{ animationDelay: `${(index + 1) * 100}ms` }}
              >
                <h3 className="font-medium text-zoopi-text mb-1">{item.name}</h3>
                <p className="text-sm text-zoopi-text-muted">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
