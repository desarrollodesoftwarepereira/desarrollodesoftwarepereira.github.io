import { useTranslation } from 'react-i18next'
import HolderRenderer from './HolderRenderer'
import HolderForm from './HolderForm'
import type { HolderColor } from './HolderRenderer'

interface Props {
  discImage: string | null
  holderImage: string | null
  onHolderImageChange: (url: string | null) => void
  color: HolderColor
  onColorChange: (color: HolderColor) => void
}

export default function HolderSection({ discImage, holderImage, onHolderImageChange, color, onColorChange }: Props) {
  const { t } = useTranslation()
  const displayImage = holderImage ?? discImage

  return (
    <section id="holder-section" className="w-full min-h-screen bg-black py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">{t('holder.title')}</h2>
          <p className="text-white/50 text-lg">{t('holder.subtitle')}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          {/* 3D Render */}
          <div className="flex-1 min-h-[420px] bg-white/3 rounded-2xl border border-white/10 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 to-purple-900/20 pointer-events-none" />
            <HolderRenderer frontImageUrl={displayImage} color={color} />
          </div>

          {/* Form */}
          <div className="flex-1 bg-white/3 rounded-2xl border border-white/10 p-8">
            <HolderForm
              discImage={discImage}
              holderImage={holderImage}
              onHolderImageChange={onHolderImageChange}
              color={color}
              onColorChange={onColorChange}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
