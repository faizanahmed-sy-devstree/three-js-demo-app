import { createFileRoute } from '@tanstack/react-router'
import { Canvas, useFrame } from '@react-three/fiber'
import type { ThreeEvent } from '@react-three/fiber' // Fixed: Type-only import
import { useState, useRef } from 'react'
import * as THREE from 'three'

export const Route = createFileRoute('/raycasting')({
  component: RaycastingTopic,
})

/**
 * --------------------------------------------------------
 * 📚 TOPIC: RAYCASTING
 * --------------------------------------------------------
 * Raycasting is the process of shooting an invisible line (ray)
 * from a point (usually the camera/mouse) into the 3D scene
 * to see what objects it intersects.
 */

// --------------------------------------------------------
// 1. BASIC INTERACTION (The R3F Way)
// --------------------------------------------------------
function HoverBox(props: any) {
  const [hovered, setHover] = useState(false)

  return (
    <mesh
      {...props}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      scale={hovered ? 1.2 : 1}
    >
      <boxGeometry />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

// --------------------------------------------------------
// 2. HIT DATA (Precise Targeting)
// --------------------------------------------------------
function PreciseSphere() {
  const [hitPoint, setHitPoint] = useState<THREE.Vector3 | null>(null)

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    // e.point is the Vector3 coordinate in world space
    setHitPoint(e.point)
    e.stopPropagation()
  }

  return (
    <group position={[0, 0, 0]}>
      <mesh onClick={handleClick}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#00aaee" transparent opacity={0.8} />
      </mesh>

      {/* A visual marker to show the exact hit location */}
      {hitPoint && (
        <mesh position={hitPoint}>
          <sphereGeometry args={[0.05]} />
          <meshBasicMaterial color="red" />
        </mesh>
      )}
    </group>
  )
}

// --------------------------------------------------------
// 3. OCCLUSION (Blocking Rays)
// --------------------------------------------------------
function OcclusionExample() {
  const [active, setActive] = useState(false)

  return (
    <group position={[2.5, 0, 0]}>
      {/* FRONT OBJECT */}
      <mesh
        position={[0, 0, 1]}
        onClick={(e) => {
          setActive(!active)
          e.stopPropagation()
          alert('Clicked Front Object!')
        }}
      >
        <boxGeometry args={[0.8, 0.8, 0.1]} />
        <meshStandardMaterial color={active ? 'lime' : 'red'} />
      </mesh>

      {/* BACK OBJECT */}
      <mesh
        position={[0, 0, -1]}
        scale={1.5}
        onClick={() => alert('Clicked Back Object!')}
      >
        <planeGeometry />
        <meshStandardMaterial color="gray" side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

// --------------------------------------------------------
// 4. MANUAL RAYCASTER (Shooting from Center)
// --------------------------------------------------------
function ReticleRaycaster() {
  const laserRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    // Fixed: Passing a proper Vector2 instance instead of a plain object
    state.raycaster.setFromCamera(new THREE.Vector2(0, 0), state.camera)

    const intersects = state.raycaster.intersectObjects(
      state.scene.children,
      true,
    )

    // Safety check: ensure laserRef.current is loaded
    if (laserRef.current) {
      if (intersects.length > 0) {
        // Find the first hit that is NOT the laser itself
        const hit = intersects.find(
          (i) => i.object.uuid !== laserRef.current.uuid,
        )

        if (hit) {
          // @ts-ignore - Material color set is safe here
          laserRef.current.material.color.set('red')
          laserRef.current.scale.z = hit.distance
        } else {
          // @ts-ignore
          laserRef.current.material.color.set('lime')
          laserRef.current.scale.z = 10
        }
      } else {
        // @ts-ignore
        laserRef.current.material.color.set('lime')
        laserRef.current.scale.z = 10
      }
    }
  })

  return (
    <mesh ref={laserRef} position={[0, 0, 0]}>
      {/* Note: In Three.js, geometry centers are at 0,0,0. 
          To make a laser grow "forward", we translate geometry, not mesh. */}
      <boxGeometry args={[0.02, 0.02, 1]} />
      <meshBasicMaterial color="lime" />
    </mesh>
  )
}

// --------------------------------------------------------
// MAIN PAGE COMPONENT
// --------------------------------------------------------
function RaycastingTopic() {
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div
        style={{
          padding: '20px',
          borderBottom: '1px solid #ccc',
          background: '#f0f0f0',
        }}
      >
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>
          Raycasting & Events
        </h1>
        <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
          <li>
            <strong>Left (Box):</strong> Basic Hover/Click events.
          </li>
          <li>
            <strong>Center (Sphere):</strong> Click to visualize exact surface
            coordinate.
          </li>
          <li>
            <strong>Right (Wall):</strong> Occlusion. The red box blocks clicks
            to the grey wall.
          </li>
        </ul>
      </div>

      {/* 3D Scene */}
      <div style={{ flex: 1, background: '#111' }}>
        <Canvas camera={{ position: [0, 0, 4] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />

          <HoverBox position={[-2.5, 0, 0]} />
          <PreciseSphere />
          <OcclusionExample />

          <ReticleRaycaster />

          <gridHelper
            args={[10, 10, 0x444444, 0x222222]}
            rotation={[Math.PI / 2, 0, 0]}
            position={[0, 0, -2]}
          />
        </Canvas>
      </div>
    </div>
  )
}
