import { useTranslation } from 'react-i18next'
import { useEffect, useRef, useState } from 'react'

const DISCS = ['atardecer', 'calle', 'siempre'] as const

export default function HeroSection() {
  const { t, i18n } = useTranslation()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [nextIndex, setNextIndex] = useState(1)
  const [flipping, setFlipping] = useState(false)
  const [showBack, setShowBack] = useState(false)
  const [bgVisible, setBgVisible] = useState(true)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'es' ? 'en' : 'es')
  }

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const next = (currentIndex + 1) % DISCS.length
      setNextIndex(next)
      setFlipping(true)

      // At 90deg mid-point swap face + fade bg out
      setTimeout(() => {
        setShowBack(true)
        setBgVisible(false)
      }, 400)

      // Fade new bg in after swap
      setTimeout(() => {
        setCurrentIndex(next)
        setFlipping(false)
        setShowBack(false)
        setBgVisible(true)
      }, 800)
    }, 3500)

    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [currentIndex])

  const current = DISCS[currentIndex]
  const next = DISCS[nextIndex]

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black">

      {/* Product preview images — crossfade (never both visible at same time) */}
      {DISCS.map((disc, i) => (
        <img
          key={disc}
          src={`/assets/images/minidiscos/${disc}.png`}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-contain object-center pointer-events-none transition-opacity duration-500"
          style={{ opacity: i === currentIndex && bgVisible ? 0.75 : 0 }}
        />
      ))}

      {/* Minimal dark overlay — just enough for text contrast */}
      <div className="absolute inset-0 bg-black/35" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)',
        }}
      />

      {/* Subtle color accent orbs */}
      <div className="absolute top-1/4 left-1/6 w-80 h-80 bg-purple-600 rounded-full blur-[140px] opacity-25 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-cyan-500 rounded-full blur-[140px] opacity-20 pointer-events-none" />

      {/* Lang toggle */}
      <button
        onClick={toggleLang}
        className="absolute top-6 right-6 z-10 px-4 py-2 rounded-full border border-white/30 text-white/80 text-sm font-semibold backdrop-blur-sm hover:border-white hover:text-white transition-all"
      >
        {t('lang.switch')}
      </button>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl">
        {/* Badge */}
        <span className="mb-6 px-4 py-1 rounded-full bg-white/10 border border-white/20 text-white/70 text-xs font-medium tracking-widest uppercase backdrop-blur-sm">
          {t('hero.badge')}
        </span>

        {/* CD flip */}
        <div className="mb-8 relative flex items-center justify-center" style={{ perspective: '800px' }}>
          {/* Glow behind disc */}
          <div className="absolute w-52 h-52 rounded-full bg-purple-500 blur-[60px] opacity-40 pointer-events-none" />

          <div
            className="w-48 h-48 relative"
            style={{
              transformStyle: 'preserve-3d',
              transform: flipping
                ? showBack ? 'rotateY(180deg)' : 'rotateY(90deg)'
                : 'rotateY(0deg)',
              transition: flipping
                ? showBack ? 'transform 0.4s ease-in' : 'transform 0.4s ease-out'
                : 'none',
            }}
          >
            {/* Front face */}
            <div
              className="absolute inset-0 rounded-full overflow-hidden"
              style={{
                backfaceVisibility: 'hidden',
                boxShadow: '0 0 40px rgba(139,92,246,0.6), 0 0 80px rgba(139,92,246,0.3)',
              }}
            >
              <img src={`/assets/images/minidiscos/${current}-cover.png`} alt={current} className="w-full h-full object-cover" />
              {/* Sheen overlay */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />
              {/* Center hole */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-10 h-10 rounded-full bg-black/80 border-2 border-white/30 shadow-inner" />
              </div>
            </div>

            {/* Back face */}
            <div
              className="absolute inset-0 rounded-full overflow-hidden"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                boxShadow: '0 0 40px rgba(139,92,246,0.6), 0 0 80px rgba(139,92,246,0.3)',
              }}
            >
              <img src={`/assets/images/minidiscos/${next}-cover.png`} alt={next} className="w-full h-full object-cover" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-10 h-10 rounded-full bg-black/80 border-2 border-white/30 shadow-inner" />
              </div>
            </div>
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-[0_2px_20px_rgba(0,0,0,0.8)]">
          {t('hero.title')}
        </h1>

        <p className="text-lg md:text-xl text-white/80 mb-10 leading-relaxed drop-shadow-[0_1px_10px_rgba(0,0,0,0.9)]">
          {t('hero.subtitle')}
        </p>

        <a
          href="#disc-section"
          className="px-10 py-4 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-bold text-lg shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:shadow-[0_0_50px_rgba(139,92,246,0.7)] hover:scale-105 transition-all duration-300"
        >
          {t('hero.cta')}
        </a>

        {/* Disc indicators */}
        <div className="flex gap-2 mt-8">
          {DISCS.map((disc, i) => (
            <div
              key={disc}
              className="h-2 rounded-full transition-all duration-500"
              style={{
                width: i === currentIndex ? '24px' : '8px',
                background: i === currentIndex ? 'white' : 'rgba(255,255,255,0.3)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-bounce">
        <div className="w-px h-8 bg-white/30" />
        <div className="w-2 h-2 rounded-full bg-white/40" />
      </div>
    </section>
  )
}
