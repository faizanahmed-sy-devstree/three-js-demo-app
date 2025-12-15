import { createFileRoute } from '@tanstack/react-router'
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { Mesh, Group } from 'three'

export const Route = createFileRoute('/lighting')({
  component: LightingTopic,
})

/**
 * --------------------------------------------------------
 * 📚 TOPIC: LIGHTING
 * --------------------------------------------------------
 * Lighting is essential for 3D realism. Without it, you only see silhouettes.
 *
 * Key Concepts:
 * 1. AmbientLight: Base brightness (no shadows).
 * 2. DirectionalLight: Sunlight (parallel rays, casts shadows).
 * 3. PointLight: Lightbulb (radiates in all directions).
 * 4. SpotLight: Flashlight (cone of light).
 * 5. HemisphereLight: Sky vs Ground color gradient.
 *
 * 💡 Pro Tip: Materials like <meshStandardMaterial> need light.
 * <meshBasicMaterial> does not.
 */

// --------------------------------------------------------
// HELPER: A floor to catch shadows
// --------------------------------------------------------
function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial color="#333" />
    </mesh>
  )
}

// --------------------------------------------------------
// 1. AMBIENT LIGHT
// Global illumination. Doesn't cast shadows.
// --------------------------------------------------------
function AmbientExample(props: any) {
  return (
    <group {...props}>
      {/* Illuminates everything equally */}
      <ambientLight intensity={1.5} />

      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="orange" />
      </mesh>
      <Floor />
    </group>
  )
}

// --------------------------------------------------------
// 2. DIRECTIONAL LIGHT (The Sun)
// Rays come from far away in parallel. Good for outdoor scenes.
// --------------------------------------------------------
function DirectionalExample(props: any) {
  return (
    <group {...props}>
      <ambientLight intensity={0.2} />

      {/* Position determines direction. castShadow enables shadows. */}
      <directionalLight position={[2, 5, 2]} intensity={2} castShadow />

      <mesh castShadow position={[0, 0.5, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="cyan" />
      </mesh>
      <Floor />
    </group>
  )
}

// --------------------------------------------------------
// 3. POINT LIGHT (The Lightbulb)
// Light emits from a single point in all directions.
// --------------------------------------------------------
function PointLightExample(props: any) {
  return (
    <group {...props}>
      <ambientLight intensity={0.1} />

      {/* A Red light hovering above the sphere */}
      <pointLight
        position={[0, 2, 0]}
        intensity={10}
        color="red"
        distance={5} // Light fades out after 5 units
        decay={2}
        castShadow
      />

      {/* Visual helper to see where the light is */}
      <mesh position={[0, 2, 0]}>
        <sphereGeometry args={[0.1]} />
        <meshBasicMaterial color="red" />
      </mesh>

      <mesh castShadow position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color="white" roughness={0.1} />
      </mesh>
      <Floor />
    </group>
  )
}

// --------------------------------------------------------
// 4. SPOT LIGHT (The Flashlight)
// A cone of light. Good for street lamps or character focus.
// --------------------------------------------------------
function SpotLightExample(props: any) {
  return (
    <group {...props}>
      <ambientLight intensity={0.1} />

      <spotLight
        position={[0, 3, 0]}
        angle={0.3} // Width of the beam
        penumbra={0.5} // Softness of the edge (0=sharp, 1=blurry)
        intensity={20}
        castShadow
        color="lime"
      />

      <mesh castShadow position={[0, 0.5, 0]}>
        <torusKnotGeometry args={[0.4, 0.15, 100, 16]} />
        <meshStandardMaterial color="gray" />
      </mesh>
      <Floor />
    </group>
  )
}

// --------------------------------------------------------
// 5. ANIMATED LIGHTING
// Moving a light source to see real-time shadow updates.
// --------------------------------------------------------
function AnimatedLightExample(props: any) {
  const lightRef = useRef<Group>(null!)

  useFrame(({ clock }) => {
    if (lightRef.current) {
      const t = clock.getElapsedTime()
      // Move light in a circle
      lightRef.current.position.x = Math.sin(t) * 2
      lightRef.current.position.z = Math.cos(t) * 2
    }
  })

  return (
    <group {...props}>
      <ambientLight intensity={0.1} />

      {/* This group holds the light and moves */}
      <group ref={lightRef} position={[0, 2, 0]}>
        <pointLight intensity={20} color="hotpink" castShadow />
        <mesh>
          <sphereGeometry args={[0.1]} />
          <meshBasicMaterial color="hotpink" />
        </mesh>
      </group>

      <mesh castShadow position={[0, 0.5, 0]}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <Floor />
    </group>
  )
}

// --------------------------------------------------------
// MAIN PAGE COMPONENT
// --------------------------------------------------------
function LightingTopic() {
  const [active, setActive] = useState(0)

  // Array of components to toggle between
  const examples = [
    { title: 'Ambient Light (Flat)', Component: AmbientExample },
    { title: 'Directional Light (Sun)', Component: DirectionalExample },
    { title: 'Point Light (Bulb)', Component: PointLightExample },
    { title: 'Spot Light (Flashlight)', Component: SpotLightExample },
    { title: 'Animated Light', Component: AnimatedLightExample },
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
          Lighting & Shadows
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
        {/* 'shadows' prop enables the internal shadow map in Three.js */}
        <Canvas shadows camera={{ position: [0, 2, 5], fov: 50 }}>
          <ActiveComponent />
        </Canvas>
      </div>
    </div>
  )
}
