import { Link } from '@tanstack/react-router'

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
