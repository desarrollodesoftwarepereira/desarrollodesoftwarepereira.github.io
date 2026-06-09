import { useState, useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

export type HolderColor = 'transparent' | 'black' | 'white'

interface HolderMeshProps {
  frontImageUrl: string | null
  color: HolderColor
  backTextureUrl: string | null
}

function buildMaterial(color: HolderColor): THREE.Material {
  switch (color) {
    case 'black':
      return new THREE.MeshPhysicalMaterial({ color: 0x111111, roughness: 0.2, metalness: 0.1 })
    case 'white':
      return new THREE.MeshPhysicalMaterial({ color: 0xf0f0f0, roughness: 0.15, metalness: 0.05 })
    default:
      return new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.88,
        roughness: 0.05,
        metalness: 0,
        thickness: 0.15,
        transparent: true,
        opacity: 0.65,
        side: THREE.DoubleSide,
      })
  }
}

function HolderMesh({ frontImageUrl, color, backTextureUrl }: HolderMeshProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [frontTexture, setFrontTexture] = useState<THREE.Texture | null>(null)
  const [backTexture, setBackTexture] = useState<THREE.Texture | null>(null)

  useEffect(() => {
    if (!frontImageUrl) { setFrontTexture(null); return }
    const loader = new THREE.TextureLoader()
    loader.load(frontImageUrl, (tex) => { tex.needsUpdate = true; setFrontTexture(tex) })
  }, [frontImageUrl])

  useEffect(() => {
    if (!backTextureUrl) { setBackTexture(null); return }
    const loader = new THREE.TextureLoader()
    loader.load(backTextureUrl, (tex) => { tex.needsUpdate = true; setBackTexture(tex) })
  }, [backTextureUrl])

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.35
  })

  const sideMat = buildMaterial(color)
  const frontMat = frontTexture
    ? new THREE.MeshBasicMaterial({ map: frontTexture, transparent: true })
    : buildMaterial(color)
  const backMat = buildMaterial(color)

  return (
    <group ref={groupRef}>
      <mesh>
        <boxGeometry args={[1.4, 1.25, 0.12]} />
        <primitive object={sideMat} attach="material-0" />
        <primitive object={sideMat} attach="material-1" />
        <primitive object={sideMat} attach="material-2" />
        <primitive object={sideMat} attach="material-3" />
        <primitive object={frontMat} attach="material-4" />
        <primitive object={backMat} attach="material-5" />
      </mesh>
      {backTexture && (
        <mesh position={[0, 0, -0.061]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[1.4 * 0.6, 1.25 * 0.6]} />
          <meshBasicMaterial map={backTexture} transparent />
        </mesh>
      )}
    </group>
  )
}

function Scene({ frontImageUrl, color, backTextureUrl }: HolderMeshProps) {
  const { gl } = useThree()
  useEffect(() => { gl.setPixelRatio(window.devicePixelRatio) }, [gl])

  return (
    <>
      <ambientLight intensity={0.7} />
      <pointLight position={[3, 3, 3]} intensity={1.5} />
      <pointLight position={[-3, -2, 2]} intensity={0.8} color={0x8b5cf6} />
      <pointLight position={[0, 3, -3]} intensity={0.6} color={0x06b6d4} />
      <HolderMesh frontImageUrl={frontImageUrl} color={color} backTextureUrl={backTextureUrl} />
      <OrbitControls enablePan={false} enableZoom={true} minDistance={2} maxDistance={6} />
    </>
  )
}

interface Props {
  frontImageUrl: string | null
  color: HolderColor
}

export default function HolderRenderer({ frontImageUrl, color }: Props) {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene frontImageUrl={frontImageUrl} color={color} backTextureUrl="/assets/images/back-cd-holder.png" />
      </Canvas>
    </div>
  )
}
