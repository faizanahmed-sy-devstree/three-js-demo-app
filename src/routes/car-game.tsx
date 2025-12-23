import { createFileRoute } from '@tanstack/react-router'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Physics, useBox, usePlane } from '@react-three/cannon'
import { useRef, useEffect, useState } from 'react'

export const Route = createFileRoute('/car-game')({
  component: CarGame,
})

// Game state
interface GameState {
  currentLap: number
  totalLaps: number
  currentTime: number
  bestLapTime: number | null
  lastLapTime: number | null
  checkpointsPassed: number[]
  raceStarted: boolean
  raceFinished: boolean
  countdown: number
  speed: number
}

/**
 * Keyboard controls
 */
function useKeyboard() {
  const [keys, setKeys] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    boost: false,
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
        boost: key === ' ' ? true : prev.boost,
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
        boost: key === ' ' ? false : prev.boost,
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
 * Racing car with game state integration
 */
function RacingCar({
  gameState,
  setGameState,
}: {
  gameState: GameState
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
}) {
  const [ref, api] = useBox(() => ({
    mass: 10,
    position: [0, 1, -30],
    args: [2, 0.8, 3],
    fixedRotation: false,
  }))

  const keys = useKeyboard()
  const carRotation = useRef(0)
  const carPosition = useRef<[number, number, number]>([0, 1, -30])
  const velocity = useRef({ x: 0, z: 0 })

  useEffect(() => {
    const unsubPos = api.position.subscribe((p) => {
      carPosition.current = p as [number, number, number]
    })
    return unsubPos
  }, [api])

  useFrame((_, delta) => {
    if (!gameState.raceStarted || gameState.raceFinished) return

    const { forward, backward, left, right, boost } = keys
    const [x, y, z] = carPosition.current

    // Keep car on ground level
    if (y < 0.8 || y > 1.2) {
      api.position.set(x, 1, z)
    }

    // Keep car upright
    api.rotation.set(0, carRotation.current, 0)

    // Movement speed with boost
    const baseSpeed = 15
    const boostMultiplier = boost ? 1.8 : 1
    const moveSpeed = baseSpeed * boostMultiplier
    const turnSpeed = 0.08

    let forceX = 0
    let forceZ = 0

    // Forward/Backward - apply forces instead of direct position
    if (forward) {
      forceX = Math.sin(carRotation.current) * moveSpeed
      forceZ = Math.cos(carRotation.current) * moveSpeed
    } else if (backward) {
      forceX = -Math.sin(carRotation.current) * moveSpeed * 0.6
      forceZ = -Math.cos(carRotation.current) * moveSpeed * 0.6
    }

    // Apply forces for movement
    if (forceX !== 0 || forceZ !== 0) {
      api.velocity.set(forceX, 0, forceZ)
    } else {
      // Apply friction when not moving
      api.velocity.set(0, 0, 0)
    }

    // Turning
    if (left && (forward || backward)) {
      carRotation.current += turnSpeed * (forward ? 1 : -1)
    }
    if (right && (forward || backward)) {
      carRotation.current -= turnSpeed * (forward ? 1 : -1)
    }

    // Calculate speed for display
    const speedMagnitude = Math.sqrt(forceX ** 2 + forceZ ** 2)
    const speedKmh = Math.round(speedMagnitude * 6)

    // Update game state speed
    setGameState((prev) => ({ ...prev, speed: speedKmh }))

    // Checkpoint detection
    checkCheckpoints(x, z, gameState, setGameState)

    // Apply rotation
    api.rotation.set(0, carRotation.current, 0)
    api.angularVelocity.set(0, 0, 0)
  })

  return (
    <mesh ref={ref as any} castShadow>
      <boxGeometry args={[2, 0.8, 3]} />
      <meshStandardMaterial
        color={keys.boost ? '#ff0000' : '#f59e0b'}
        roughness={0.3}
        metalness={0.8}
      />

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

      {/* Boost flames */}
      {keys.boost && (
        <>
          <mesh position={[-0.5, -0.2, -1.6]}>
            <coneGeometry args={[0.2, 0.8, 8]} />
            <meshStandardMaterial
              color="#ff6600"
              emissive="#ff6600"
              emissiveIntensity={3}
            />
          </mesh>
          <mesh position={[0.5, -0.2, -1.6]}>
            <coneGeometry args={[0.2, 0.8, 8]} />
            <meshStandardMaterial
              color="#ff6600"
              emissive="#ff6600"
              emissiveIntensity={3}
            />
          </mesh>
        </>
      )}
    </mesh>
  )
}

/**
 * Checkpoint detection
 */
function checkCheckpoints(
  x: number,
  z: number,
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
) {
  const checkpoints = [
    { id: 0, x: 0, z: -30, radius: 5 }, // Start/Finish
    { id: 1, x: 30, z: -20, radius: 5 },
    { id: 2, x: 30, z: 20, radius: 5 },
    { id: 3, x: -30, z: 20, radius: 5 },
    { id: 4, x: -30, z: -20, radius: 5 },
  ]

  checkpoints.forEach((checkpoint) => {
    const distance = Math.sqrt(
      (x - checkpoint.x) ** 2 + (z - checkpoint.z) ** 2,
    )

    if (distance < checkpoint.radius) {
      const expectedCheckpoint =
        gameState.checkpointsPassed.length % checkpoints.length

      if (
        checkpoint.id === expectedCheckpoint &&
        !gameState.checkpointsPassed.includes(
          checkpoint.id + gameState.currentLap * checkpoints.length,
        )
      ) {
        setGameState((prev) => {
          const newCheckpoints = [
            ...prev.checkpointsPassed,
            checkpoint.id + prev.currentLap * checkpoints.length,
          ]

          // Check if lap completed
          if (
            checkpoint.id === 0 &&
            prev.checkpointsPassed.length >= checkpoints.length - 1
          ) {
            const lapTime = prev.currentTime
            const newLap = prev.currentLap + 1
            const bestLap =
              prev.bestLapTime === null
                ? lapTime
                : Math.min(prev.bestLapTime, lapTime)

            if (newLap > prev.totalLaps) {
              return {
                ...prev,
                raceFinished: true,
                lastLapTime: lapTime,
                bestLapTime: bestLap,
              }
            }

            return {
              ...prev,
              currentLap: newLap,
              currentTime: 0,
              lastLapTime: lapTime,
              bestLapTime: bestLap,
              checkpointsPassed: [],
            }
          }

          return { ...prev, checkpointsPassed: newCheckpoints }
        })
      }
    }
  })
}

/**
 * Race track with checkpoints
 */
function RaceTrack() {
  const checkpoints = [
    { x: 0, z: -30, label: 'START/FINISH', color: '#10b981' },
    { x: 30, z: -20, label: 'CP1', color: '#3b82f6' },
    { x: 30, z: 20, label: 'CP2', color: '#3b82f6' },
    { x: -30, z: 20, label: 'CP3', color: '#3b82f6' },
    { x: -30, z: -20, label: 'CP4', color: '#3b82f6' },
  ]

  return (
    <>
      {/* Checkpoints with collision */}
      {checkpoints.map((cp, i) => (
        <group key={i} position={[cp.x, 0.1, cp.z]}>
          {/* Left pillar with physics */}
          <CheckpointPillar position={[-3, 2, 0]} color={cp.color} />
          {/* Right pillar with physics */}
          <CheckpointPillar position={[3, 2, 0]} color={cp.color} />

          {/* Checkpoint banner (visual only, no collision) */}
          <mesh position={[0, 3.5, 0]} rotation={[0, 0, 0]}>
            <boxGeometry args={[6, 0.8, 0.1]} />
            <meshStandardMaterial
              color={cp.color}
              emissive={cp.color}
              emissiveIntensity={0.3}
            />
          </mesh>
        </group>
      ))}

      {/* Track boundaries with physics */}
      <TrackWall position={[0, 1, -40]} args={[100, 2, 1]} />
      <TrackWall position={[0, 1, 40]} args={[100, 2, 1]} />
      <TrackWall position={[-40, 1, 0]} args={[1, 2, 100]} />
      <TrackWall position={[40, 1, 0]} args={[1, 2, 100]} />
    </>
  )
}

/**
 * Checkpoint pillar with collision
 */
function CheckpointPillar({
  position,
  color,
}: {
  position: [number, number, number]
  color: string
}) {
  const [ref] = useBox(() => ({
    mass: 0, // Static object
    position,
    args: [0.6, 4, 0.6], // Collision box for pillar
  }))

  return (
    <mesh ref={ref as any} position={position}>
      <cylinderGeometry args={[0.3, 0.3, 4, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
      />
    </mesh>
  )
}

/**
 * Track wall with collision
 */
function TrackWall({
  position,
  args,
}: {
  position: [number, number, number]
  args: [number, number, number]
}) {
  const [ref] = useBox(() => ({
    mass: 0, // Static object
    position,
    args,
  }))

  return (
    <mesh ref={ref as any} receiveShadow>
      <boxGeometry args={args} />
      <meshStandardMaterial color="#64748b" />
    </mesh>
  )
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
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <gridHelper
        args={[200, 100, '#334155', '#475569']}
        position={[0, 0.01, 0]}
      />
    </group>
  )
}

/**
 * Camera follows car
 */
function FollowCamera() {
  const { camera } = useThree()

  useFrame(() => {
    camera.position.x += (0 - 10 - camera.position.x) * 0.1
    camera.position.y += (1 + 8 - camera.position.y) * 0.1
    camera.position.z += (-30 - 10 - camera.position.z) * 0.1
    camera.lookAt(0, 1 + 1, -30)
  })

  return null
}

/**
 * Racing HUD
 */
function RacingHUD({
  gameState,
  onRestart,
}: {
  gameState: GameState
  onRestart: () => void
}) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    const ms = Math.floor((seconds % 1) * 100)
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`
  }

  if (gameState.countdown > 0) {
    return (
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '120px',
          fontWeight: '900',
          color: '#fff',
          textShadow: '0 0 30px rgba(0,0,0,0.8)',
          zIndex: 100,
        }}
      >
        {gameState.countdown === 4 ? 'READY' : gameState.countdown}
      </div>
    )
  }

  if (gameState.raceFinished) {
    return (
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background:
            'linear-gradient(135deg, rgba(0,0,0,0.95), rgba(20,20,20,0.95))',
          padding: '50px',
          borderRadius: '20px',
          textAlign: 'center',
          zIndex: 100,
          border: '3px solid #10b981',
        }}
      >
        <h1
          style={{ fontSize: '48px', margin: '0 0 30px 0', color: '#10b981' }}
        >
          🏁 RACE COMPLETE!
        </h1>
        <div style={{ fontSize: '24px', color: '#fff', marginBottom: '20px' }}>
          <div>
            Best Lap: <strong>{formatTime(gameState.bestLapTime || 0)}</strong>
          </div>
          <div>
            Last Lap: <strong>{formatTime(gameState.lastLapTime || 0)}</strong>
          </div>
        </div>
        <button
          onClick={onRestart}
          style={{
            padding: '15px 40px',
            fontSize: '20px',
            background: '#10b981',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: '700',
          }}
        >
          RESTART RACE
        </button>
      </div>
    )
  }

  return (
    <>
      {/* Top HUD */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '20px',
          zIndex: 10,
        }}
      >
        {/* Lap Counter */}
        <div
          style={{
            background:
              'linear-gradient(135deg, rgba(0,0,0,0.9), rgba(30,30,30,0.9))',
            padding: '15px 30px',
            borderRadius: '12px',
            border: '2px solid #10b981',
          }}
        >
          <div
            style={{ fontSize: '14px', color: '#10b981', marginBottom: '5px' }}
          >
            LAP
          </div>
          <div style={{ fontSize: '32px', fontWeight: '900', color: '#fff' }}>
            {gameState.currentLap}/{gameState.totalLaps}
          </div>
        </div>

        {/* Timer */}
        <div
          style={{
            background:
              'linear-gradient(135deg, rgba(0,0,0,0.9), rgba(30,30,30,0.9))',
            padding: '15px 30px',
            borderRadius: '12px',
            border: '2px solid #3b82f6',
          }}
        >
          <div
            style={{ fontSize: '14px', color: '#3b82f6', marginBottom: '5px' }}
          >
            TIME
          </div>
          <div
            style={{
              fontSize: '32px',
              fontWeight: '900',
              color: '#fff',
              fontFamily: 'monospace',
            }}
          >
            {formatTime(gameState.currentTime)}
          </div>
        </div>

        {/* Best Lap */}
        {gameState.bestLapTime !== null && (
          <div
            style={{
              background:
                'linear-gradient(135deg, rgba(0,0,0,0.9), rgba(30,30,30,0.9))',
              padding: '15px 30px',
              borderRadius: '12px',
              border: '2px solid #f59e0b',
            }}
          >
            <div
              style={{
                fontSize: '14px',
                color: '#f59e0b',
                marginBottom: '5px',
              }}
            >
              BEST
            </div>
            <div
              style={{
                fontSize: '32px',
                fontWeight: '900',
                color: '#fff',
                fontFamily: 'monospace',
              }}
            >
              {formatTime(gameState.bestLapTime)}
            </div>
          </div>
        )}
      </div>

      {/* Speedometer */}
      <div
        style={{
          position: 'absolute',
          bottom: 30,
          right: 30,
          background:
            'linear-gradient(135deg, rgba(0,0,0,0.9), rgba(30,30,30,0.9))',
          padding: '20px',
          borderRadius: '50%',
          width: '150px',
          height: '150px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: '4px solid #ef4444',
          zIndex: 10,
        }}
      >
        <div style={{ fontSize: '48px', fontWeight: '900', color: '#fff' }}>
          {gameState.speed}
        </div>
        <div style={{ fontSize: '16px', color: '#ef4444', fontWeight: '700' }}>
          KM/H
        </div>
      </div>

      {/* Controls hint */}
      <div
        style={{
          position: 'absolute',
          bottom: 30,
          left: 30,
          background: 'rgba(0,0,0,0.8)',
          padding: '15px 20px',
          borderRadius: '10px',
          fontSize: '14px',
          color: '#fff',
          zIndex: 10,
        }}
      >
        <div>
          <strong>W/↑</strong> Forward | <strong>S/↓</strong> Backward
        </div>
        <div>
          <strong>A/←</strong> Left | <strong>D/→</strong> Right
        </div>
        <div>
          <strong>SPACE</strong> 🔥 Boost
        </div>
      </div>
    </>
  )
}

/**
 * Main game component
 */
function CarGame() {
  const [gameState, setGameState] = useState<GameState>({
    currentLap: 1,
    totalLaps: 3,
    currentTime: 0,
    bestLapTime: null,
    lastLapTime: null,
    checkpointsPassed: [],
    raceStarted: false,
    raceFinished: false,
    countdown: 4,
    speed: 0,
  })

  // Countdown timer
  useEffect(() => {
    if (gameState.countdown > 0) {
      const timer = setTimeout(() => {
        setGameState((prev) => ({
          ...prev,
          countdown: prev.countdown - 1,
          raceStarted: prev.countdown === 1,
        }))
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [gameState.countdown])

  // Race timer
  useEffect(() => {
    if (gameState.raceStarted && !gameState.raceFinished) {
      const timer = setInterval(() => {
        setGameState((prev) => ({
          ...prev,
          currentTime: prev.currentTime + 0.01,
        }))
      }, 10)
      return () => clearInterval(timer)
    }
  }, [gameState.raceStarted, gameState.raceFinished])

  const handleRestart = () => {
    setGameState({
      currentLap: 1,
      totalLaps: 3,
      currentTime: 0,
      bestLapTime: null,
      lastLapTime: null,
      checkpointsPassed: [],
      raceStarted: false,
      raceFinished: false,
      countdown: 4,
      speed: 0,
    })
  }

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      background: '#0f172a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      padding: '20px',
    }}>
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        maxWidth: '1400px',
        maxHeight: '800px',
        background: 'linear-gradient(to bottom, #0f172a, #1e293b)',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      }}>
        <RacingHUD gameState={gameState} onRestart={handleRestart} />

        <Canvas shadows camera={{ position: [10, 10, 10], fov: 60 }}>
          <color attach="background" args={['#0f172a']} />
          <fog attach="fog" args={['#0f172a', 40, 120]} />

          <ambientLight intensity={0.4} />
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
          <pointLight position={[0, 10, 0]} intensity={0.5} color="#3b82f6" />

          <Physics gravity={[0, -30, 0]}>
            <RacingCar gameState={gameState} setGameState={setGameState} />
            <Ground />
            <RaceTrack />
          </Physics>

          <FollowCamera />
        </Canvas>
      </div>
    </div>
  )
}
