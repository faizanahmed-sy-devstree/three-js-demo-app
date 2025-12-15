import { createFileRoute } from '@tanstack/react-router'
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { Mesh } from 'three'

export const Route = createFileRoute('/mesh')({
  component: MeshTopic,
})

/**
 * --------------------------------------------------------
 * 📚 TOPIC: MESH
 * --------------------------------------------------------
 * In Three.js and R3F, a Mesh is the most basic 3D object.
 * It acts as a container that holds two things:
 *
 * 1. Geometry (The Shape): e.g., Box, Sphere, Torus.
 * 2. Material (The Look): e.g., Color, Shininess, Texture.
 *
 * Think of it like a human body:
 * - Geometry = Skeleton
 * - Material = Skin
 * - Mesh = The combination of both
 */

// --------------------------------------------------------
// 1. THE BASIC MESH
// The "Hello World" of 3D. A simple box with a color.
// --------------------------------------------------------
function BasicMesh(props: any) {
  return (
    <mesh {...props}>
      {/* 1. Geometry: Defines the shape (width, height, depth) */}
      <boxGeometry args={[1, 1, 1]} />
      {/* 2. Material: Defines how light reacts to it */}
      <meshStandardMaterial color="orange" />
    </mesh>
  )
}

// --------------------------------------------------------
// 2. TRANSFORMATIONS (Position, Rotate, Scale)
// Demonstrating how to move objects in 3D space.
// --------------------------------------------------------
function TransformedMesh(props: any) {
  return (
    <mesh
      {...props}
      rotation={[0, 0, Math.PI / 4]} // Rotate 45 degrees on Z-axis
      scale={[1.5, 0.5, 1]} // Stretch X, Squish Y, Normal Z
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="cyan" />
    </mesh>
  )
}

// --------------------------------------------------------
// 3. MATERIAL PROPS
// Demonstrating roughness and metalness (PBR materials).
// --------------------------------------------------------
function ShinyMesh(props: any) {
  return (
    <mesh {...props}>
      {/* Icosahedron is a sphere-like shape made of triangles */}
      <icosahedronGeometry args={[0.7, 0]} />
      <meshStandardMaterial
        color="#7700ff"
        roughness={0} // 0 = Polish mirror, 1 = Matte brick
        metalness={0.8} // 0 = Plastic, 1 = Metal
      />
    </mesh>
  )
}

// --------------------------------------------------------
// 4. INTERACTIVE MESH (Events)
// Changing state when hovering or clicking.
// --------------------------------------------------------
function InteractiveMesh(props: any) {
  // Store state for hover and click
  const [hovered, setHover] = useState<boolean>(false)
  const [active, setActive] = useState<boolean>(false)

  return (
    <mesh
      {...props}
      scale={active ? 1.2 : 1} // Get bigger when clicked
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <coneGeometry args={[0.5, 1, 32]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'lime'} />
    </mesh>
  )
}

// --------------------------------------------------------
// 5. ANIMATED MESH (useFrame)
// Using the reference to directly rotate the object every frame.
// --------------------------------------------------------
function AnimatedMesh(props: any) {
  // We use the Mesh type from 'three' so TypeScript knows what .rotation is
  const meshRef = useRef<Mesh>(null!)

  // useFrame runs 60 times per second
  useFrame((_state, delta) => {
    if (meshRef.current) {
      // Rotate x and y axis slightly every frame
      meshRef.current.rotation.x += delta
      meshRef.current.rotation.y += delta * 0.5
    }
  })

  return (
    <mesh ref={meshRef} {...props}>
      <torusKnotGeometry args={[0.4, 0.15, 100, 16]} />
      <meshNormalMaterial />
      {/* meshNormalMaterial colors the mesh based on direction (good for debugging) */}
    </mesh>
  )
}

// --------------------------------------------------------
// MAIN PAGE COMPONENT
// --------------------------------------------------------
function MeshTopic() {
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Text Section */}
      <div style={{ padding: '20px', borderBottom: '1px solid #ccc' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>
          Mesh & Geometry
        </h1>
        <p>
          Below are 5 examples of Meshes inside a React Three Fiber Canvas. Try
          hovering over the lime cone!
        </p>
      </div>

      {/* 3D Scene Section */}
      <div style={{ flex: 1, background: '#111' }}>
        <Canvas>
          {/* Lights allow us to see the StandardMaterials */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />

          {/* Positioning the 5 examples in a grid */}
          <BasicMesh position={[-3, 0, 0]} />
          <TransformedMesh position={[-1.5, 0, 0]} />
          <ShinyMesh position={[0, 0, 0]} />
          <InteractiveMesh position={[1.5, 0, 0]} />
          <AnimatedMesh position={[3, 0, 0]} />
        </Canvas>
      </div>
    </div>
  )
}
