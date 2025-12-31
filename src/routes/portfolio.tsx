import { createFileRoute } from '@tanstack/react-router'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useRef, useLayoutEffect, useState, useMemo, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { 
  Float, 
  Text, 
  ScrollControls, 
  Scroll, 
  useScroll, 
  MeshDistortMaterial, 
  MeshWobbleMaterial,
  Sparkles,
  Stars,
  Torus,
  Box,
  Sphere,
  MeshTransmissionMaterial,
  Center,
  Environment,
  CameraShake
} from '@react-three/drei'
import * as THREE from 'three'

gsap.registerPlugin(ScrollTrigger)

export const Route = createFileRoute('/portfolio')({
  component: Portfolio,
})

function Portfolio() {
  return (
    <div className="h-screen w-full bg-[#050505]">
      <Canvas shadows gl={{ antialias: true }} dpr={[1, 2]} camera={{ position: [0, 0, 15], fov: 35 }}>
        <color attach="background" args={['#050505']} />
        <fog attach="fog" args={['#050505', 10, 40]} />
        
        <ambientLight intensity={2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={5} castShadow color="#00ffff" />
        <pointLight position={[-10, -10, -10]} intensity={5} color="#ff00ff" />
        
        <ScrollControls pages={6} damping={0.1}>
          <Scene />
          <Scroll html>
            <Overlay />
          </Scroll>
        </ScrollControls>
        
        <Environment preset="night" />
      </Canvas>
    </div>
  )
}

function Scene() {
  const scroll = useScroll()
  const group = useRef<THREE.Group>(null)
  
  useFrame((state, delta) => {
    const r1 = scroll.range(0, 1/5)
    const r2 = scroll.range(1/5, 1/5)
    const r3 = scroll.range(2/5, 1/5)
    
    if (group.current) {
      // Camera fly-through effect by moving the world instead of camera
      // Z movement
      group.current.position.z = scroll.offset * 30
      
      // X/Y movement for "rollercoaster" feel
      group.current.position.x = Math.sin(scroll.offset * Math.PI * 2) * 2
      group.current.rotation.z = Math.sin(scroll.offset * Math.PI) * 0.2
    }
  })

  return (
    <group ref={group}>
      {/* SECTION 1: HERO - GIANT 3D TEXT */}
      <group position={[0, 0, 0]}>
        <HeroText />
        <FloatingCandy />
      </group>

      {/* SECTION 2: TUNNEL */}
      <group position={[0, 0, -10]}>
        <TunnelRings />
      </group>

      {/* SECTION 3: ABOUT */}
      <group position={[3, -1, -15]}>
        <AboutSection />
      </group>

      {/* SECTION 4: WORK */}
      <group position={[-2, 1, -25]}>
        <WorkShowcase />
      </group>
      
      {/* SECTION 5: CONTACT */}
      <group position={[0, 0, -35]}>
        <ContactSection />
      </group>

      <BackgroundStars />
    </group>
  )
}

function HeroText() {
  const textRef = useRef<THREE.Mesh>(null)
  
  useFrame(({ clock, mouse }) => {
    if (textRef.current) {
      textRef.current.rotation.x = Math.sin(clock.getElapsedTime()) * 0.1 + (mouse.y * 0.2)
      textRef.current.rotation.y = Math.cos(clock.getElapsedTime()) * 0.1 + (mouse.x * 0.2)
    }
  })

  return (
    <Center position={[0, 0, 0]}>
      <Text
        ref={textRef}
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
        fontSize={4}
        letterSpacing={-0.05}
        lineHeight={0.8}
        position={[0, 0, 0]}
      >
        FAIZAN
        <meshPhysicalMaterial 
          color="#ffffff"
          transmission={1}
          thickness={1}
          roughness={0}
          ior={1.5}
          clearcoat={1}
          attenuationColor="#ff00ff"
          attenuationDistance={0.5}
        />
      </Text>
      <Text
        position={[0, -2.5, 0]}
        fontSize={0.5}
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
        color="#00ffff"
      >
        CREATIVE DEVELOPER
      </Text>
    </Center>
  )
}

function FloatingCandy() {
  return (
    <group>
      {Array.from({ length: 15 }).map((_, i) => (
        <Float key={i} speed={2} rotationIntensity={4} floatIntensity={4} position={[
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 5
        ]}>
          <mesh>
            {i % 3 === 0 ? <torusGeometry args={[0.3, 0.1, 16, 32]} /> : 
             i % 3 === 1 ? <sphereGeometry args={[0.3, 32, 32]} /> : 
             <boxGeometry args={[0.4, 0.4, 0.4]} />}
            <meshStandardMaterial 
              color={i % 2 === 0 ? "#ff0080" : "#00ffff"} 
              emissive={i % 2 === 0 ? "#ff0080" : "#00ffff"}
              emissiveIntensity={2}
              toneMapped={false}
            />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

function TunnelRings() {
  return (
    <group>
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={i} position={[0, 0, -i * 2]} rotation={[0, 0, i * 0.5]}>
          <torusGeometry args={[4, 0.05, 16, 100]} />
          <meshBasicMaterial color="#333" />
        </mesh>
      ))}
    </group>
  )
}

function AboutSection() {
  return (
    <group>
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <mesh>
          <octahedronGeometry args={[2, 0]} />
          <MeshWobbleMaterial factor={1} speed={2} color="#7000ff" wireframe />
        </mesh>
      </Float>
      <Text
        position={[-3, 0, 0]}
        fontSize={1}
        color="white"
        anchorX="right"
        maxWidth={4}
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
      >
        I build digital universes.
        Code is my clay, 
        the browser is my canvas.
      </Text>
    </group>
  )
}

function WorkShowcase() {
  const [hovered, setHover] = useState<number | null>(null)
  
  return (
    <group>
      <Text position={[0, 2.5, 0]} fontSize={1} color="#00ffff">SELECTED WORKS</Text>
      {[-2, 0, 2].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <mesh 
            onPointerOver={() => { document.body.style.cursor = 'pointer'; setHover(i) }}
            onPointerOut={() => { document.body.style.cursor = 'auto'; setHover(null) }}
            scale={hovered === i ? 1.2 : 1}
          >
            <boxGeometry args={[1.5, 2, 0.2]} />
            <MeshTransmissionMaterial 
              backside
              samples={4}
              thickness={0.5}
              chromaticAberration={0.5}
              anisotropy={0.3}
              distortion={0.5}
              distortionScale={0.5}
              temporalDistortion={0.2}
              color={i === 0 ? "#ff0080" : i === 1 ? "#ffff00" : "#00ffff"}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function ContactSection() {
  return (
    <group>
      <Float speed={5} rotationIntensity={2} floatIntensity={2}>
        <mesh>
          <icosahedronGeometry args={[2, 0]} />
          <MeshDistortMaterial color="#ff0080" speed={5} distort={0.6} />
        </mesh>
      </Float>
      <Text position={[0, -3.5, 0]} fontSize={0.8} color="white">
        hello@faizan.dev
      </Text>
    </group>
  )
}

function BackgroundStars() {
  return (
    <group>
      <Stars radius={50} depth={50} count={5000} factor={4} saturation={1} fade speed={2} />
      <Sparkles count={200} scale={20} size={4} speed={0.4} opacity={0.5} color="#fff" />
    </group>
  )
}

function Overlay() {
  return (
    <div className="w-full h-full pointer-events-none">
      <div className="absolute top-0 left-0 p-8 w-full flex justify-between items-center mix-blend-difference">
        <span className="text-white font-bold text-xl tracking-tighter">FAIZAN.</span>
        <div className="flex gap-4 text-white font-mono text-sm">
          <span>SCROLL TO EXPLORE</span>
        </div>
      </div>
      
      {/* Dynamic Overlay Text for Context */}
      <section className="h-[500vh] w-full">
        {/* Just spacing for scroll */}
      </section>
    </div>
  )
}
