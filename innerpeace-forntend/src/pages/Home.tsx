import { useMemo } from 'react';
import { SectionHeading } from '@/components/SectionHeading';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { usePosts } from '@/features/posts/queries';
import { useJourneys } from '@/features/journey/queries';
import { BlogCard } from '@/components/BlogCard';
import { FeaturedMoments } from '@/components/FeaturedMoments';
import { resolveMediaUrl } from '@/lib/media';
import { formatDate } from '@/lib/format';

export default function Home() {
  const { data: posts, isLoading: postsLoading } = usePosts({ page: 1, limit: 6 });
  const { data: journeys, isLoading: journeysLoading } = useJourneys();

  const latestPosts = useMemo(
    () => (posts ?? []).filter((post) => post.status === 'published').slice(0, 3),
    [posts]
  );

  const featuredJourney = useMemo(() => (journeys ?? []).slice(0, 2), [journeys]);

  return (
    <div className="space-y-24 animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blush/80 via-sand to-cream shadow-lg">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(127,139,106,0.15),transparent_50%)]" aria-hidden />
        <div className="relative mx-auto flex min-h-[65vh] w-full max-w-5xl flex-col justify-center gap-6 px-8 py-20 md:px-12">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-cocoa animate-slide-up">Digital Garden</p>
          <h1 className="font-serif text-4xl font-bold text-ink md:text-5xl lg:text-6xl text-balance leading-[1.1] animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Capturing the essence of growth and creativity
          </h1>
          <p className="max-w-2xl text-base text-ink/80 md:text-lg leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
            A personal space dedicated to my thoughts, milestones, and the small, beautiful moments that make up a quiet life well-lived.
          </p>
          <div className="flex flex-wrap gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Button to="/blogs">Read my thoughts</Button>
            <Button to="/journey" variant="secondary">
              See my journey
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Moments Carousel */}
      <FeaturedMoments />

      {/* Latest Blogs */}
      <section className="space-y-10">
        <div className="flex items-end justify-between">
          <SectionHeading title="Recent Writings" subtitle="Journal" />
          <Button to="/blogs" variant="ghost" className="hidden md:inline-flex">
            Read all →
          </Button>
        </div>
        {postsLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-80 rounded-2xl" />
            ))}
          </div>
        ) : latestPosts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 stagger-in">
            {latestPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <p className="text-ink/60">No stories published yet. I'm working on something special.</p>
          </Card>
        )}
        <div className="text-center md:hidden">
          <Button to="/blogs" variant="ghost">
            Read all →
          </Button>
        </div>
      </section>

      {/* Featured Journey */}
      <section className="space-y-8 animate-slide-up">
        <div className="flex items-end justify-between">
          <SectionHeading title="Key Milestones" subtitle="Timeline" />
          <Button to="/journey" variant="ghost" className="hidden md:inline-flex">
            View full timeline →
          </Button>
        </div>

        {journeysLoading ? (
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-48 rounded-2xl" />
            <Skeleton className="h-48 rounded-2xl" />
          </div>
        ) : featuredJourney.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {featuredJourney.map((item) => (
              <Card key={item.id} className="flex flex-col gap-6 p-6 transition-all hover:shadow-soft hover:-translate-y-1 md:flex-row">
                {resolveMediaUrl(item.image) ? (
                  <img
                    src={resolveMediaUrl(item.image)!}
                    alt={item.title}
                    className="h-48 w-full rounded-xl object-cover md:h-full md:w-1/3"
                  />
                ) : (
                  <div className="h-48 w-full rounded-xl bg-gradient-to-br from-moss/20 to-blush/30 md:h-full md:w-1/3" />
                )}
                <div className="flex-1 space-y-3 py-2">
                  <p className="text-xs uppercase tracking-widest text-cocoa/70">{formatDate(item.eventDate)}</p>
                  <h3 className="font-serif text-2xl font-bold text-ink">{item.title}</h3>
                  <p className="text-ink/70 leading-relaxed line-clamp-3">{item.description}</p>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <p className="text-ink/60">Timeline is being curated.</p>
          </Card>
        )}
      </section>
    </div>
  );
}
