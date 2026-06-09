import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { QRCodeCanvas } from 'qrcode.react'
import ImageCropper from '../ImageCropper'
import { BASE_PRICE_COP, NFC_PRICE_COP } from '../../../Constant'

function formatCOP(value: number) {
  return value.toLocaleString('es-CO')
}

interface FormValues {
  nfcUrl: string
}

interface Props {
  discImage: string | null
  onDiscImageChange: (url: string) => void
  nfcUrl: string
  onNfcUrlChange: (url: string) => void
  onQrDataUrl: (url: string | null) => void
}

export default function DiscForm({ discImage, onDiscImageChange, nfcUrl, onNfcUrlChange, onQrDataUrl }: Props) {
  const { t } = useTranslation()
  const [showCropper, setShowCropper] = useState(false)
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null)

  const { register, watch, formState: { errors } } = useForm<FormValues>({
    defaultValues: { nfcUrl: '' },
    mode: 'onChange',
  })

  const watchedUrl = watch('nfcUrl')
  const isValidUrl = (() => {
    if (!watchedUrl) return false
    try { new URL(watchedUrl); return true } catch { return false }
  })()

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    onNfcUrlChange(val)
    if (!val) {
      onQrDataUrl(null)
    }
  }

  const handleQrRender = () => {
    if (!isValidUrl) return
    // Give canvas time to render
    setTimeout(() => {
      const canvas = document.getElementById('disc-qr-canvas') as HTMLCanvasElement | null
      if (canvas) {
        onQrDataUrl(canvas.toDataURL('image/png'))
      }
    }, 100)
  }

  const hasNfc = isValidUrl && watchedUrl === nfcUrl && nfcUrl.length > 0
  const nfcPrice = hasNfc ? NFC_PRICE_COP : 0
  const total = BASE_PRICE_COP + nfcPrice

  return (
    <>
      {showCropper && (
        <ImageCropper
          onCrop={url => { onDiscImageChange(url); setShowCropper(false) }}
          onCancel={() => setShowCropper(false)}
        />
      )}

      <div className="flex flex-col gap-6 h-full">
        {/* Front image */}
        <div>
          <label className="block text-white/70 text-sm font-medium mb-2">
            {t('disc.form.frontImage')} <span className="text-red-400">*</span>
          </label>
          {discImage ? (
            <div className="flex items-center gap-4">
              <img
                src={discImage}
                alt="front"
                className="w-20 h-20 rounded-full object-cover border-2 border-purple-500/50 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
              />
              <button
                type="button"
                onClick={() => setShowCropper(true)}
                className="px-4 py-2 rounded-lg border border-white/20 text-white/70 hover:text-white hover:border-white/40 text-sm transition-all"
              >
                {t('disc.form.changeImage')}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowCropper(true)}
              className="w-full py-4 rounded-xl border-2 border-dashed border-purple-500/40 text-purple-400 hover:border-purple-400 hover:text-purple-300 transition-all text-sm font-medium"
            >
              + {t('disc.form.uploadImage')}
            </button>
          )}
        </div>

        {/* NFC URL */}
        <div>
          <label className="block text-white/70 text-sm font-medium mb-2">
            {t('disc.form.nfcUrl')}
          </label>
          <input
            {...register('nfcUrl', {
              validate: v => !v || (() => { try { new URL(v); return true } catch { return t('disc.form.nfcUrlInvalid') as string } })(),
              onChange: handleUrlChange,
            })}
            type="url"
            placeholder={t('disc.form.nfcUrlPlaceholder')}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all text-sm"
            onBlur={handleQrRender}
          />
          {errors.nfcUrl && (
            <p className="mt-1 text-red-400 text-xs">{errors.nfcUrl.message}</p>
          )}
          {isValidUrl && (
            <div className="mt-3 flex flex-col gap-3">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-medium w-fit">
                ✦ {t('disc.form.nfcPrice')}
              </span>
              <div className="flex flex-col items-start gap-2">
                <span className="text-white/50 text-xs">{t('disc.form.nfcQrPreview')}</span>
                <div className="p-2 bg-white rounded-lg">
                  <QRCodeCanvas
                    id="disc-qr-canvas"
                    ref={ref => { qrCanvasRef.current = ref }}
                    value={nfcUrl || watchedUrl}
                    size={100}
                    onLoad={handleQrRender}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="mt-auto pt-4 border-t border-white/10">
          <div className="flex flex-col gap-1 text-sm">
            <div className="flex justify-between text-white/50">
              <span>{t('price.base')}</span>
              <span>${formatCOP(BASE_PRICE_COP)} {t('price.cop')}</span>
            </div>
            {hasNfc && (
              <div className="flex justify-between text-cyan-400">
                <span>{t('price.nfc')}</span>
                <span>+${formatCOP(NFC_PRICE_COP)} {t('price.cop')}</span>
              </div>
            )}
            <div className="flex justify-between text-white font-bold text-base mt-1 pt-1 border-t border-white/10">
              <span>{t('price.total')}</span>
              <span>${formatCOP(total)} {t('price.cop')}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
