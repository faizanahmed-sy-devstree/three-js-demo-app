import { OrbitControls } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { createFileRoute } from '@tanstack/react-router'
import { useRef, useState } from 'react'
import * as THREE from 'three'

export const Route = createFileRoute('/topic-6')({
  component: RouteComponent,
})

// ==========================================
// 1. FLAT & FAST (Basic Material)
// ==========================================
function BasicShape() {
  const ref = useRef<THREE.Mesh>(null)

  // Simple rotation animation
  useFrame((state, delta) => (ref.current!.rotation.y += delta))

  return (
    <mesh ref={ref} position={[-2, 0, 0]}>
      {/* 
        GEOMETRY: BoxGeometry
        args: [width, height, depth] 
      */}
      <boxGeometry args={[1, 1, 1]} />

      {/* 
        MATERIAL: MeshBasicMaterial
        - Does NOT react to light. 
        - It always looks fully lit (flat).
        - Good for performance or UI elements.
        - 'wireframe' shows the skeleton of the shape.
      */}
      <meshBasicMaterial color="orange" wireframe={true} />
    </mesh>
  )
}

// ==========================================
// 2. REALISTIC (Standard Material)
// ==========================================
function StandardShape() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state, delta) => (ref.current!.rotation.x += delta))

  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      {/* 
        GEOMETRY: SphereGeometry
        args: [radius, widthSegments, heightSegments]
        - Segments control smoothness. Try changing 32 to 4 to see the difference!
      */}
      <sphereGeometry args={[1.2, 8, 32]} />

      {/* 
        MATERIAL: MeshStandardMaterial
        - The industry standard for 3D.
        - Reacts to light (needs a light source!).
        - 'metalness': 0 (plastic) to 1 (metal).
        - 'roughness': 0 (mirror) to 1 (chalk).
      */}
      <meshStandardMaterial color="#7a2c91" roughness={0.2} metalness={0.8} />
    </mesh>
  )
}

// ==========================================
// 3. DEBUGGING (Normal Material)
// ==========================================
function NormalShape() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state, delta) => {
    ref.current!.rotation.x += delta
    ref.current!.rotation.y += delta
  })

  return (
    <mesh ref={ref} position={[2, 0, 0]}>
      {/* 
        GEOMETRY: ConeGeometry
        args: [radius, height, radialSegments]
      */}
      <coneGeometry args={[0.6, 1.2, 16]} />

      {/* 
        MATERIAL: MeshNormalMaterial
        - Colors the surface based on which direction it is facing.
        - Useful for debugging (checking if a face is inside out).
        - Does not need lights.
      */}
      <meshNormalMaterial />
    </mesh>
  )
}

// ==========================================
// 4. GLASSY / ADVANCED (Physical Material)
// ==========================================
function GlassyShape() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state, delta) => (ref.current!.rotation.y -= delta * 0.5))

  return (
    <mesh ref={ref} position={[0, 2, 0]}>
      {/* 
        GEOMETRY: TorusKnotGeometry
        - A complex knot shape.
        args: [radius, tube, tubularSegments, radialSegments]
      */}
      <torusKnotGeometry args={[0.4, 0.15, 100, 16]} />

      {/* 
        MATERIAL: MeshPhysicalMaterial
        - An extension of StandardMaterial.
        - Adds advanced features like 'transmission' (glass), 'clearcoat' (car paint).
        - transparent={true} is required for transmission.
      */}
      <meshPhysicalMaterial
        color="cyan"
        roughness={0}
        transmission={1} // 1 = fully glass-like
        thickness={1} // Refraction thickness
        transparent
      />
    </mesh>
  )
}

function RouteComponent() {
  return (
    <div className="h-[calc(100dvh-65px)] w-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        // Turning on shadows
        shadows
      >
        <OrbitControls makeDefault />
        {/* 
          LIGHTING 
          Materials like 'Standard' and 'Physical' will be black without light.
        */}
        {/* Ambient Light: Soft global illumination (no shadows) */}
        <ambientLight intensity={0.5} />
        {/* Directional Light: Like the sun (creates shadows/highlights) */}
        <directionalLight position={[5, 5, 5]} intensity={2} />
        {/* Point Light: A light bulb near the glass object to make it sparkle */}
        <pointLight position={[0, 3, 2]} intensity={5} color="white" />
        {/* --- Render our 4 Examples --- */}
        <BasicShape /> {/* Left: Wireframe box */}
        <StandardShape /> {/* Center: Shiny Purple Sphere */}
        <NormalShape /> {/* Right: Rainbow Cone */}
        <GlassyShape /> {/* Top: Glassy Knot */}
        {/* Grid helper to see the floor plane */}
        <gridHelper args={[10, 10]} position={[0, -1, 0]} />
      </Canvas>
    </div>
  )
}
