import { TanStackDevtools } from '@tanstack/react-devtools'
import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
      <header className="border-b border-gray-200 bg-white">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo/Title */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white text-sm font-semibold transform hover:rotate-6 transition-transform duration-200">
                3D
              </div>
              <h1 className="text-gray-900 font-semibold text-lg tracking-tight">
                Three.js Playground
              </h1>
            </div>

            {/* Navigation Links */}
            <div className="flex gap-2">
              <Link
                to="/"
                className="px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors duration-200"
                activeProps={{
                  className: 'bg-indigo-50 text-indigo-600 font-semibold',
                }}
              >
                Demo 1
              </Link>

              <Link
                to="/demo2"
                className="px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors duration-200"
                activeProps={{
                  className: 'bg-indigo-50 text-indigo-600 font-semibold',
                }}
              >
                Demo 2
              </Link>
            </div>
          </div>
        </nav>
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
