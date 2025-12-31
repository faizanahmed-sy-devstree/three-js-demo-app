import { createFileRoute } from '@tanstack/react-router'
import { Canvas, useFrame, extend, ReactThreeFiber } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import { useRef, useState } from 'react'
import * as THREE from 'three'

export const Route = createFileRoute('/shaders')({
  component: ShadersTopic,
})

/**
 * --------------------------------------------------------
 * 📚 TOPIC: SHADERS (GLSL)
 * --------------------------------------------------------
 * Shaders are small programs written in GLSL (C-like language) that run on the GPU.
 *
 * 1. Vertex Shader: Runs once per vertex. Handles position & shape.
 *    - "gl_Position" is the mandatory output (where is this point on screen?)
 *
 * 2. Fragment Shader: Runs once per pixel. Handles color.
 *    - "gl_FragColor" is the mandatory output (what color is this pixel?)
 *
 * 3. Uniforms: Variables passed from JS to GLSL (e.g. Time, Color, Mouse).
 */

// --------------------------------------------------------
// 1. DEFINING THE SHADER MATERIAL
// --------------------------------------------------------
// shaderMaterial(uniforms, vertexShader, fragmentShader) creates a class
const ColorShiftMaterial = shaderMaterial(
  // Uniforms (Default Values)
  { time: 0, color: new THREE.Color(0.2, 0.0, 0.1) },

  // Vertex Shader (The Shape)
  // We just pass the position through mostly unchanged here.
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  // Fragment Shader (The Look)
  // We mix the base color with a time-based sine wave.
  `
    uniform float time;
    uniform vec3 color;
    varying vec2 vUv;
    
    void main() {
      gl_FragColor.rgba = vec4(0.5 + 0.3 * sin(vUv.yxx + time) + color, 1.0);
    }
  `,
)

const WaveMaterial = shaderMaterial(
  { uTime: 0, uColor: new THREE.Color(0.0, 1.0, 1.0) },

  // Vertex Shader: We move the 'z' position based on a Sine wave!
  `
    uniform float uTime;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      vec3 pos = position;
      // The Magic: Modify Z based on X and Time
      pos.z += sin(pos.x * 5.0 + uTime) * 0.2;
      pos.z += sin(pos.y * 5.0 + uTime) * 0.2;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,

  // Fragment Shader
  `
    uniform vec3 uColor;
    varying vec2 vUv;
    void main() {
      // Simple gradient based on UV coordinates
      gl_FragColor = vec4(vUv.x * uColor, 1.0);
    }
  `,
)

// --------------------------------------------------------
// 2. REGISTERING WITH R3F
// --------------------------------------------------------
// This makes <colorShiftMaterial> and <waveMaterial> available as JSX tags
extend({ ColorShiftMaterial, WaveMaterial })

// --------------------------------------------------------
// 3. TYPESCRIPT SUPPORT
// --------------------------------------------------------
// We need to tell TypeScript these new elements exist in the JSX namespace
declare global {
  namespace JSX {
    interface IntrinsicElements {
      colorShiftMaterial: ReactThreeFiber.Object3DNode<
        THREE.ShaderMaterial,
        typeof ColorShiftMaterial
      >
      waveMaterial: ReactThreeFiber.Object3DNode<
        THREE.ShaderMaterial,
        typeof WaveMaterial
      >
    }
  }
}

// --------------------------------------------------------
// 4. EXAMPLE COMPONENT: COLOR PULSE
// --------------------------------------------------------
function ShaderBox() {
  const ref = useRef<THREE.ShaderMaterial>(null!)

  useFrame((state, delta) => {
    // We update the "time" uniform every frame
    if (ref.current) {
      ref.current.uniforms.time.value += delta
    }
  })

  return (
    <mesh position={[-2, 0, 0]}>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      {/* Our Custom Material */}
      <colorShiftMaterial ref={ref} color="hotpink" />
    </mesh>
  )
}

// --------------------------------------------------------
// 5. EXAMPLE COMPONENT: WAVING FLAG
// --------------------------------------------------------
function ShaderFlag() {
  const ref = useRef<THREE.ShaderMaterial>(null!)

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.uniforms.uTime.value += delta * 2
    }
  })

  return (
    <mesh position={[2, 0, 0]} rotation={[-Math.PI / 6, 0, 0]}>
      {/* High segment count (32, 32) is needed for smooth waves */}
      <planeGeometry args={[2, 1.5, 32, 32]} />
      {/* Wireframe helps see the vertex displacement */}
      <waveMaterial ref={ref} wireframe={true} />
    </mesh>
  )
}

// --------------------------------------------------------
// MAIN PAGE COMPONENT
// --------------------------------------------------------
function ShadersTopic() {
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          padding: '20px',
          borderBottom: '1px solid #ccc',
          background: '#f0f0f0',
        }}
      >
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Shaders (GLSL)</h1>
        <p>
          Left: <strong>Fragment Shader</strong> (Animating Colors).
          <br />
          Right: <strong>Vertex Shader</strong> (Animating Shape/Geometry).
        </p>
      </div>

      <div style={{ flex: 1, background: '#111' }}>
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />

          <ShaderBox />
          <ShaderFlag />
        </Canvas>
      </div>
    </div>
  )
}
