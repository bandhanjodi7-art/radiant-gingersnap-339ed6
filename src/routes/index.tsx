import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div id="phone">
      <main id="appMain">
        <section className="flex-1 flex items-center gradient-bg text-white py-10 px-4 text-center">
          <div className="space-y-6 w-full">
            <span className="font-serif text-3xl font-bold">
              Bandhan<span className="text-rose-200">Jodi</span>
            </span>
            <h1 className="font-serif text-4xl font-bold leading-tight">
              Where Two Souls Join in <span className="gold-gradient">Sacred Harmony</span>
            </h1>
            <p className="text-slate-200">
              Discover verified profiles tailored to your values, culture, and life goals.
            </p>
            <a href="tel:7692962396" className="inline-block bg-white text-rose-700 font-bold px-6 py-3 rounded-xl">
              Helpline: 7692962396
            </a>
          </div>
        </section>
      </main>
    </div>
  )
}
