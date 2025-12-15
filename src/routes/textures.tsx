import { createFileRoute } from '@tanstack/react-router'
import { Canvas, useLoader, useFrame } from '@react-three/fiber'
import { Suspense, useRef, useState, useEffect } from 'react'
import {
  TextureLoader,
  RepeatWrapping,
  VideoTexture,
  DoubleSide,
  NearestFilter,
} from 'three'

export const Route = createFileRoute('/textures')({
  component: TexturesTopic,
})

/**
 * --------------------------------------------------------
 * 📚 TOPIC: TEXTURES
 * --------------------------------------------------------
 * Textures are images mapped to the surface of a geometry.
 *
 * Common Map Types:
 * - map: The basic color (albedo/diffuse).
 * - normalMap: Fakes bumps and dents by calculating light differently.
 * - roughnessMap: Defines which parts are shiny (black) vs matte (white).
 * - displacementMap: Physically moves vertices to create real depth.
 *
 * ⚠️ NOTE: We use <Suspense> because textures load asynchronously.
 */

// Asset URLs (Directly from Three.js examples so they work out-of-the-box)
const ASSETS = {
  crate:
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/crate.gif',
  stone:
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/brick_diffuse.jpg',
  stoneNormal:
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/brick_roughness.jpg', // Using roughness as normal for demo visually
  stoneBump:
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/brick_bump.jpg',
  uvGrid:
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/uv_grid_opengl.jpg',
  video:
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
}

// --------------------------------------------------------
// 1. BASIC COLOR MAP
// The simplest texture. Just wraps an image around the shape.
// --------------------------------------------------------
function BasicTextureExample(props: any) {
  // useLoader triggers Suspense while loading
  const texture = useLoader(TextureLoader, ASSETS.crate)

  return (
    <mesh {...props}>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      {/* 'map' is the property for the main color texture */}
      <meshStandardMaterial map={texture} />
    </mesh>
  )
}

// --------------------------------------------------------
// 2. NORMAL & ROUGHNESS MAP
// Adding detail without adding more triangles (geometry).
// --------------------------------------------------------
function DetailedTextureExample(props: any) {
  const [colorMap, bumpMap] = useLoader(TextureLoader, [
    ASSETS.stone,
    ASSETS.stoneBump,
  ])

  return (
    <mesh {...props}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial
        map={colorMap}
        bumpMap={bumpMap} // Creates the illusion of depth
        bumpScale={0.1} // How strong the effect is
      />
    </mesh>
  )
}

// --------------------------------------------------------
// 3. DISPLACEMENT MAP
// actually changing the shape of the mesh based on an image.
// ⚠️ Requires high vertex count (segments) in geometry!
// --------------------------------------------------------
function DisplacementExample(props: any) {
  const [colorMap, dispMap] = useLoader(TextureLoader, [
    ASSETS.stone,
    ASSETS.stoneBump,
  ])

  return (
    <mesh {...props} rotation={[-Math.PI / 2, 0, 0]}>
      {/* 128, 128 segments needed so the plane can bend */}
      <planeGeometry args={[2, 2, 128, 128]} />
      <meshStandardMaterial
        map={colorMap}
        displacementMap={dispMap} // Moves vertices up/down
        displacementScale={0.2} // Height of the displacement
        side={DoubleSide}
      />
    </mesh>
  )
}

// --------------------------------------------------------
// 4. REPEATING / TILING TEXTURE
// Making a small texture cover a large area.
// --------------------------------------------------------
function RepeatingTextureExample(props: any) {
  const texture = useLoader(TextureLoader, ASSETS.uvGrid)

  // Configure texture settings
  texture.wrapS = RepeatWrapping // Wrap horizontally
  texture.wrapT = RepeatWrapping // Wrap vertically
  texture.repeat.set(4, 4) // Repeat 4 times in each direction
  texture.minFilter = NearestFilter // Makes it look pixelated/retro (optional)
  texture.magFilter = NearestFilter

  return (
    <mesh {...props}>
      <cylinderGeometry args={[1, 1, 2, 32]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  )
}

// --------------------------------------------------------
// 5. VIDEO TEXTURE
// Playing a video on a mesh.
// --------------------------------------------------------
function VideoTextureExample(props: any) {
  const [videoTexture, setVideoTexture] = useState<VideoTexture | null>(null)

  useEffect(() => {
    // 1. Create the HTML Video Element
    const vid = document.createElement('video')
    vid.src = ASSETS.video
    vid.crossOrigin = 'Anonymous'
    vid.loop = true
    vid.muted = true // Browsers require mute for autoplay
    vid.play()

    // 2. Create Three.js VideoTexture
    const texture = new VideoTexture(vid)
    setVideoTexture(texture)

    // Cleanup when component unmounts
    return () => {
      vid.pause()
      vid.removeAttribute('src')
      vid.load()
    }
  }, [])

  return (
    <mesh {...props} rotation={[0, -0.5, 0]}>
      <planeGeometry args={[2.5, 1.5]} />
      {/* Only render material if texture is ready */}
      {videoTexture ? (
        <meshBasicMaterial
          map={videoTexture}
          side={DoubleSide}
          toneMapped={false}
        />
      ) : (
        <meshBasicMaterial color="black" />
      )}
    </mesh>
  )
}

// --------------------------------------------------------
// MAIN PAGE COMPONENT
// --------------------------------------------------------
function TexturesTopic() {
  const [active, setActive] = useState(0)

  const examples = [
    { title: 'Basic Color Map', Component: BasicTextureExample },
    { title: 'Bump/Normal Map', Component: DetailedTextureExample },
    { title: 'Displacement Map', Component: DisplacementExample },
    { title: 'Repeating/Tiling', Component: RepeatingTextureExample },
    { title: 'Video Texture', Component: VideoTextureExample },
  ]

  const ActiveComponent = examples[active].Component

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header & Controls */}
      <div
        style={{
          padding: '20px',
          borderBottom: '1px solid #ccc',
          background: '#f0f0f0',
        }}
      >
        <h1
          style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}
        >
          Textures
        </h1>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {examples.map((ex, index) => (
            <button
              key={index}
              onClick={() => setActive(index)}
              style={{
                padding: '8px 16px',
                background: active === index ? '#333' : '#ddd',
                color: active === index ? '#fff' : '#000',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              {ex.title}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Scene */}
      <div style={{ flex: 1, background: '#111' }}>
        <Canvas camera={{ position: [0, 0, 4] }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />

          {/* Suspense is REQUIRED for useLoader */}
          <Suspense fallback={<LoadingSpinner />}>
            <ActiveComponent />
          </Suspense>
        </Canvas>
      </div>
    </div>
  )
}

// Simple loading indicator for the 3D scene
function LoadingSpinner() {
  const mesh = useRef<any>(null)
  useFrame(() => {
    if (mesh.current) mesh.current.rotation.y += 0.1
  })
  return (
    <mesh ref={mesh}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="red" wireframe />
    </mesh>
  )
}
