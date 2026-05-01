import { Shield } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-[#0B0F14]/80 backdrop-blur-xl border-b border-[#1F2937]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-2.5">
            <Shield className="w-6 h-6 text-blue-500" />
            <span className="text-lg font-semibold tracking-tight">
              FinGuard <span className="text-blue-400 font-light">AI</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
            <div className="relative flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
