import { useTranslation } from 'react-i18next'
import jsPDF from 'jspdf'
import { BASE_PRICE_COP, NFC_PRICE_COP, HOLDER_COLOR_PRICE_COP, WHATSAPP_NUMBER } from '../../Constant'
import type { HolderColor } from './holder/HolderRenderer'

function formatCOP(value: number) {
  return value.toLocaleString('es-CO')
}

interface Props {
  discImage: string | null
  nfcUrl: string
  qrDataUrl: string | null
  holderDisplayImage: string | null
  holderColor: HolderColor
}

function calcTotal(nfcUrl: string, holderColor: HolderColor) {
  let total = BASE_PRICE_COP
  if (nfcUrl) {
    try { new URL(nfcUrl); total += NFC_PRICE_COP } catch { /* invalid */ }
  }
  if (holderColor !== 'transparent') total += HOLDER_COLOR_PRICE_COP
  return total
}

async function buildPdf(t: (key: string) => string, discImage: string, nfcUrl: string, qrDataUrl: string | null, holderDisplayImage: string | null, holderColor: HolderColor, total: number) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const W = 210
  const margin = 20

  // ── Page 1: Mini Disc ──
  doc.setFillColor(15, 10, 30)
  doc.rect(0, 0, W, 297, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text(t('pdf.title'), margin, 20)

  doc.setFontSize(16)
  doc.setTextColor(180, 130, 255)
  doc.text(t('pdf.discSection'), margin, 35)

  // Disc image (circular look via square with note)
  doc.setFontSize(10)
  doc.setTextColor(200, 200, 200)
  doc.text(t('pdf.discImage'), margin, 48)
  doc.addImage(discImage, 'PNG', margin, 52, 60, 60)

  let y = 125
  // NFC URL
  doc.setFontSize(10)
  doc.setTextColor(180, 130, 255)
  doc.text(t('pdf.nfcUrl') + ':', margin, y)
  doc.setTextColor(255, 255, 255)
  doc.text(nfcUrl || t('pdf.nfcNone'), margin + 30, y)
  y += 10

  // QR
  if (qrDataUrl) {
    doc.setTextColor(180, 130, 255)
    doc.text(t('pdf.qr') + ':', margin, y)
    y += 5
    doc.addImage(qrDataUrl, 'PNG', margin, y, 50, 50)
    y += 55
  }

  // ── Page 2: Holder ──
  doc.addPage()
  doc.setFillColor(15, 10, 30)
  doc.rect(0, 0, W, 297, 'F')

  doc.setTextColor(180, 130, 255)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text(t('pdf.holderSection'), margin, 25)

  if (holderDisplayImage) {
    doc.setFontSize(10)
    doc.setTextColor(200, 200, 200)
    doc.text(t('pdf.holderImage'), margin, 38)
    doc.addImage(holderDisplayImage, 'PNG', margin, 42, 60, 60)
  }

  doc.setFontSize(10)
  doc.setTextColor(180, 130, 255)
  doc.text(t('pdf.holderColor') + ':', margin, 115)
  doc.setTextColor(255, 255, 255)
  doc.text(holderColor.charAt(0).toUpperCase() + holderColor.slice(1), margin + 35, 115)

  // ── Footer both pages ──
  const pages = doc.getNumberOfPages()
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p)
    doc.setFontSize(9)
    doc.setTextColor(120, 120, 140)
    doc.text(t('pdf.date') + ': ' + new Date().toLocaleDateString(), margin, 280)
    doc.setTextColor(100, 220, 100)
    doc.text(t('pdf.totalPrice') + ': $' + formatCOP(total) + ' COP', margin, 287)
  }

  return doc
}

export default function BuyButton({ discImage, nfcUrl, qrDataUrl, holderDisplayImage, holderColor }: Props) {
  const { t } = useTranslation()
  const disabled = !discImage
  const total = calcTotal(nfcUrl, holderColor)

  const handleBuy = async () => {
    if (!discImage) return

    const doc = await buildPdf(t, discImage, nfcUrl, qrDataUrl, holderDisplayImage, holderColor, total)
    const pdfName = 'MiniDisco-Orden.pdf'
    doc.save(pdfName)

    const msg = encodeURIComponent(t('whatsapp.message') + pdfName)
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank')
  }

  return (
    <section className="w-full bg-black py-16 px-6">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-6">
        {/* Price summary */}
        <div className="w-full max-w-md bg-white/5 rounded-2xl border border-white/10 p-6">
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between text-white/60">
              <span>{t('price.base')}</span>
              <span>${formatCOP(BASE_PRICE_COP)} COP</span>
            </div>
            {nfcUrl && (() => { try { new URL(nfcUrl); return true } catch { return false } })() && (
              <div className="flex justify-between text-purple-400">
                <span>{t('price.nfc')}</span>
                <span>+${formatCOP(NFC_PRICE_COP)} COP</span>
              </div>
            )}
            {holderColor !== 'transparent' && (
              <div className="flex justify-between text-cyan-400">
                <span>{t('price.holderColor')}</span>
                <span>+${formatCOP(HOLDER_COLOR_PRICE_COP)} COP</span>
              </div>
            )}
            <div className="flex justify-between text-white font-bold text-lg mt-2 pt-2 border-t border-white/15">
              <span>{t('price.total')}</span>
              <span>${formatCOP(total)} COP</span>
            </div>
          </div>
        </div>

        {!discImage && (
          <p className="text-white/40 text-sm">{t('disc.form.frontImageRequired')}</p>
        )}

        <button
          onClick={handleBuy}
          disabled={disabled}
          className={`px-12 py-5 rounded-full font-bold text-lg transition-all duration-300 ${
            disabled
              ? 'bg-white/10 text-white/30 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:shadow-[0_0_50px_rgba(139,92,246,0.7)] hover:scale-105'
          }`}
        >
          {t('form.buy')}
        </button>

        <p className="text-white/30 text-xs text-center max-w-sm">{t('form.buyHint')}</p>
      </div>
    </section>
  )
}
