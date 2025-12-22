import { createFileRoute } from '@tanstack/react-router'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Physics, useBox, usePlane } from '@react-three/cannon'
import { useRef, useEffect, useState } from 'react'

export const Route = createFileRoute('/car-game')({
  component: CarGame,
})

/**
 * Keyboard controls
 */
function useKeyboard() {
  const [keys, setKeys] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
  })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      setKeys((prev) => ({
        ...prev,
        forward: key === 'w' || key === 'arrowup' ? true : prev.forward,
        backward: key === 's' || key === 'arrowdown' ? true : prev.backward,
        left: key === 'a' || key === 'arrowleft' ? true : prev.left,
        right: key === 'd' || key === 'arrowright' ? true : prev.right,
      }))
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      setKeys((prev) => ({
        ...prev,
        forward: key === 'w' || key === 'arrowup' ? false : prev.forward,
        backward: key === 's' || key === 'arrowdown' ? false : prev.backward,
        left: key === 'a' || key === 'arrowleft' ? false : prev.left,
        right: key === 'd' || key === 'arrowright' ? false : prev.right,
      }))
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  return keys
}

/**
 * Simple arcade-style car
 */
function ArcadeCar() {
  const [ref, api] = useBox(() => ({
    mass: 10,
    position: [0, 1, 0],
    args: [2, 0.8, 3],
    fixedRotation: false,
  }))

  const keys = useKeyboard()
  const carRotation = useRef(0)
  const carPosition = useRef<[number, number, number]>([0, 1, 0])

  useEffect(() => {
    const unsubPos = api.position.subscribe((p) => {
      carPosition.current = p as [number, number, number]
    })
    return unsubPos
  }, [api])

  useFrame(() => {
    const { forward, backward, left, right } = keys

    // Get current position
    const [x, y, z] = carPosition.current

    // FORCE car to stay on ground
    if (y !== 1) {
      api.position.set(x, 1, z)
    }

    // FORCE car to stay upright - no rotation on X or Z
    api.rotation.set(0, carRotation.current, 0)

    // Movement speed
    const moveSpeed = 0.3
    const turnSpeed = 0.08

    // Calculate new position based on rotation
    let newX = x
    let newZ = z

    // Forward/Backward - FIXED DIRECTIONS
    if (forward) {
      // W key - move FORWARD (positive direction)
      newX += Math.sin(carRotation.current) * moveSpeed
      newZ += Math.cos(carRotation.current) * moveSpeed
    }
    if (backward) {
      // S key - move BACKWARD (negative direction)
      newX -= Math.sin(carRotation.current) * moveSpeed * 0.6
      newZ -= Math.cos(carRotation.current) * moveSpeed * 0.6
    }

    // Turning
    if (left && (forward || backward)) {
      carRotation.current += turnSpeed * (forward ? 1 : -1)
    }
    if (right && (forward || backward)) {
      carRotation.current -= turnSpeed * (forward ? 1 : -1)
    }

    // Simple collision detection - keep car within bounds
    const maxDistance = 50
    if (Math.abs(newX) > maxDistance) {
      newX = x // Don't move if hitting boundary
    }
    if (Math.abs(newZ) > maxDistance) {
      newZ = z // Don't move if hitting boundary
    }

    // Apply new position
    api.position.set(newX, 1, newZ)
    api.rotation.set(0, carRotation.current, 0)

    // Force zero velocity to prevent physics interference
    api.velocity.set(0, 0, 0)
    api.angularVelocity.set(0, 0, 0)
  })

  return (
    <mesh ref={ref as any} castShadow>
      <boxGeometry args={[2, 0.8, 3]} />
      <meshStandardMaterial color="#f59e0b" roughness={0.3} metalness={0.8} />

      {/* Roof */}
      <mesh position={[0, 0.6, -0.2]} castShadow>
        <boxGeometry args={[1.8, 0.6, 1.6]} />
        <meshStandardMaterial color="#dc2626" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Wheels */}
      {[
        [-1, -0.5, 1],
        [1, -0.5, 1],
        [-1, -0.5, -1],
        [1, -0.5, -1],
      ].map((pos, i) => (
        <mesh
          key={i}
          position={pos as [number, number, number]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.35, 0.35, 0.3, 16]} />
          <meshStandardMaterial color="#1f2937" roughness={0.8} />
        </mesh>
      ))}

      {/* Headlights */}
      <mesh position={[-0.6, 0, 1.51]}>
        <boxGeometry args={[0.3, 0.2, 0.1]} />
        <meshStandardMaterial
          color="#fef08a"
          emissive="#fef08a"
          emissiveIntensity={2}
        />
      </mesh>
      <mesh position={[0.6, 0, 1.51]}>
        <boxGeometry args={[0.3, 0.2, 0.1]} />
        <meshStandardMaterial
          color="#fef08a"
          emissive="#fef08a"
          emissiveIntensity={2}
        />
      </mesh>
    </mesh>
  )
}

/**
 * Camera follows car
 */
function FollowCamera() {
  const { camera } = useThree()
  const carPos = useRef<[number, number, number]>([0, 1, 0])

  useFrame(() => {
    // Smooth camera follow
    const targetX = carPos.current[0] - 10
    const targetY = carPos.current[1] + 8
    const targetZ = carPos.current[2] - 10

    camera.position.x += (targetX - camera.position.x) * 0.1
    camera.position.y += (targetY - camera.position.y) * 0.1
    camera.position.z += (targetZ - camera.position.z) * 0.1

    camera.lookAt(carPos.current[0], carPos.current[1] + 1, carPos.current[2])
  })

  return null
}

