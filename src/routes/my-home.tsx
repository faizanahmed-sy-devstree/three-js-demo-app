import { Text, useCursor } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { createFileRoute } from '@tanstack/react-router'
import { useRef, useState } from 'react'
import * as THREE from 'three'

export const Route = createFileRoute('/my-home')({
  component: HomeScene,
})

// =========================================================
// 1. DATA & CONFIG
// =========================================================

const VIEWS = {
  IDLE: { pos: new THREE.Vector3(0, 3, 9), lookAt: new THREE.Vector3(0, 0, 0) },
  // Zoom in close, but keep some distance so the object looks nice
  LAPTOP: {
    pos: new THREE.Vector3(-2, 2, 4),
    lookAt: new THREE.Vector3(-2, 0.5, 0),
  },
  ARCADE: {
    pos: new THREE.Vector3(2, 2, 3.5),
    lookAt: new THREE.Vector3(2, 1, 0),
  },
  ART: {
    pos: new THREE.Vector3(0, 2, 2),
    lookAt: new THREE.Vector3(0, 1.5, -3),
  },
}

type ViewState = 'IDLE' | 'LAPTOP' | 'ARCADE' | 'ART'

// =========================================================
// 2. CAMERA CONTROLLER
// =========================================================
function CameraHandler({ view }: { view: ViewState }) {
  const vec = new THREE.Vector3()

  useFrame((state) => {
    const target = VIEWS[view]
    // Smooth camera movement (lerp)
    state.camera.position.lerp(target.pos, 0.05)

    // Parallax Effect (Only when IDLE)
    if (view === 'IDLE') {
      state.camera.position.x +=
        (state.pointer.x * 0.5 - state.camera.position.x) * 0.05
      state.camera.position.y +=
        (3 + state.pointer.y * 0.2 - state.camera.position.y) * 0.05
    }

    // Smooth rotation
    const currentLook = new THREE.Vector3(0, 0, -1)
      .applyQuaternion(state.camera.quaternion)
      .add(state.camera.position)
    state.camera.lookAt(vec.lerpVectors(currentLook, target.lookAt, 0.05))
  })
  return null
}

// =========================================================
// 3. INTERACTIVE 3D ITEM (No HTML inside here anymore)
// =========================================================

function InteractiveItem({
  children,
  isActive,
  onActivate,
  label,
  position,
  rotation,
}: {
  children: React.ReactNode
  isActive: boolean
  onActivate: () => void
  label: string
  position?: [number, number, number]
  rotation?: [number, number, number]
}) {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  // Change cursor only if we are in IDLE mode
  useCursor(hovered && !isActive)

  useFrame((state) => {
    if (!groupRef.current) return
    // Idle float animation
    if (!isActive) {
      groupRef.current.position.y =
        (position?.[1] || 0) + Math.sin(state.clock.elapsedTime * 2) * 0.02
    }
  })

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      <group
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation()
          onActivate()
        }}
      >
        {children}
      </group>

      {/* 3D Label (Only visible when NOT active) */}
      {!isActive && (
        <Text
          position={[0, 1.5, 0]}
          fontSize={0.3}
          color="black"
          anchorX="center"
          anchorY="middle"
          fillOpacity={hovered ? 1 : 0}
        >
          {label}
        </Text>
      )}
    </group>
  )
}

// =========================================================
// 4. OBJECT GEOMETRIES
// =========================================================
function Laptop() {
  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.2, 0.1, 0.8]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh position={[0, 0.5, -0.4]} rotation={[-0.2, 0, 0]}>
        <boxGeometry args={[1.2, 0.8, 0.05]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[0, 0.5, -0.37]} rotation={[-0.2, 0, 0]}>
        <planeGeometry args={[1.1, 0.7]} />
        <meshBasicMaterial color="#00aaff" />
      </mesh>
    </group>
  )
}

function ArcadeMachine() {
  return (
    <group>
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[1, 2, 1]} />
        <meshStandardMaterial color="#D93025" />
      </mesh>
      <mesh position={[0, 1.4, 0.51]}>
        <planeGeometry args={[0.8, 0.6]} />
        <meshBasicMaterial color="#34A853" />
      </mesh>
      <mesh position={[0, 0.9, 0.6]}>
        <boxGeometry args={[1, 0.1, 0.4]} />
        <meshStandardMaterial color="#111" />
      </mesh>
    </group>
  )
}

