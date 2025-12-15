import { createFileRoute } from '@tanstack/react-router'
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { Group, Mesh } from 'three'

export const Route = createFileRoute('/r3f-basics')({
  component: R3FBasicsTopic,
})

/**
 * --------------------------------------------------------
 * 📚 TOPIC: REACT THREE FIBER (R3F) BASICS
 * --------------------------------------------------------
 * R3F is a renderer. It takes standard Three.js objects and
 * treats them as React components.
 *
 *
 * 1. Components: <mesh> = new THREE.Mesh()
 * 2. Props: <mesh position={[1,2,3]} /> = mesh.position.set(1,2,3)
 * 3. Hooks: useFrame() replaces the standard requestAnimationFrame loop.
 * 4. Events: onClick={} works on 3D objects automatically (no raycaster setup needed!).
 */

// --------------------------------------------------------
// 1. REUSABLE COMPONENTS
// Just like standard React, we can make a custom component
// and reuse it multiple times with different props.
// --------------------------------------------------------
function CustomBox(props: any) {
  // We can pass standard React props (position, color) down to the mesh
  return (
    <mesh position={props.position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={props.color} />
    </mesh>
  )
}

function ComponentExample() {
  return (
    <group>
      <CustomBox position={[-2, 0, 0]} color="orange" />
      <CustomBox position={[0, 0, 0]} color="hotpink" />
      <CustomBox position={[2, 0, 0]} color="cyan" />
    </group>
  )
}

// --------------------------------------------------------
// 2. THE RENDER LOOP (useFrame)
// In vanilla Three.js, you have a recursive 'animate()' function.
// In R3F, you use the useFrame hook inside any component.
// --------------------------------------------------------
function Spinner(props: any) {
  const meshRef = useRef<Mesh>(null!)

  // This runs 60 times per second (or screen refresh rate)
  useFrame((state, delta) => {
    // state contains mouse pos, clock, camera, scene, etc.
    // delta is the time in seconds since the last frame
    meshRef.current.rotation.y += delta * 2
    meshRef.current.rotation.x += delta * 0.5
  })

  return (
    <mesh ref={meshRef} {...props}>
      <octahedronGeometry args={[1]} />
      <meshStandardMaterial color="#88ff00" wireframe />
    </mesh>
  )
}

// --------------------------------------------------------
// 3. STATE MANAGEMENT (useState)
// R3F components re-render when state changes, just like DOM components.
// --------------------------------------------------------
function StateExample(props: any) {
  const [size, setSize] = useState(1)

  return (
    <mesh
      {...props}
      scale={[size, size, size]}
      // Cycle size: 1 -> 1.5 -> 0.5 -> 1
      onClick={() => setSize((prev) => (prev >= 1.5 ? 0.5 : prev + 0.5))}
    >
      <sphereGeometry args={[0.8, 32, 32]} />
      <meshStandardMaterial color={size > 1 ? 'red' : 'blue'} />
    </mesh>
  )
}

// --------------------------------------------------------
// 4. SCENE GRAPH / GROUPS
// Demonstrating hierarchy. Rotating the Parent (Group) moves
// the Child (Mesh) because the child is inside it.
// --------------------------------------------------------
function HierarchyExample(props: any) {
  const groupRef = useRef<Group>(null!)

  useFrame((_, delta) => {
    // Rotate the whole group
    groupRef.current.rotation.z += delta
  })

  return (
    <group ref={groupRef} {...props}>
      {/* Center Pivot Point (invisible or small) */}
      <mesh>
        <sphereGeometry args={[0.2]} />
        <meshBasicMaterial color="white" />
      </mesh>

      {/* Child Object offset by 2 units */}
      {/* It will orbit the center because it's inside the rotating group */}
      <mesh position={[2, 0, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="yellow" />
      </mesh>
    </group>
  )
}

// --------------------------------------------------------
// 5. EVENTS (Built-in Raycaster)
// R3F handles raycasting for you. You get events like DOM elements.
// --------------------------------------------------------
function EventsExample(props: any) {
  const [hovered, setHover] = useState(false)

  return (
    <mesh
      {...props}
      onPointerOver={() => {
        setHover(true)
        document.body.style.cursor = 'pointer' // Change CSS cursor
      }}
      onPointerOut={() => {
        setHover(false)
        document.body.style.cursor = 'auto'
      }}
      onClick={() => alert('You clicked the 3D Object!')}
    >
      <torusKnotGeometry args={[0.6, 0.2, 100, 16]} />
      <meshStandardMaterial color={hovered ? 'white' : 'purple'} />
    </mesh>
  )
}

// --------------------------------------------------------
// MAIN PAGE COMPONENT
// --------------------------------------------------------
function R3FBasicsTopic() {
  const [active, setActive] = useState(0)

  const examples = [
    { title: 'Reusable Components', Component: ComponentExample },
    { title: 'The Loop (useFrame)', Component: Spinner },
    { title: 'React State', Component: StateExample },
    { title: 'Hierarchy (Groups)', Component: HierarchyExample },
    { title: 'Events (Click Me)', Component: EventsExample },
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
          React Three Fiber Basics
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
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />

          <ActiveComponent />
        </Canvas>
      </div>
    </div>
  )
}
