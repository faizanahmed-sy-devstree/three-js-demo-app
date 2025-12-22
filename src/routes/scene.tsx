import { Canvas, useLoader, useThree } from '@react-three/fiber'
import { createFileRoute } from '@tanstack/react-router'
import { Suspense, useEffect, useState } from 'react'
import { MeshBasicMaterial, TextureLoader } from 'three'

export const Route = createFileRoute('/scene')({
  component: SceneTopic,
})

/**
 * --------------------------------------------------------
 * 📚 TOPIC: SCENE
 * --------------------------------------------------------
 * The Scene is the root container of the 3D world.
 * Every object (Mesh, Light) must be added to the scene to be rendered.
 *
 * In R3F, <Canvas> creates the scene for you.
 *
 * Key Scene Properties:
 * 1. Background: Can be a solid Color, a Texture (image), or a CubeTexture (Skybox).
 * 2. Fog: Adds depth perception by fading distant objects to a specific color.
 * 3. OverrideMaterial: Forces every object in the scene to use the same material (good for debugging).
 * 4. Environment: Global lighting and reflection data.
 */

// --------------------------------------------------------
// HELPER: Some random objects to populate the scene
// --------------------------------------------------------
function RandomObjects() {
  return (
    <group>
      <mesh position={[-2, 0, -2]}>
        <sphereGeometry />
        <meshStandardMaterial color="red" />
      </mesh>
      <mesh position={[2, 0, -5]}>
        <boxGeometry />
        <meshStandardMaterial color="blue" />
      </mesh>
      <mesh position={[0, 0, -8]}>
        <coneGeometry />
        <meshStandardMaterial color="green" />
      </mesh>
      <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="gray" />
      </mesh>
    </group>
  )
}

// --------------------------------------------------------
// 1. SOLID BACKGROUND COLOR
// The simplest scene property.
// --------------------------------------------------------
function BackgroundColorExample() {
  return (
    <>
      {/* attach="background" assigns this color to scene.background */}
      <color attach="background" args={['#151515']} />
      <RandomObjects />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
    </>
  )
}

// --------------------------------------------------------
// 2. LINEAR FOG
// Objects fade out linearly between 'near' and 'far' distances.
// --------------------------------------------------------
function LinearFogExample() {
  return (
    <>
      <color attach="background" args={['#e0e0e0']} />

      {/* attach="fog" assigns this to scene.fog */}
      {/* args: [Color, Near Distance, Far Distance] */}
      <fog attach="fog" args={['#e0e0e0', 1, 15]} />

      <RandomObjects />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
    </>
  )
}

// --------------------------------------------------------
// 3. EXPONENTIAL FOG (FogExp2)
// A more realistic, dense fog that grows exponentially.
// --------------------------------------------------------
function ExponentialFogExample() {
  return (
    <>
      <color attach="background" args={['#101030']} />

      {/* args: [Color, Density] */}
      <fogExp2 attach="fog" args={['#101030', 0.15]} />

      <RandomObjects />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={2} />
    </>
  )
}

// --------------------------------------------------------
// 4. BACKGROUND TEXTURE (360 Image)
// Using an equirectangular image as the scene background.
// --------------------------------------------------------
function BackgroundTextureExample() {
  // Load a 360-degree panoramic image
  const texture = useLoader(
    TextureLoader,
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/2294472375_24a3b8ef46_o.jpg',
  )

  return (
    <>
      {/* Assign texture to scene.background */}
      <primitive attach="background" object={texture} />

      <RandomObjects />
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} />
    </>
  )
}

// --------------------------------------------------------
// 5. OVERRIDE MATERIAL (Debug Mode)
// Forces every single object to render with this specific material.
// Useful for performance testing or "Clay" renders.
// --------------------------------------------------------
function OverrideMaterialExample() {
  const { scene } = useThree()

  // Create a cheap Basic Material (wireframe)
  // We use useState to keep the reference stable
  const [debugMaterial] = useState(
    () => new MeshBasicMaterial({ color: 'lime', wireframe: true }),
  )

  useEffect(() => {
    // Apply override
    scene.overrideMaterial = debugMaterial

    // Cleanup: Remove override when component unmounts
    return () => {
      scene.overrideMaterial = null
    }
  }, [scene, debugMaterial])

  return (
    <>
      <color attach="background" args={['#000']} />
      <RandomObjects />
    </>
  )
}

// --------------------------------------------------------
// MAIN PAGE COMPONENT
// --------------------------------------------------------
function SceneTopic() {
  const [active, setActive] = useState(0)

  const examples = [
    { title: 'Solid Color', Component: BackgroundColorExample },
    { title: 'Linear Fog', Component: LinearFogExample },
    { title: 'Exponential Fog', Component: ExponentialFogExample },
    { title: 'Background Image', Component: BackgroundTextureExample },
    { title: 'Override Material (Debug)', Component: OverrideMaterialExample },
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
          The Scene
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
        <Canvas camera={{ position: [0, 2, 5] }}>
          <Suspense fallback={null}>
            <ActiveComponent />
          </Suspense>
        </Canvas>
      </div>
    </div>
  )
}