function WallArt() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1.5, 2, 0.1]} />
        <meshStandardMaterial color="#F9AB00" />
      </mesh>
      <mesh position={[0, 0, 0.06]}>
        <planeGeometry args={[1.3, 1.8]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0, 0, 0.07]}>
        <circleGeometry args={[0.4, 32]} />
        <meshBasicMaterial color="#F9AB00" />
      </mesh>
    </group>
  )
}

// =========================================================
// 5. MAIN SCENE + 2D UI OVERLAY
// =========================================================

function HomeScene() {
  const [view, setView] = useState<ViewState>('IDLE')

  return (
    <div className="relative h-[calc(100dvh-65px)] w-full bg-slate-900">
      {/* --- THE 3D CANVAS --- */}
      <Canvas shadows camera={{ position: [0, 3, 9], fov: 45 }}>
        <CameraHandler view={view} />

        {/* Lights */}
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 5, 0]} intensity={5} color="#fff" />
        <spotLight
          position={[5, 5, 5]}
          angle={0.3}
          penumbra={1}
          intensity={10}
          castShadow
        />

        {/* Room */}
        <group position={[0, -1, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[50, 50]} />
            <meshStandardMaterial color="#e3dac9" />
          </mesh>
          <mesh position={[0, 5, -3]}>
            <planeGeometry args={[50, 15]} />
            <meshStandardMaterial color="#78909c" />
          </mesh>
        </group>

        {/* Objects */}
        <group position={[-3, -0.2, 0]} rotation={[0, 0.3, 0]}>
          <mesh>
            <cylinderGeometry args={[0.6, 0.6, 1.6, 32]} />
            <meshStandardMaterial color="white" />
          </mesh>
          <InteractiveItem
            label="WORK"
            isActive={view === 'LAPTOP'}
            onActivate={() => setView('LAPTOP')}
          >
            <Laptop />
          </InteractiveItem>
        </group>

        <InteractiveItem
          label="GAMES"
          position={[3, -1, -0.5]}
          rotation={[0, -0.3, 0]}
          isActive={view === 'ARCADE'}
          onActivate={() => setView('ARCADE')}
        >
          <ArcadeMachine />
        </InteractiveItem>

        <InteractiveItem
          label="PROFILE"
          position={[0, 1.5, -2.9]}
          isActive={view === 'ART'}
          onActivate={() => setView('ART')}
        >
          <WallArt />
        </InteractiveItem>
      </Canvas>

      {/* --- THE 2D UI OVERLAY (Fixes Clipping Issues) --- */}
      {view !== 'IDLE' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Card Container - pointer-events-auto enables clicking buttons */}
          <div className="w-[500px] bg-black/80 backdrop-blur-md border border-white/20 p-8 rounded-2xl text-white shadow-2xl pointer-events-auto animate-in fade-in zoom-in duration-300">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-blue-400">
                {view === 'LAPTOP' && 'Work Dashboard'}
                {view === 'ARCADE' && 'Arcade Zone'}
                {view === 'ART' && 'User Profile'}
              </h2>
              <button
                onClick={() => setView('IDLE')}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition-all"
              >
                CLOSE
              </button>
            </div>

            {/* Dynamic Content */}
            <div className="text-lg text-gray-300">
              {view === 'LAPTOP' && (
                <div className="space-y-4">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <p className="text-sm text-gray-400">New Emails</p>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                  <button className="w-full bg-blue-600 py-3 rounded-lg hover:bg-blue-500 font-bold">
                    Open Full Dashboard
                  </button>
                </div>
              )}

              {view === 'ARCADE' && (
                <div className="text-center space-y-4">
                  <div className="text-6xl">🕹️</div>
                  <p>Ready to test the Physics Engine?</p>
                  <button className="w-full bg-green-600 py-3 rounded-lg hover:bg-green-500 font-bold">
                    Start Game
                  </button>
                </div>
              )}

              {view === 'ART' && (
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-orange-500 flex items-center justify-center text-3xl font-bold">
                    DS
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">DevStree User</h3>
                    <p className="text-gray-400">Full Stack Developer</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
