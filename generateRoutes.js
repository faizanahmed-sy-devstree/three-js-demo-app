// generateRoutes.js
// Run with: node generateRoutes.js

import fs from 'fs'
import path from 'path'

const baseDir = './src/routes'

// Your nav link list
const navLinks = [
  { label: 'Scene', to: '/scene' },
  { label: 'Camera', to: '/camera' },
  { label: 'Renderer', to: '/renderer' },
  { label: 'Geometry, Materials', to: '/geometry-materials' },
  { label: 'Mesh', to: '/mesh' },
  { label: 'Lighting', to: '/lighting' },
  { label: 'Textures', to: '/textures' },
  { label: 'React Three Fiber Basics', to: '/r3f-basics' },
  { label: 'r3f - useFrame', to: '/r3f-useframe' },
  { label: 'r3f - canvas', to: '/r3f-canvas' },
  { label: 'r3 drei - orbit controls', to: '/drei-orbit-controls' },
  { label: 'r3 drei - useGltf', to: '/drei-usegltf' },
  { label: '3D Text', to: '/text-3d' },
  { label: 'Physics', to: '/physics' },
  { label: 'Animation', to: '/animation' },
  { label: 'Audio', to: '/audio' },
  { label: 'Helpers', to: '/helpers' },
  { label: 'Loaders', to: '/loaders' },
  { label: 'Math', to: '/math' },
  { label: 'Model', to: '/model' },
  { label: 'Shaders (GLSL)', to: '/shaders' },
  { label: 'Post-processing', to: '/post-processing' },
  { label: 'Raycasting', to: '/raycasting' },
]

// Converts `/geometry-materials` → `geometry-materials.tsx`
const formatFileName = (route) => {
  const clean = route.replace('/', '')
  return `${clean}.tsx`
}

// Template for each page
const getRouteTemplate = (pathName, label) => `
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('${pathName}')({
  component: () => (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>${label}</h1>
      <p>This is the <strong>${label}</strong> page.</p>
    </div>
  ),
})
`

console.log('🚀 Generating route files...')

navLinks.forEach(({ label, to }) => {
  const fileName = formatFileName(to)
  const fullPath = path.join(baseDir, fileName)

  if (fs.existsSync(fullPath)) {
    console.log(`⚠️  Skipped (already exists): ${fileName}`)
    return
  }

  fs.writeFileSync(fullPath, getRouteTemplate(to, label))
  console.log(`✔ Created: ${fileName}`)
})

console.log('🎉 All routes generated successfully!')
