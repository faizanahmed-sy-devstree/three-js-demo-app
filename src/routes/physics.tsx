import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { CuboidCollider, Physics, RigidBody } from '@react-three/rapier'
import { createFileRoute } from '@tanstack/react-router'
import { useRef } from 'react'

export const Route = createFileRoute('/physics')({
  component: PhysicsScene,
})

/*
  CONCEPT 1: The "RigidBody"
  A RigidBody is an object that physics applies to.
  - If you want gravity to pull it? Put it in a RigidBody.
  - If you want it to be a solid wall? Put it in a RigidBody.
*/

function BouncyBall() {
  const rigidBodyRef = useRef<any>(null)

  const jump = () => {
    // APPLYING FORCE
    // We can push the object by applying an "impulse"
    // x: 0, y: 5 (up), z: 0
    rigidBodyRef.current?.applyImpulse({ x: 0, y: 5, z: 0 }, true)
  }

  return (
    /* 
       colliders="ball": Tells physics this is a sphere shape
       restitution={1.2}: Bounciness (0 = brick, 1 = super ball, >1 = gains energy)
       position: Where it starts falling from
    */
    <RigidBody
      ref={rigidBodyRef}
      colliders="ball"
      restitution={0.9}
      position={[0, 5, 0]}
    >
      <mesh onClick={jump}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>
    </RigidBody>
  )
}

function HeavyBox() {
  return (
    /* 
       friction={2}: Makes it hard to slide
       mass={5}: Makes it heavy (harder to push around)
    */
    <RigidBody position={[1, 8, 0]} friction={2} mass={5}>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    </RigidBody>
  )
}

function Floor() {
  return (
    /* 
      type="fixed":
      This object will NEVER move. It is like a wall or the ground.
      Gravity does not affect it.
    */
    <RigidBody type="fixed" restitution={0.5}>
      <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#333" />
      </mesh>
    </RigidBody>
  )
}

function PhysicsScene() {
  return (
    <div className="h-[calc(100dvh-65px)] w-full">
      <Canvas shadows camera={{ position: [0, 5, 10], fov: 50 }}>
        {/* Basic Scene Setup */}
        <OrbitControls makeDefault />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} castShadow />

        {/* 
          CONCEPT 2: The <Physics> World 
          Everything inside this tag obeys the laws of physics.
          debug={true} -> Shows wireframes so you can see the actual physics shapes.
        */}
        <Physics debug={true} gravity={[0, -9.81, 0]}>
          <BouncyBall />
          <HeavyBox />
          <Floor />

          {/* You can also have invisible walls! */}
          <RigidBody type="fixed" position={[5, 1, 0]}>
            <CuboidCollider args={[1, 5, 5]} />
          </RigidBody>
        </Physics>
      </Canvas>

      <div style={{ position: 'absolute', top: 80, left: 20, color: 'white' }}>
        Click the Pink Ball to make it jump!
      </div>
    </div>
  )
}