/**
 * Ground
 */
function Ground() {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
  }))

  return (
    <group>
      <mesh ref={ref as any} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#22c55e" />
      </mesh>
      <gridHelper
        args={[200, 100, '#16a34a', '#4ade80']}
        position={[0, 0.01, 0]}
      />

      {/* Track markers */}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh key={i} position={[i * 5 - 50, 0.1, 20]} receiveShadow>
          <boxGeometry args={[0.5, 0.2, 2]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
      ))}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh key={`b${i}`} position={[i * 5 - 50, 0.1, -20]} receiveShadow>
          <boxGeometry args={[0.5, 0.2, 2]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
      ))}
    </group>
  )
}

/**
 * Obstacles
 */
function Obstacles() {
  // Cone positions
  const conePositions: [number, number][] = [
    [10, 5],
    [15, -8],
    [-12, 10],
    [-8, -5],
    [5, 12],
    [-15, -12],
  ]

  // Box positions
  const boxPositions: [number, number][] = [
    [20, 0],
    [-20, 5],
    [8, -15],
  ]

  return (
    <>
      {/* Cones with physics */}
      {conePositions.map((pos, i) => {
        const Cone = () => {
          const [ref] = useBox(() => ({
            mass: 0, // Static object
            position: [pos[0], 0.5, pos[1]],
            args: [1, 1, 1], // Collision box
          }))

          return (
            <mesh ref={ref as any} position={[pos[0], 0.5, pos[1]]} castShadow>
              <coneGeometry args={[0.5, 1, 8]} />
              <meshStandardMaterial color="#f97316" />
            </mesh>
          )
        }
        return <Cone key={i} />
      })}

      {/* Boxes with physics */}
      {boxPositions.map((pos, i) => {
        const Box = () => {
          const [ref] = useBox(() => ({
            mass: 0, // Static object
            position: [pos[0], 0.75, pos[1]],
            args: [1.5, 1.5, 1.5],
          }))

          return (
            <mesh ref={ref as any} castShadow receiveShadow>
              <boxGeometry args={[1.5, 1.5, 1.5]} />
              <meshStandardMaterial color="#8b5cf6" />
            </mesh>
          )
        }
        return <Box key={`box${i}`} />
      })}
    </>
  )
}

/**
 * Main game
 */
function CarGame() {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(to bottom, #0ea5e9, #38bdf8)',
      }}
    >
      {/* HUD */}
      <div
        style={{
          position: 'absolute',
          top: 30,
          left: 30,
          zIndex: 10,
          background:
            'linear-gradient(135deg, rgba(0,0,0,0.9), rgba(30,30,30,0.9))',
          color: 'white',
          padding: '25px 30px',
          borderRadius: '16px',
          fontFamily: "'Inter', system-ui, sans-serif",
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          border: '2px solid rgba(255,255,255,0.1)',
        }}
      >
        <h2
          style={{
            margin: '0 0 20px 0',
            fontSize: '28px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px',
          }}
        >
          🏎️ ARCADE RACER
        </h2>
        <div style={{ fontSize: '15px', lineHeight: '2', fontWeight: '500' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ opacity: 0.7, width: '100px' }}>Forward:</span>
            <kbd
              style={{
                background: '#f59e0b',
                padding: '4px 12px',
                borderRadius: '6px',
                fontWeight: '700',
                boxShadow: '0 2px 8px rgba(245,158,11,0.3)',
              }}
            >
              W / ↑
            </kbd>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ opacity: 0.7, width: '100px' }}>Backward:</span>
            <kbd
              style={{
                background: '#f59e0b',
                padding: '4px 12px',
                borderRadius: '6px',
                fontWeight: '700',
                boxShadow: '0 2px 8px rgba(245,158,11,0.3)',
              }}
            >
              S / ↓
            </kbd>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ opacity: 0.7, width: '100px' }}>Turn:</span>
            <kbd
              style={{
                background: '#f59e0b',
                padding: '4px 12px',
                borderRadius: '6px',
                fontWeight: '700',
                boxShadow: '0 2px 8px rgba(245,158,11,0.3)',
              }}
            >
              A / D
            </kbd>
          </div>
        </div>
        <div
          style={{
            marginTop: '20px',
            padding: '12px',
            background: 'rgba(245,158,11,0.1)',
            borderRadius: '8px',
            fontSize: '13px',
            color: '#fbbf24',
            border: '1px solid rgba(245,158,11,0.3)',
          }}
        >
          💡 Hold W and press A/D to turn!
        </div>
      </div>

      <Canvas shadows camera={{ position: [10, 10, 10], fov: 60 }}>
        <color attach="background" args={['#7dd3fc']} />
        <fog attach="fog" args={['#7dd3fc', 40, 120]} />

        <ambientLight intensity={0.7} />
        <directionalLight
          position={[30, 40, 20]}
          intensity={2}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-60}
          shadow-camera-right={60}
          shadow-camera-top={60}
          shadow-camera-bottom={-60}
        />
        <pointLight position={[0, 10, 0]} intensity={0.5} color="#fef08a" />

        <Physics gravity={[0, -30, 0]}>
          <ArcadeCar />
          <Ground />
          <Obstacles />
        </Physics>

        <FollowCamera />
      </Canvas>
    </div>
  )
}
