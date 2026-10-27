import { Link, Outlet, useLocation } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const adminLinks = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/blogs', label: 'Blogs' },
  { href: '/admin/reels', label: 'Reels' },
  { href: '/admin/journey', label: 'Journey' },
  { href: '/admin/messages', label: 'Messages' }
];

const websiteLinks = [
  { href: '/', label: 'Home' },
  { href: '/blogs', label: 'Journal' },
  { href: '/journey', label: 'Timeline' },
  { href: '/acadex', label: 'Portfolio' },
  { href: '/connect', label: 'Reach Out' }
];

export default function AdminLayout() {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-40 border-b border-ink/8 glass">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="group flex items-baseline gap-2 font-serif text-xl tracking-tight text-ink transition-colors hover:text-cocoa">
            InnerPeace
            <span className="font-sans text-xs font-medium uppercase tracking-wider text-ink/50">Admin</span>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-cream px-3.5 py-1.5 text-xs font-medium text-ink/70 transition-all hover:border-ink/25 hover:bg-white hover:text-ink"
            >
              <ExternalLink size={12} />
              View Website
            </Link>
            {user && <span className="font-medium text-ink/60">{user.username}</span>}
            <Button variant="ghost" size="sm" onClick={logout} className="text-ink/60 hover:text-ink">
              Sign out
            </Button>
          </div>
        </div>
      </header>
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-10 md:grid-cols-[220px_1fr]">
        <aside className="sticky top-24 h-fit space-y-6">
          {/* Admin Navigation */}
          <div className="space-y-1">
            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40">Admin</p>
            {adminLinks.map((link) => {
              const active = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-normal',
                    active
                      ? 'bg-ink text-cream shadow-md'
                      : 'text-ink/60 hover:bg-ink/5 hover:text-ink'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Quick Website Links */}
          <div className="space-y-1 border-t border-ink/8 pt-4">
            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40">Website</p>
            {websiteLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm text-ink/50 transition-all duration-normal hover:bg-moss/10 hover:text-moss"
              >
                <ExternalLink size={12} />
                {link.label}
              </Link>
            ))}
          </div>
        </aside>
        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
