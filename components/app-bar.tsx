"use client"

import { Button } from "./ui/button"
import Image from "next/image"
import { useAuth } from "../hooks/useAuth"

export function AppBar() {
  const { user, loading, login, logout } = useAuth();
  return (
    <header className="h-16 border-b border-[#F5E8C2]/10 bg-[#032934] flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center">
        {/* Logo */}
        <div className="h-10 w-10 relative">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/gorlea-logo-pRLW6ezEqdZlsBjxIPIRKmG3oKrXUK.png"
            alt="Gorlea Tasks Logo"
            fill
            className="object-contain"
          />
        </div>
        <h1 className="ml-3 text-xl font-bold text-[#F5E8C2]">Gorlea Tasks</h1>
      </div>
      <div className="flex items-center gap-4">
        {user && user.photoURL && (
          <Image
            src={user.photoURL}
            alt={user.displayName || "User Avatar"}
            width={36}
            height={36}
            className="rounded-full border border-[#F29600]"
          />
        )}
        {user ? (
          <Button
            onClick={logout}
            className="bg-[#F29600] hover:bg-[#F29600]/90 text-[#032934] font-medium transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#032934]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </span>
            ) : "Sign Out"}
          </Button>
        ) : (
          <Button
            onClick={login}
            className="bg-white hover:bg-gray-100 text-gray-800 font-medium px-4 py-2 rounded shadow transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </span>
            ) : (
              <>
                <div className="mr-2 w-5 h-5 relative">
                  <Image
                    src="/google-logo.svg"
                    alt="Google Logo"
                    width={20}
                    height={20}
                    className="object-contain"
                  />
                </div>
                Sign in with Google
              </>
            )}
          </Button>
        )}
      </div>
    </header>
  )
}
