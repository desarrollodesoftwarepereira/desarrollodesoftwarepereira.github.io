import { useTranslation } from 'react-i18next'
import DiscRenderer from './DiscRenderer'
import DiscForm from './DiscForm'

interface Props {
  discImage: string | null
  onDiscImageChange: (url: string) => void
  nfcUrl: string
  onNfcUrlChange: (url: string) => void
  qrDataUrl: string | null
  onQrDataUrl: (url: string | null) => void
}

export default function DiscSection({ discImage, onDiscImageChange, nfcUrl, onNfcUrlChange, qrDataUrl, onQrDataUrl }: Props) {
  const { t } = useTranslation()

  return (
    <section id="disc-section" className="w-full min-h-screen bg-black py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">{t('disc.title')}</h2>
          <p className="text-white/50 text-lg">{t('disc.subtitle')}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          {/* 3D Render */}
          <div className="flex-1 min-h-[420px] bg-white/3 rounded-2xl border border-white/10 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-cyan-900/20 pointer-events-none" />
            <DiscRenderer frontImageUrl={discImage} backQrUrl={qrDataUrl} />
            {!discImage && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-white/20 text-sm text-center px-8">{t('disc.form.uploadImage')}</p>
              </div>
            )}
          </div>

          {/* Form */}
          <div className="flex-1 bg-white/3 rounded-2xl border border-white/10 p-8">
            <DiscForm
              discImage={discImage}
              onDiscImageChange={onDiscImageChange}
              nfcUrl={nfcUrl}
              onNfcUrlChange={onNfcUrlChange}
              onQrDataUrl={onQrDataUrl}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
