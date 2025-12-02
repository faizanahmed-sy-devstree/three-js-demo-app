import { Text, useCursor } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useRef, useState } from 'react'
import * as THREE from 'three'

export const Route = createFileRoute('/my-home')({
  component: HomeScene,
})

// =========================================================
// 1. REUSABLE INTERACTIVE COMPONENT
// =========================================================
// This wrapper handles the hover effects and click actions
// for any object we put inside it.
function InteractiveItem({
  children,
  onClick,
  label,
  position,
  rotation,
}: {
  children: React.ReactNode
  onClick: () => void
  label: string
  position?: [number, number, number]
  rotation?: [number, number, number]
}) {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  // Change mouse cursor to pointer when hovering
  useCursor(hovered)

  useFrame((state, delta) => {
    if (!groupRef.current) return

    // ANIMATION: Smoothly scale up when hovered
    const targetScale = hovered ? 1.15 : 1
    // Lerp (Linear Interpolation) for smooth transition
    groupRef.current.scale.x = THREE.MathUtils.lerp(
      groupRef.current.scale.x,
      targetScale,
      0.1,
    )
    groupRef.current.scale.y = THREE.MathUtils.lerp(
      groupRef.current.scale.y,
      targetScale,
      0.1,
    )
    groupRef.current.scale.z = THREE.MathUtils.lerp(
      groupRef.current.scale.z,
      targetScale,
      0.1,
    )

    // ANIMATION: Floating label effect
    if (hovered) {
      groupRef.current.position.y +=
        Math.sin(state.clock.elapsedTime * 5) * 0.002
    }
  })

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={onClick}
    >
      {children}

      {/* 3D Label that appears above the item */}
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.3}
        color="black"
        anchorX="center"
        anchorY="middle"
        fillOpacity={hovered ? 1 : 0} // Hide when not hovering
      >
        {label}
      </Text>
    </group>
  )
}

// =========================================================
// 2. THE OBJECTS (Geometry Construction)
// =========================================================

function Laptop() {
  return (
    <group>
      {/* Base */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.2, 0.1, 0.8]} />
        <meshStandardMaterial color="#444" />
      </mesh>
      {/* Screen */}
      <mesh position={[0, 0.5, -0.4]} rotation={[-0.2, 0, 0]}>
        <boxGeometry args={[1.2, 0.8, 0.05]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      {/* Screen Display (Blue Light) */}
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
      {/* Cabinet Body */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[1, 2, 1]} />
        <meshStandardMaterial color="#ff2a2a" />
      </mesh>
      {/* Screen */}
      <mesh position={[0, 1.4, 0.51]}>
        <planeGeometry args={[0.8, 0.6]} />
        <meshBasicMaterial color="lime" />
      </mesh>
      {/* Controls */}
      <mesh position={[0, 0.9, 0.6]}>
        <boxGeometry args={[1, 0.1, 0.4]} />
        <meshStandardMaterial color="#333" />
      </mesh>
    </group>
  )
}

function WallArt() {
  return (
    <group>
      {/* Frame */}
      <mesh>
        <boxGeometry args={[1.5, 2, 0.1]} />
        <meshStandardMaterial color="#d4af37" />
      </mesh>
      {/* Canvas */}
      <mesh position={[0, 0, 0.06]}>
        <planeGeometry args={[1.3, 1.8]} />
        <meshStandardMaterial color="white" />
      </mesh>
      {/* Simple Abstract Art */}
      <mesh position={[0, 0, 0.07]}>
        <circleGeometry args={[0.4, 32]} />
        <meshBasicMaterial color="orange" />
      </mesh>
    </group>
  )
}

// =========================================================
// 3. CAMERA RIG (The Parallax Effect)
// =========================================================
function CameraRig() {
  useFrame((state) => {
    // Read mouse position (-1 to 1)
    const x = state.pointer.x
    const y = state.pointer.y

    // Move camera slightly opposite to mouse to create depth
    // state.camera.position.lerp helps smooth the movement
    const targetX = x * 1 // Move 1 unit left/right
    const targetY = 2 + y * 0.5 // Move up/down around height of 2

    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      targetX,
      0.05,
    )
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      targetY,
      0.05,
    )

    // Always look at the center of the room
    state.camera.lookAt(0, 1, 0)
  })
  return null
}

// =========================================================
// 4. MAIN SCENE
// =========================================================

function HomeScene() {
  const navigate = useNavigate()

  return (
    <div className="h-[calc(100dvh-65px)] w-full bg-slate-900">
      <Canvas shadows camera={{ position: [0, 2, 6], fov: 45 }}>
        {/* -- Lighting -- */}
        <ambientLight intensity={0.4} />
        {/* Warm lamp light */}
        <pointLight
          position={[2, 3, 2]}
          intensity={5}
          color="#ffaa00"
          distance={10}
        />
        {/* Window light */}
        <directionalLight position={[-5, 5, 5]} intensity={1} color="#b0dfff" />

        {/* -- Room Geometry -- */}
        <group position={[0, -1, 0]}>
          {/* Floor */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color="#e3dac9" />
          </mesh>
          {/* Back Wall */}
          <mesh position={[0, 5, -3]} receiveShadow>
            <planeGeometry args={[20, 10]} />
            <meshStandardMaterial color="#8899a6" />
          </mesh>
        </group>

        {/* -- Interactive Items -- */}

        {/* 1. TABLE & LAPTOP (Work Feature) */}
        <group position={[-2, -0.2, 0]} rotation={[0, 0.5, 0]}>
          {/* Table Leg */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.6, 0.6, 1.6, 32]} />
            <meshStandardMaterial color="white" />
          </mesh>
          {/* Laptop Object */}
          <InteractiveItem
            label="DASHBOARD"
            position={[0, 0.85, 0]}
            onClick={() => alert('Navigating to /dashboard ...')} // Replace with navigate({ to: '/...' })
          >
            <Laptop />
          </InteractiveItem>
        </group>

        {/* 2. ARCADE (Games Feature) */}
        <InteractiveItem
          label="PLAYGROUND"
          position={[2, -1, -1]}
          rotation={[0, -0.5, 0]}
          onClick={() => alert('Navigating to /physics ...')} // Replace with navigate({ to: '/physics' })
        >
          <ArcadeMachine />
        </InteractiveItem>

        {/* 3. WALL ART (Profile Feature) */}
        <InteractiveItem
          label="PROFILE"
          position={[0, 1.5, -2.9]}
          onClick={() => alert('Navigating to /profile ...')}
        >
          <WallArt />
        </InteractiveItem>

        {/* -- Logic -- */}
        <CameraRig />
      </Canvas>
    </div>
  )
}
