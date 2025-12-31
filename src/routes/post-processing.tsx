import { createFileRoute } from '@tanstack/react-router'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  EffectComposer,
  Bloom,
  Glitch,
  Noise,
  Vignette,
  Sepia,
} from '@react-three/postprocessing'
import { GlitchMode, BlendFunction } from 'postprocessing'
import { useState, useRef } from 'react'
import { Vector2 } from 'three'

export const Route = createFileRoute('/post-processing')({
  component: PostProcessingTopic,
})

/**
 * --------------------------------------------------------
 * 📚 TOPIC: POST-PROCESSING
 * --------------------------------------------------------
 * Post-processing puts your 3D render through a series of 2D filters.
 *
 * KEY COMPONENTS:
 * 1. <EffectComposer>: The wrapper that groups all your effects.
 * 2. <Bloom>: Makes bright things glow (essential for "Neon" looks).
 * 3. <Glitch>: Digital distortion (cyberpunk style).
 * 4. <Noise>: Film grain (adds realism/texture).
 * 5. <Vignette>: Darkens the corners (focuses eye on center).
 */

// --------------------------------------------------------
// SCENE CONTENT
// --------------------------------------------------------
function SceneContent() {
  const boxRef = useRef<any>(null)

  useFrame((state, delta) => {
    if (boxRef.current) {
      boxRef.current.rotation.x += delta * 0.5
      boxRef.current.rotation.y += delta * 0.5
    }
  })

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />

      {/* 1. EMISSIVE SPHERE (For Bloom) */}
      {/* Bloom only works if the color is brighter than the threshold (1.0) */}
      {/* We use toneMapped={false} so the color can go above 1.0 (pure white) */}
      <mesh position={[-2, 0, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color={[1.5, 3, 10]} // RGB values > 1.0 create intense glow
          toneMapped={false} // Crucial for proper glowing!
        />
      </mesh>

      {/* 2. SPINNING BOX (For Glitch/Motion) */}
      <mesh ref={boxRef} position={[2, 0, 0]}>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial color="orange" roughness={0.2} />
      </mesh>

      {/* 3. BACKGROUND GRID */}
      <mesh position={[0, 0, -5]} scale={[10, 10, 1]}>
        <planeGeometry />
        <meshBasicMaterial color="#222" />
      </mesh>
    </>
  )
}

// --------------------------------------------------------
// POST-PROCESSING EFFECTS STACK
// --------------------------------------------------------
function EffectsStack({ activeEffects }: { activeEffects: any }) {
  return (
    // EffectComposer manages the chain of effects
    <EffectComposer disableNormalPass>
      {/* 1. BLOOM: The "Glow" effect */}
      {activeEffects.bloom && (
        <Bloom
          luminanceThreshold={1} // Only glow colors brighter than this
          mipmapBlur // Softens the glow (looks more natural)
          intensity={1.5}
        />
      )}

      {/* 2. GLITCH: Cyberpunk distortion */}
      {activeEffects.glitch && (
        <Glitch
          delay={[1.5, 3.5]} // Seconds between glitches
          duration={[0.6, 1.0]} // Duration of glitch
          strength={[0.3, 1.0]} // Intensity
          mode={GlitchMode.SPORADIC}
        />
      )}

      {/* 3. NOISE: Film grain */}
      {activeEffects.noise && (
        <Noise
          opacity={0.2}
          blendFunction={BlendFunction.OVERLAY} // Blends nicely with scene
        />
      )}

      {/* 4. VIGNETTE: Cinema camera lens darkening */}
      {activeEffects.vignette && (
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      )}

      {/* 5. SEPIA: Old photo style */}
      {activeEffects.sepia && <Sepia intensity={0.5} />}
    </EffectComposer>
  )
}

// --------------------------------------------------------
// MAIN PAGE COMPONENT
// --------------------------------------------------------
function PostProcessingTopic() {
  // State to toggle effects
  const [effects, setEffects] = useState({
    bloom: true,
    glitch: false,
    noise: false,
    vignette: true,
    sepia: false,
  })

  const toggle = (key: string) => {
    setEffects((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* CONTROL PANEL */}
      <div
        style={{
          padding: '20px',
          borderBottom: '1px solid #ccc',
          background: '#222',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
          Post-Processing
        </h1>
        <p style={{ margin: 0, opacity: 0.8 }}>
          Toggle filters to see how they change the mood of the scene.
        </p>

        <div
          style={{
            display: 'flex',
            gap: '10px',
            marginTop: '10px',
            flexWrap: 'wrap',
          }}
        >
          {Object.keys(effects).map((key) => (
            <button
              key={key}
              onClick={() => toggle(key)}
              style={{
                padding: '8px 16px',
                background: effects[key as keyof typeof effects]
                  ? '#4f46e5'
                  : '#444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                textTransform: 'capitalize',
                fontWeight: 'bold',
                transition: 'background 0.2s',
              }}
            >
              {key} {effects[key as keyof typeof effects] ? 'ON' : 'OFF'}
            </button>
          ))}
        </div>
      </div>

      {/* 3D SCENE */}
      <div style={{ flex: 1, background: '#050505' }}>
        <Canvas camera={{ position: [0, 0, 5] }}>
          <SceneContent />
          <EffectsStack activeEffects={effects} />
        </Canvas>
      </div>
    </div>
  )
}
