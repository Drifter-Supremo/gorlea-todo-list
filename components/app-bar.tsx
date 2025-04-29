"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"

interface AppBarProps {
  isSignedIn: boolean
  onSignInToggle: () => void
}

export function AppBar({ isSignedIn, onSignInToggle }: AppBarProps) {
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

      {/* Google Sign-in/out Button */}
      <Button onClick={onSignInToggle} className="bg-[#F29600] hover:bg-[#F29600]/90 text-[#032934] font-medium">
        {isSignedIn ? "Sign Out" : "Sign In with Google"}
      </Button>
    </header>
  )
}
