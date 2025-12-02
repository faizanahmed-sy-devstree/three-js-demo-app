import { OrbitControls } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { createFileRoute } from '@tanstack/react-router'
import { useRef } from 'react'
import * as THREE from 'three'

// Creating a route for the "/" path and telling it to render the App component
export const Route = createFileRoute('/')({
  component: App,
})

function RotatingBox() {
  // useRef is used to get a direct reference to the 3D mesh object
  const ref = useRef<THREE.Mesh>(null)

  // useFrame(() => {
  //   // useFrame runs on every animation frame (about 60 times per second)

  //   // Only run this if the mesh exists (after it's rendered)
  //   if (ref.current) {
  //     // Rotate the mesh a little on the X axis on each frame
  //     ref.current.rotation.x += 0.01

  //     // Rotate the mesh a little on the Y axis on each frame
  //     ref.current.rotation.y += 0.01
  //   }
  // })

  // useFrame((state) => {
  //   if (ref.current) {
  //     // 1. Get the time elapsed since the app started
  //     const t = state.clock.getElapsedTime()

  //     // 2. BOUNCE: Move up and down on the Y axis
  //     // Math.sin(t) creates a wave between -1 and 1
  //     // We multiply by 0.5 to make the movement smaller (only 0.5 units up/down)
  //     ref.current.position.y = Math.sin(t * 2) * 0.5

  //     // 3. PULSE: Change the size (Scale)
  //     // We add 1.5 so the box never disappears (scale stays between 1 and 2)
  //     const scale = Math.sin(t * 3) * 0.5 + 1.5
  //     ref.current.scale.set(scale, scale, scale)

  //     // 4. SPIN: Slowly rotate while doing this
  //     ref.current.rotation.y += 0.01
  //   }
  // })

  // useFrame((state) => {
  //   if (ref.current) {
  //     // state.pointer gives us x and y coordinates from -1 to 1

  //     // 1. Calculate target rotation based on mouse position
  //     const targetRotationX = state.pointer.y // Mouse Y controls rotation X
  //     const targetRotationY = state.pointer.x // Mouse X controls rotation Y

  //     // 2. SMOOTHING (Lerp = Linear Interpolation)
  //     // Formula: current = lerp(current, target, speed)
  //     // 0.1 = 10% of the way towards the target per frame.
  //     ref.current.rotation.x = THREE.MathUtils.lerp(
  //       ref.current.rotation.x,
  //       targetRotationX,
  //       0.1,
  //     )
  //     ref.current.rotation.y = THREE.MathUtils.lerp(
  //       ref.current.rotation.y,
  //       targetRotationY,
  //       0.1,
  //     )

  //     // 3. Move the object slightly towards the mouse too
  //     ref.current.position.x = THREE.MathUtils.lerp(
  //       ref.current.position.x,
  //       state.pointer.x * 2,
  //       0.05,
  //     )
  //     ref.current.position.y = THREE.MathUtils.lerp(
  //       ref.current.position.y,
  //       state.pointer.y * 2,
  //       0.05,
  //     )
  //   }
  // })

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime()

      // 1. ORBIT: Move in a circle
      // Using Cos for X and Sin for Z creates a perfect circle
      const radius = 2 // How wide the circle is
      ref.current.position.x = Math.cos(t) * radius
      ref.current.position.z = Math.sin(t) * radius

      // 2. TUMBLE: Rotate fast on all axes
      ref.current.rotation.x = t * 2
      ref.current.rotation.z = t * 2

      // 3. DISCO LIGHTS: Change color over time
      // We access the material attached to this mesh
      // setHSL(Hue, Saturation, Lightness)
      // (t * 0.1) % 1 cycles the color wheel smoothly
      const material = ref.current.material as THREE.MeshStandardMaterial
      material.color.setHSL((t * 0.5) % 1, 1, 0.5)
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
    <>
      <main className="h-[calc(100dvh-65px)] w-full">
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
          <OrbitControls
            /* 🚀 BASIC INTERACTION CONTROL */

            // Allow rotating the camera around the object
            enableRotate={true}
            // Allow zooming in/out with scroll or pinch
            enableZoom={true}
            // Allow dragging the scene (right-click or three-finger drag)
            enablePan={true}
            /* 🧈 SMOOTHNESS (Highly Recommended) */

            // Enables inertia / smooth slowing
            enableDamping={true}
            // How strong the smoothing is (0.05–0.2 is common)
            dampingFactor={0.1}
            /* 🎡 ROTATION LIMITS */

            // Vertical rotation limits (0 = top, Math.PI = bottom)
            // Prevents the camera from flipping upside down
            minPolarAngle={0}
            maxPolarAngle={Math.PI}
            // Horizontal rotation limits (left/right rotation)
            // Use to restrict movement to a small angle range
            minAzimuthAngle={-Infinity}
            maxAzimuthAngle={Infinity}
            // Speed of rotation when dragging
            rotateSpeed={1.0}
            /* 🔍 ZOOM SETTINGS */

            // Minimum + maximum distance of camera from the target
            // Prevents zooming too close or too far
            minDistance={1}
            maxDistance={20}
            // Speed of zoom (scroll sensitivity)
            zoomSpeed={1.0}
            /* ✋ PAN SETTINGS */

            // Speed for panning (moving scene left/right/up/down)
            panSpeed={1.0}
            // Whether to allow pan using keyboard arrows
            keyPanSpeed={7.0} // Default: 7
            /* 🎯 TARGET (Very Important) */

            // The point camera always looks at
            // You can orbit AROUND this point
            target={[0, 0, 0]}
            // (Optional) ignored unless using internal controls.update() manually
            // screenSpacePanning={false}

            /* 📦 MOUSE + TOUCH BEHAVIOR */

            // Mouse button actions
            // LEFT = rotate, MIDDLE = zoom, RIGHT = pan
            mouseButtons={{
              LEFT: THREE.MOUSE.ROTATE,
              MIDDLE: THREE.MOUSE.DOLLY,
              RIGHT: THREE.MOUSE.PAN,
            }}
            // Touch actions
            // 1-finger = rotate, 2-finger = zoom/pan
            touches={{
              ONE: THREE.TOUCH.ROTATE,
              TWO: THREE.TOUCH.DOLLY_PAN,
            }}
            /* 🖥 PERFORMANCE SETTINGS */

            // When true, controls only update when user interacts or damping is active
            // Saves unnecessary renders
            makeDefault={true}

            // Allows controls to trigger re-render on change
            // (Default in R3F; included for clarity)
            // enableEvents={true}
          />

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
    </>
  )
}
