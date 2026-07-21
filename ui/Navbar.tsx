import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-gray-900/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-10">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-white"
          >
            Remote Support Portal
          </Link>
          
        </div>

        {/* Session Status */}
        <div className="flex items-center gap-10">
          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
            >
              Home
            </Link>

            <Link
              href="/jobs"
              className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
            >
              Jobs
            </Link>
          </nav>

          <div className="flex items-center gap-2 rounded-full bg-zinc-800 px-3 py-1">
          <div className="h-2 w-2 rounded-full bg-emerald-500" />

          <span className="text-sm text-zinc-400">
            Technician Session
          </span>
          </div>
        </div>
      </div>
    </header>
  );
}