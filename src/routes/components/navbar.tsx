import { Link } from '@tanstack/react-router'

export const Navbar = () => {
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

          {/* Nav links */}
          <div className="flex gap-2">
            <NavLinkItem to="/">Demo 1</NavLinkItem>
            <NavLinkItem to="/demo2">Demo 2</NavLinkItem>
            <NavLinkItem to="/topic-6">Topic 6</NavLinkItem>
          </div>
        </div>
      </nav>
    </header>
  )
}

export const NavLinkItem = ({ to, children }: any) => {
  return (
    <Link
      to={to}
      className="px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors duration-200"
      activeProps={{
        className: 'bg-indigo-50 text-indigo-600 font-semibold',
      }}
    >
      {children}
    </Link>
  )
}
