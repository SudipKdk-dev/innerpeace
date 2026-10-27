import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

const links = [
  { href: '/', label: 'Home' },
  { href: '/blogs', label: 'Journal' },
  { href: '/journey', label: 'Timeline' },
  { href: '/acadex', label: 'Portfolio' },
  { href: '/connect', label: 'Reach Out' }
];

export function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-ink/8 bg-cream/90 backdrop-blur-md">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="group flex items-center gap-1">
          <span className="font-serif text-xl font-semibold tracking-tight text-ink transition-colors group-hover:text-cocoa">InnerPeace</span>
        </Link>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl border border-ink/10 p-2.5 text-ink transition-all duration-normal hover:bg-ink/5 md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
        <div className="hidden items-center gap-8 text-sm md:flex">
          {links.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'group relative py-1 font-medium transition-colors duration-normal',
                  isActive ? 'text-cocoa' : 'text-ink/70 hover:text-ink'
                )}
              >
                {link.label}
                <span
                  className={cn(
                    'absolute -bottom-0.5 left-0 h-0.5 w-full origin-left rounded-full bg-cocoa transition-transform duration-normal',
                    isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  )}
                />
              </Link>
            );
          })}

          {/* Admin Dashboard Link - Only shown when authenticated */}
          {isAuthenticated && (
            <Link
              to="/admin"
              className="ml-2 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-medium text-cream transition-all hover:bg-ink/90 hover:shadow-md"
            >
              <LayoutDashboard size={14} />
              Dashboard
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={cn(
          'overflow-hidden border-t border-ink/8 bg-cream/95 backdrop-blur-md transition-all duration-normal md:hidden',
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="flex flex-col gap-1 px-4 py-3">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                'rounded-xl px-4 py-3 font-medium transition-all duration-normal',
                location.pathname === link.href
                  ? 'bg-ink text-cream shadow-sm'
                  : 'text-ink/70 hover:bg-ink/5 hover:text-ink'
              )}
            >
              {link.label}
            </Link>
          ))}

          {/* Admin Dashboard Link for Mobile */}
          {isAuthenticated && (
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="mt-2 flex items-center gap-2 rounded-xl bg-ink px-4 py-3 font-medium text-cream shadow-sm"
            >
              <LayoutDashboard size={16} />
              Admin Dashboard
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
