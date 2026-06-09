import { useState, useCallback, useRef } from 'react'
import Cropper from 'react-easy-crop'
import type { Area } from 'react-easy-crop'
import { useTranslation } from 'react-i18next'

interface Props {
  onCrop: (dataUrl: string) => void
  onCancel: () => void
  shape?: 'round' | 'rect'
}

async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<string> {
  const image = await createImageBitmap(await (await fetch(imageSrc)).blob())
  const canvas = document.createElement('canvas')
  const size = Math.min(pixelCrop.width, pixelCrop.height)
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, size, size)
  return canvas.toDataURL('image/png')
}

export default function ImageCropper({ onCrop, onCancel, shape = 'round' }: Props) {
  const { t } = useTranslation()
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImageSrc(reader.result as string)
    reader.readAsDataURL(file)
  }

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  const handleConfirm = async () => {
    if (!imageSrc || !croppedAreaPixels) return
    const result = await getCroppedImg(imageSrc, croppedAreaPixels)
    onCrop(result)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-lg border border-white/10 overflow-hidden">
        {!imageSrc ? (
          <div className="p-8 flex flex-col items-center gap-6">
            <div
              className="w-full h-48 border-2 border-dashed border-white/30 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-purple-400 transition-colors"
              onClick={() => inputRef.current?.click()}
            >
              <svg className="w-12 h-12 text-white/30 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-white/50 text-sm">{t('step.upload')}</span>
            </div>
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
            <button onClick={onCancel} className="text-white/40 hover:text-white/70 text-sm transition-colors">
              {t('cropper.cancel')}
            </button>
          </div>
        ) : (
          <>
            <div className="relative w-full h-80 bg-black">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape={shape === 'rect' ? 'rect' : 'round'}
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="text-white/50 text-xs w-12">{t('cropper.zoom')}</span>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.05}
                  value={zoom}
                  onChange={e => setZoom(Number(e.target.value))}
                  className="flex-1 accent-purple-500"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onCancel}
                  className="flex-1 py-2 rounded-xl border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-all text-sm"
                >
                  {t('cropper.cancel')}
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold hover:opacity-90 transition-opacity text-sm"
                >
                  {t('cropper.confirm')}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
