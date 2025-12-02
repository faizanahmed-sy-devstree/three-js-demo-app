import { useState, useRef, useEffect } from 'react'
import { NavLinkItem } from './NavLinkItem.tsx'
import { Link } from '@tanstack/react-router'

const navLinks = [
  { label: 'My 3D home', to: '/my-home' },
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

export const Navbar = () => {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: any) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setOpen(false)
      }
    }

    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [])

  const firstFour = navLinks.slice(0, 4)
  const remainingLinks = navLinks.slice(4)

  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white text-sm font-semibold transform hover:rotate-6 transition-transform duration-200">
              3D
            </div>
            <h1 className="text-gray-900 font-semibold text-lg tracking-tight">
              Three.js Playground
            </h1>
          </div>

          {/* Nav Menu */}
          <div className="flex items-center gap-2 relative">
            {/* First 4 normal links */}
            {firstFour.map((link) => (
              <NavLinkItem key={link.to} to={link.to}>
                {link.label}
              </NavLinkItem>
            ))}

            {/* More Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen((prev) => !prev)}
                className="px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                More ▾
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 shadow-lg rounded-lg z-50 p-2 max-h-96 overflow-y-auto">
                  {remainingLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      activeProps={{
                        className: 'bg-indigo-50 text-indigo-600 font-semibold',
                      }}
                      className="block px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                      onClick={() => setOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
