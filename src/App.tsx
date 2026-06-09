import { useState } from 'react'
import HeroSection from './components/minidisco/HeroSection'
import DiscSection from './components/minidisco/disc/DiscSection'
import HolderSection from './components/minidisco/holder/HolderSection'
import BuyButton from './components/minidisco/BuyButton'
import type { HolderColor } from './components/minidisco/holder/HolderRenderer'

const App: React.FC = () => {
  const [discImage, setDiscImage] = useState<string | null>(null)
  const [nfcUrl, setNfcUrl] = useState('')
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [holderImage, setHolderImage] = useState<string | null>(null)
  const [holderColor, setHolderColor] = useState<HolderColor>('transparent')

  const holderDisplayImage = holderImage ?? discImage

  return (
    <div className="w-full min-h-full bg-black">
      <HeroSection />
      <DiscSection
        discImage={discImage}
        onDiscImageChange={setDiscImage}
        nfcUrl={nfcUrl}
        onNfcUrlChange={setNfcUrl}
        qrDataUrl={qrDataUrl}
        onQrDataUrl={setQrDataUrl}
      />
      <HolderSection
        discImage={discImage}
        holderImage={holderImage}
        onHolderImageChange={setHolderImage}
        color={holderColor}
        onColorChange={setHolderColor}
      />
      <BuyButton
        discImage={discImage}
        nfcUrl={nfcUrl}
        qrDataUrl={qrDataUrl}
        holderDisplayImage={holderDisplayImage}
        holderColor={holderColor}
      />
    </div>
  )
}

export default App
