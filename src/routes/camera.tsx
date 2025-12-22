import { createFileRoute } from '@tanstack/react-router'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, OrthographicCamera } from '@react-three/drei'
import { useState, useRef } from 'react'
import { Vector3, MathUtils } from 'three'

export const Route = createFileRoute('/camera')({
  component: CameraTopic,
})

/**
 * --------------------------------------------------------
 * 📚 TOPIC: CAMERAS
 * --------------------------------------------------------
 * The Camera defines what is visible on the screen.
 *
 * 1. PerspectiveCamera: Simulates the human eye. Objects get smaller as they move away.
 * 2. OrthographicCamera: No distortion. Parallel lines remain parallel (Isometric).
 */

// --------------------------------------------------------
// HELPER: A "City" scene to visualize perspective better
// --------------------------------------------------------
function CityScene() {
  const boxes = []
  for (let x = -2; x <= 2; x++) {
    for (let z = -2; z <= 2; z++) {
      boxes.push(
        <mesh key={`${x}-${z}`} position={[x * 2, 0, z * 2]}>
          <boxGeometry args={[1, Math.random() * 3 + 1, 1]} />
          <meshStandardMaterial
            color={`hsl(${Math.random() * 360}, 50%, 50%)`}
          />
        </mesh>,
      )
    }
  }
  return (
    <group>
      {boxes}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 20, 10]} intensity={1} />
    </group>
  )
}

// --------------------------------------------------------
// 1. PERSPECTIVE CAMERA (Standard)
// Uses the Drei component <PerspectiveCamera> which supports makeDefault correctly
// --------------------------------------------------------
function PerspectiveExample() {
  return (
    <>
      <CityScene />
      <PerspectiveCamera
        makeDefault
        position={[5, 5, 10]}
        fov={60}
        onUpdate={(c) => c.lookAt(0, 0, 0)}
      />
    </>
  )
}

// --------------------------------------------------------
// 2. ORTHOGRAPHIC CAMERA (Isometric)
// --------------------------------------------------------
function OrthographicExample() {
  return (
    <>
      <CityScene />
      <OrthographicCamera
        makeDefault
        position={[20, 20, 20]}
        zoom={20}
        onUpdate={(c) => c.lookAt(0, 0, 0)}
      />
    </>
  )
}

// --------------------------------------------------------
// 3. ANIMATED FLYOVER
// --------------------------------------------------------
function FlyoverExample() {
  useFrame(({ camera, clock }) => {
    const t = clock.getElapsedTime() * 0.5
    camera.position.x = Math.sin(t) * 10
    camera.position.z = Math.cos(t) * 10
    camera.position.y = 5
    camera.lookAt(0, 0, 0)
  })

  return <CityScene />
}

// --------------------------------------------------------
// 4. DYNAMIC FOV (Zoom Effect)
// --------------------------------------------------------
function ZoomEffectExample() {
  useFrame(({ camera, clock }) => {
    const t = clock.getElapsedTime()
    const cam = camera as any
    // Changing FOV creates the "Dolly Zoom" or "Warp" effect
    cam.fov = 65 + Math.sin(t) * 35
    cam.updateProjectionMatrix()
    cam.lookAt(0, 0, 0)
  })

  return (
    <>
      <CityScene />
      <PerspectiveCamera makeDefault position={[0, 2, 8]} />
    </>
  )
}

// --------------------------------------------------------
// 5. TRACKING CAMERA
// --------------------------------------------------------
function TrackingExample() {
  const targetRef = useRef<any>(null!)

  useFrame(({ camera, clock }) => {
    const t = clock.getElapsedTime()
    if (targetRef.current) {
      // Move the ball
      targetRef.current.position.x = Math.sin(t * 2) * 4
      targetRef.current.position.z = Math.cos(t * 2) * 4
      // Look at ball
      camera.lookAt(targetRef.current.position)
    }
  })

  return (
    <>
      <CityScene />
      <mesh ref={targetRef} position={[0, 2, 0]}>
        <sphereGeometry />
        <meshBasicMaterial color="white" />
      </mesh>
      <PerspectiveCamera makeDefault position={[0, 10, 0]} />
    </>
  )
}

// --------------------------------------------------------
// MAIN PAGE COMPONENT
// --------------------------------------------------------
function CameraTopic() {
  const [active, setActive] = useState(0)

  const examples = [
    { title: 'Perspective', Component: PerspectiveExample },
    { title: 'Orthographic', Component: OrthographicExample },
    { title: 'Flyover', Component: FlyoverExample },
    { title: 'Dynamic FOV', Component: ZoomEffectExample },
    { title: 'Tracking', Component: TrackingExample },
  ]

  const ActiveComponent = examples[active].Component

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
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
          Camera & Views
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

      <div style={{ flex: 1, background: '#111' }}>
        <Canvas>
          <ActiveComponent />
        </Canvas>
      </div>
    </div>
  )
}
