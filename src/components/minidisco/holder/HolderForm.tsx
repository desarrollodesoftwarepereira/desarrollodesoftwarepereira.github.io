import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ImageCropper from '../ImageCropper'
import { HOLDER_COLOR_PRICE_COP } from '../../../Constant'
import type { HolderColor } from './HolderRenderer'

function formatCOP(value: number) {
  return value.toLocaleString('es-CO')
}

interface Props {
  discImage: string | null
  holderImage: string | null
  onHolderImageChange: (url: string | null) => void
  color: HolderColor
  onColorChange: (color: HolderColor) => void
}

const COLORS: { value: HolderColor; labelKey: string }[] = [
  { value: 'transparent', labelKey: 'holder.form.colorTransparentLabel' },
  { value: 'black', labelKey: 'holder.form.colorBlackLabel' },
  { value: 'white', labelKey: 'holder.form.colorWhiteLabel' },
]

export default function HolderForm({ discImage, holderImage, onHolderImageChange, color, onColorChange }: Props) {
  const { t } = useTranslation()
  const [sameAsDisc, setSameAsDisc] = useState(true)
  const [showCropper, setShowCropper] = useState(false)

  const displayImage = sameAsDisc ? discImage : holderImage
  const colorPrice = color !== 'transparent' ? HOLDER_COLOR_PRICE_COP : 0

  const handleSameToggle = (checked: boolean) => {
    setSameAsDisc(checked)
    if (checked) onHolderImageChange(null)
  }

  const handleCrop = (url: string) => {
    onHolderImageChange(url)
    setSameAsDisc(false)
    setShowCropper(false)
  }

  return (
    <>
      {showCropper && (
        <ImageCropper
          onCrop={handleCrop}
          onCancel={() => setShowCropper(false)}
          shape="rect"
        />
      )}

      <div className="flex flex-col gap-6 h-full">
        {/* Front image */}
        <div>
          <label className="block text-white/70 text-sm font-medium mb-2">
            {t('holder.form.frontImage')}
          </label>

          <label className="flex items-center gap-3 cursor-pointer mb-3">
            <div
              className={`w-10 h-5 rounded-full transition-colors relative ${sameAsDisc ? 'bg-purple-500' : 'bg-white/20'}`}
              onClick={() => handleSameToggle(!sameAsDisc)}
            >
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${sameAsDisc ? 'left-5' : 'left-0.5'}`} />
            </div>
            <span className="text-white/60 text-sm">{t('holder.form.sameAsDisc')}</span>
          </label>

          {displayImage ? (
            <div className="flex items-center gap-4">
              <img
                src={displayImage}
                alt="holder front"
                className="w-20 h-20 rounded-lg object-cover border-2 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
              />
              {!sameAsDisc && (
                <button
                  type="button"
                  onClick={() => setShowCropper(true)}
                  className="px-4 py-2 rounded-lg border border-white/20 text-white/70 hover:text-white hover:border-white/40 text-sm transition-all"
                >
                  {t('holder.form.changeImage')}
                </button>
              )}
              {sameAsDisc && (
                <button
                  type="button"
                  onClick={() => { setSameAsDisc(false); setShowCropper(true) }}
                  className="px-4 py-2 rounded-lg border border-white/20 text-white/70 hover:text-white hover:border-white/40 text-sm transition-all"
                >
                  {t('holder.form.changeImage')}
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => { setSameAsDisc(false); setShowCropper(true) }}
              className="w-full py-4 rounded-xl border-2 border-dashed border-cyan-500/40 text-cyan-400 hover:border-cyan-400 hover:text-cyan-300 transition-all text-sm font-medium"
            >
              + {t('holder.form.changeImage')}
            </button>
          )}
        </div>

        {/* Color */}
        <div>
          <label className="block text-white/70 text-sm font-medium mb-3">
            {t('holder.form.color')}
          </label>
          <div className="flex flex-col gap-2">
            {COLORS.map(({ value, labelKey }) => (
              <button
                key={value}
                type="button"
                onClick={() => onColorChange(value)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-sm ${
                  color === value
                    ? 'border-cyan-500 bg-cyan-500/10 text-white'
                    : 'border-white/10 text-white/60 hover:border-white/30 hover:text-white/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border ${
                      value === 'transparent'
                        ? 'border-white/40 bg-white/10'
                        : value === 'black'
                        ? 'border-gray-600 bg-gray-900'
                        : 'border-gray-300 bg-white'
                    }`}
                  />
                  <span>{t(labelKey)}</span>
                </div>
                {color === value && (
                  <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Price */}
        <div className="mt-auto pt-4 border-t border-white/10">
          <div className="flex flex-col gap-1 text-sm">
            <div className="flex justify-between text-white/50">
              <span>{t('holder.form.included')}</span>
              <span className="text-green-400 text-xs">✓</span>
            </div>
            {colorPrice > 0 && (
              <div className="flex justify-between text-cyan-400">
                <span>{t('price.holderColor')}</span>
                <span>+${formatCOP(colorPrice)} COP</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
