import { TanStackDevtools } from '@tanstack/react-devtools'
import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
      <header className="relative bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 shadow-lg">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo/Title */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center transform hover:rotate-12 transition-transform duration-300">
                <span className="text-2xl">🎨</span>
              </div>
              <h1 className="text-white font-bold text-xl tracking-tight">
                Three.js <span className="font-light">Playground</span>
              </h1>
            </div>

            {/* Navigation Links */}
            <div className="flex gap-3">
              <Link
                to="/"
                className="group relative px-6 py-2.5 text-white font-semibold rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                activeProps={{
                  className: 'bg-white/30 shadow-2xl scale-105',
                }}
              >
                <span className="relative z-10">🎯 Demo 1</span>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </Link>

              <Link
                to="/demo2"
                className="group relative px-6 py-2.5 text-white font-semibold rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                activeProps={{
                  className: 'bg-white/30 shadow-2xl scale-105',
                }}
              >
                <span className="relative z-10">🚀 Demo 2</span>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </Link>
            </div>
          </div>
        </nav>

        {/* Decorative bottom border with animation */}
        <div className="h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-pulse"></div>
      </header>
      <Outlet />
      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </>
  ),
})
