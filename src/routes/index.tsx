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
  )
}
