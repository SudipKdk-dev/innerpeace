import { Card } from '@/components/ui/card';
import { SectionHeading } from '@/components/SectionHeading';
import { usePosts } from '@/features/posts/queries';
import { useJourneysAdmin } from '@/features/journey/queries';
import { useMomentsAdmin } from '@/features/moments/queries';
import { useAuth } from '@/hooks/useAuth';
import { BookOpen, Map, Video, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { token, user } = useAuth();
  const { data: posts } = usePosts({ page: 1, limit: 100 });
  const { data: journeys } = useJourneysAdmin(Boolean(token));
  const { data: moments } = useMomentsAdmin(Boolean(token));

  const stats = [
    {
      label: 'Total Blogs',
      count: posts?.length ?? 0,
      subtext: 'Published stories',
      href: '/admin/blogs',
      icon: BookOpen,
      color: 'bg-moss/20 text-moss',
    },
    {
      label: 'Journey Items',
      count: journeys?.length ?? 0,
      subtext: 'Timeline milestones',
      href: '/admin/journey',
      icon: Map,
      color: 'bg-terracotta/20 text-terracotta',
    },
    {
      label: 'Moments',
      count: moments?.length ?? 0,
      subtext: 'Video reels',
      href: '/admin/moments',
      icon: Video,
      color: 'bg-clay/20 text-clay',
    },
  ];

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="font-serif text-4xl font-bold text-ink">
          Welcome back, {user?.username}
        </h1>
        <p className="text-ink/60">Here's what's happening in your digital garden.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.label} to={stat.href} className="group">
            <Card className="glass relative overflow-hidden border border-ink/8 p-6 transition-all duration-normal hover:-translate-y-1 hover:shadow-lg">
              <div className="relative z-10 flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className={`rounded-xl p-2.5 ${stat.color}`}>
                    <stat.icon size={24} />
                  </div>
                  <ArrowUpRight className="text-ink/30 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>

                <div className="mt-4">
                  <p className="text-3xl font-bold text-ink">{stat.count}</p>
                  <p className="font-serif text-base font-medium text-ink/80">{stat.label}</p>
                  <p className="text-sm text-ink/50">{stat.subtext}</p>
                </div>
              </div>

              {/* Decorative gradient blob */}
              <div className="absolute -bottom-4 -right-4 h-32 w-32 rounded-full bg-gradient-to-br from-sand/30 to-blush/20 blur-2xl transition-transform group-hover:scale-110" />
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions or Recent Activity could go here */}
      <div className="rounded-2xl bg-white/40 p-6 border border-ink/8">
        <SectionHeading title="System Status" subtitle="Overview" />
        <div className="mt-6 flex gap-4">
          <div className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-green-700">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider">Operational</span>
          </div>
          <div className="text-sm text-ink/60 flex items-center">
            Last synced: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
}
