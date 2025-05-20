'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { FiHome, FiFileText, FiUser, FiSettings } from 'react-icons/fi'

const menuItems = [
  { name: 'Overview', icon: FiHome, path: '/dashboard' },
  { name: 'Applications', icon: FiFileText, path: '/dashboard/applications' },
  { name: 'Profile', icon: FiUser, path: '/dashboard/profile' },
  { name: 'Settings', icon: FiSettings, path: '/dashboard/settings' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="flex flex-col h-full">
          <div className="p-6">
            <Link href="/" className="text-xl font-bold text-primary-500 hover:no-underline">
              WelfareChain
            </Link>
          </div>
          <nav className="flex-1 px-3 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.path
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                    ${isActive
                      ? 'bg-primary-50 text-primary-500'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-primary-500'
                    }`}
                >
                  <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-primary-500' : 'text-gray-400'}`} />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
} 