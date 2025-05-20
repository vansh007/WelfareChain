'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiUser, FiSettings, FiLogOut, FiHome, FiMenu, FiX } from 'react-icons/fi'


export default function Header() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { address, isConnected } = useAccount()
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  const { disconnect } = useDisconnect()

  const isActive = (path: string) => pathname === path

  const navLinks = [
    { href: '/', label: 'Home', icon: FiHome },
    { href: '/schemes', label: 'Schemes' },
    { href: '/chatbot', label: 'Check Eligibility' },
    { href: '/dashboard', label: 'Dashboard' },
  ]

  return (
    <header className="fixed w-full bg-white border-b border-gray-200 z-50">
      <div className="container-custom">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-primary-500 hover:no-underline">
            WelfareChain
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${isActive(link.href)
                    ? 'text-primary-500 bg-primary-50'
                    : 'text-gray-600 hover:text-primary-500 hover:bg-gray-50'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Wallet Connection */}
          <div className="hidden md:flex items-center space-x-4">
            {isConnected ? (
              <div className="relative group">
                <button
                  onClick={() => disconnect()}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  <FiUser className="w-4 h-4" />
                  <span>{address?.slice(0, 6)}...{address?.slice(-4)}</span>
                </button>
                <div className="absolute right-0 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-1">
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FiUser className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FiSettings className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                    <button
                      onClick={() => disconnect()}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FiLogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => connect()}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Connect Wallet
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium
                    ${isActive(link.href)
                      ? 'text-primary-500 bg-primary-50'
                      : 'text-gray-600 hover:text-primary-500 hover:bg-gray-50'
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {isConnected ? (
                <button
                  onClick={() => {
                    disconnect()
                    setIsMenuOpen(false)
                  }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-primary-500 hover:bg-gray-50 rounded-md"
                >
                  Disconnect Wallet
                </button>
              ) : (
                <button
                  onClick={() => {
                    connect()
                    setIsMenuOpen(false)
                  }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-primary-500 hover:bg-primary-50 rounded-md"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
} 