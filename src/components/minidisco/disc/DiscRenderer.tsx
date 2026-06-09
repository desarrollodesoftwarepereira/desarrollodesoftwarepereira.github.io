import { useState, useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

interface DiscMeshProps {
  frontImageUrl: string | null
  backQrUrl: string | null
}

function DiscMesh({ frontImageUrl, backQrUrl }: DiscMeshProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [frontTexture, setFrontTexture] = useState<THREE.Texture | null>(null)
  const [backTexture, setBackTexture] = useState<THREE.Texture | null>(null)

  useEffect(() => {
    if (!frontImageUrl) { setFrontTexture(null); return }
    const loader = new THREE.TextureLoader()
    loader.load(frontImageUrl, (tex) => { tex.needsUpdate = true; setFrontTexture(tex) })
  }, [frontImageUrl])

  useEffect(() => {
    if (!backQrUrl) { setBackTexture(null); return }
    const loader = new THREE.TextureLoader()
    loader.load(backQrUrl, (tex) => { tex.needsUpdate = true; setBackTexture(tex) })
  }, [backQrUrl])

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.4
  })

  const outerR = 1
  const depth = 0.06
  const segments = 128

  // Cara frontal: círculo completo, UVs correctos
  const frontGeo = new THREE.CircleGeometry(outerR, segments)

  // Cara trasera QR: PlaneGeometry cuadrado que cabe dentro del círculo sin recorte
  // Lado máximo inscrito en círculo radio 1: √2 ≈ 1.414 → usamos 1.36 con margen
  const qrSize = outerR * Math.SQRT2 * 0.96
  const backGeo = new THREE.PlaneGeometry(qrSize, qrSize)

  // Borde exterior del disco (cilindro a lo largo de Z)
  const rimGeo = new THREE.CylinderGeometry(outerR, outerR, depth, segments, 1, true)
  rimGeo.rotateX(Math.PI / 2)

  const acrylicMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0xffffff),
    transmission: 0.88,
    roughness: 0.05,
    metalness: 0,
    thickness: 0.1,
    transparent: true,
    opacity: 0.65,
    side: THREE.DoubleSide,
  })

  const frontMat = frontTexture
    ? new THREE.MeshBasicMaterial({ map: frontTexture, side: THREE.FrontSide, transparent: true })
    : new THREE.MeshPhysicalMaterial({ color: 0xcccccc, transmission: 0.8, roughness: 0.1, transparent: true, opacity: 0.5 })

  const backMat = backTexture
    ? new THREE.MeshBasicMaterial({ map: backTexture, side: THREE.FrontSide, transparent: true })
    : new THREE.MeshPhysicalMaterial({ color: 0xaaaaaa, transmission: 0.8, roughness: 0.1, transparent: true, opacity: 0.4 })

  return (
    <group ref={groupRef}>
      {/* Cara frontal (imagen) — normal +Z */}
      <mesh geometry={frontGeo} position={[0, 0, depth / 2]}>
        <primitive object={frontMat} attach="material" />
      </mesh>

      {/* Cara trasera (QR) — PlaneGeometry rotado 180° en Y: sin recorte circular */}
      <mesh geometry={backGeo} position={[0, 0, -depth / 2]} rotation={[0, Math.PI, 0]}>
        <primitive object={backMat} attach="material" />
      </mesh>

      {/* Borde acrílico */}
      <mesh geometry={rimGeo}>
        <primitive object={acrylicMat} attach="material" />
      </mesh>
    </group>
  )
}

function Scene({ frontImageUrl, backQrUrl }: DiscMeshProps) {
  const { gl } = useThree()
  useEffect(() => {
    gl.setPixelRatio(window.devicePixelRatio)
  }, [gl])

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[3, 3, 3]} intensity={1.5} color={0xffffff} />
      <pointLight position={[-3, -2, 2]} intensity={0.8} color={0x8b5cf6} />
      <pointLight position={[0, 3, -3]} intensity={0.6} color={0x06b6d4} />
      <DiscMesh frontImageUrl={frontImageUrl} backQrUrl={backQrUrl} />
      <OrbitControls enablePan={false} enableZoom={true} minDistance={1.5} maxDistance={5} />
    </>
  )
}

interface Props {
  frontImageUrl: string | null
  backQrUrl: string | null
}

export default function DiscRenderer({ frontImageUrl, backQrUrl }: Props) {
  return (
    <div className="w-full h-full min-h-[400px]">
      <Canvas
        camera={{ position: [0, 0.5, 3], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene frontImageUrl={frontImageUrl} backQrUrl={backQrUrl} />
      </Canvas>
    </div>
  )
}
