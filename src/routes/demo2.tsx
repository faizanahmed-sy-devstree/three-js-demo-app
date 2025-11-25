import { createFileRoute } from '@tanstack/react-router'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  OrbitControls,
  PerspectiveCamera,
  OrthographicCamera,
  Environment,
} from '@react-three/drei'
import * as THREE from 'three'
import { useRef } from 'react'

export const Route = createFileRoute('/demo2')({
  component: ThreeJSFundamentals,
})

/* ------------------------------------------------------
   Simple rotating cube for scene demonstration
-------------------------------------------------------*/
function RotatingCube({ color }: { color: string }) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x += 0.01
      ref.current.rotation.y += 0.01
    }
  })

  return (
    <mesh ref={ref}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

/* ------------------------------------------------------
   Renderer Controls Example
-------------------------------------------------------*/
function RendererConfigurator() {
  // access renderer, camera, scene directly
  const { gl, scene } = useThree()

  // Set renderer config
  gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)) // limit for performance
  gl.outputColorSpace = THREE.SRGBColorSpace
  gl.toneMapping = THREE.ACESFilmicToneMapping
  gl.toneMappingExposure = 1

  // You can also modify the scene background here
  scene.background = new THREE.Color('#0f0f0f')

  return null
}

/* ------------------------------------------------------
   Scene, Camera, Renderer — Explained Practically
-------------------------------------------------------*/
function ThreeJSFundamentals() {
  return (
    <div className="w-full h-screen">
      <Canvas
        shadows
        camera={{
          position: [4, 4, 4],
          fov: 60,
          near: 0.1,
          far: 100,
        }}
      >
        {/* =====================================================
           RENDERER CONFIGURATION  
           (This replaces manual THREE.WebGLRenderer code)
        ====================================================== */}
        <RendererConfigurator />

        {/* =====================================================
           CAMERA SECTION  
        ====================================================== */}

        {/* 1️⃣ DEFAULT CAMERA (from Canvas props) */}
        <OrbitControls makeDefault enableDamping dampingFactor={0.05} />

        {/* 2️⃣ CUSTOM PERSPECTIVE CAMERA */}
        <PerspectiveCamera
          makeDefault={false}
          position={[6, 4, 6]}
          fov={50}
          near={0.1}
          far={200}
        />

        {/* 3️⃣ ORTHO CAMERA EXAMPLE (disabled for now) */}
        {/* 
        <OrthographicCamera
          makeDefault
          left={-2}
          right={2}
          top={2}
          bottom={-2}
          near={0.1}
          far={100}
          position={[5, 5, 5]}
          zoom={80}
        />
        */}

        {/* =====================================================
           SCENE SECTION  
           Three different scene setups in one Canvas
        ====================================================== */}

        {/* ---------------- Scene 1: Basic Lights ---------------- */}
        <group position={[0, 0, 0]}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
          <RotatingCube color="royalblue" />
        </group>

        {/* ---------------- Scene 2: Fog + Background ---------------- */}
        <group position={[3, 0, 0]}>
          <fog attach="fog" args={['#333333', 2, 10]} />
          <ambientLight intensity={0.2} />
          <pointLight position={[2, 2, 2]} intensity={2} />
          <RotatingCube color="lime" />
        </group>

        {/* ---------------- Scene 3: Environment Lighting ---------------- */}
        <group position={[-3, 0, 0]}>
          <Environment preset="sunset" />
          <ambientLight intensity={0.3} />
          <RotatingCube color="gold" />
        </group>
      </Canvas>
    </div>
  )
}
