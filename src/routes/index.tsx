import { Canvas, useFrame } from '@react-three/fiber'
import { createFileRoute } from '@tanstack/react-router'
import { useRef } from 'react'
import * as THREE from 'three'

// Creating a route for the "/" path and telling it to render the App component
export const Route = createFileRoute('/')({
  component: App,
})

function RotatingBox() {
  const ref = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x += 0.01
      ref.current.rotation.y += 0.01
    }
  })

  return (
    <mesh ref={ref}>
      {/* 
        mesh = a 3D object container.
        Think of it like a box that holds:
        - geometry (shape)
        - material (color, texture)
      */}
      {/*
          boxGeometry = defines the shape of the 3D object.
          Here, it's simply a cube.
        */}
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  )
}

function App() {
  return (
    <main className="h-dvh w-full">
      {/* // Canvas = the main 3D playground. // Anything inside Canvas becomes part
      of the 3D scene. */}
      <Canvas
        // gl = WebGL settings.
        // antialias: false → turns off smoothing for better performance.
        gl={{ antialias: false }}
        // dpr = Device Pixel Ratio.
        // It controls how sharp the 3D rendering should be.
        // [1, 1.5] → use 1 for normal screens, up to 1.5 for sharper displays
        dpr={[1, 1.5]}
      >
        <RotatingBox />
        {/* Ambient light = base brightness
          Without it, your objects will look too dark. */}
        <ambientLight intensity={0.5} />
        {/* 
          To give the object shape, depth, and realism
          To show where light is coming from
      */}
        <directionalLight position={[5, 5, 5]} intensity={1} />
      </Canvas>
    </main>
  )
}
