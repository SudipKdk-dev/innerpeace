import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useJourneys } from '@/features/journey/queries';
import { resolveMediaUrl } from '@/lib/media';
import { formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';
import { Music, BookOpen, Star, Heart, Coffee, Sun } from 'lucide-react';

// Random icons for variety
const ICONS = [Music, BookOpen, Star, Heart, Coffee, Sun];

export default function Journey() {
  const { data: journeys, isLoading, error } = useJourneys();

  const sortedJourneys = useMemo(() => {
    return (journeys ?? []).sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());
  }, [journeys]);

  if (isLoading) {
    return (
      <div className="space-y-12 animate-fade-in">
        <Skeleton className="h-[60vh] w-full rounded-b-[3rem]" />
        <div className="mx-auto max-w-4xl space-y-12 px-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-8">
              <Skeleton className="h-64 w-64 rounded-full" />
              <div className="flex-1 space-y-4 pt-12">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center">
        <p className="text-ink/60">Unable to load journey. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-20">
      {/* Hero Section */}
      {/* Hero Section */}
      <section className="relative mb-20 flex min-h-[65vh] items-center justify-center overflow-hidden rounded-2xl bg-ink text-center text-cream">
        <div
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-transparent to-ink/90" />

        <div className="relative z-10 max-w-3xl px-6">
          <span className="mb-4 inline-block font-sans text-xs font-bold tracking-[0.3em] opacity-80 uppercase">
            The Path
          </span>
          <h1 className="font-serif text-5xl font-bold md:text-7xl lg:text-8xl">
            Collected Moments
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-lg text-cream/80 md:text-xl">
            A chronological collection of the experiences that have left a mark on my soul.
          </p>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="relative space-y-28">
          {/* Vertical central line (optional, purely decorative) */}
          <div className="absolute left-1/2 top-0 -z-10 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-cocoa/20 to-transparent hidden md:block" />

          {sortedJourneys.map((item, index) => {
            const isEven = index % 2 === 0;
            const Icon = ICONS[index % ICONS.length];
            const imageUrl = resolveMediaUrl(item.image);
            const blobClass = index % 3 === 0 ? 'clip-blob-1' : index % 3 === 1 ? 'clip-blob-2' : 'clip-blob-3';

            return (
              <div
                key={item.id}
                className={cn(
                  "flex flex-col items-center gap-8 md:flex-row md:gap-16",
                  isEven ? "" : "md:flex-row-reverse"
                )}
              >
                {/* Image Side */}
                <div className="relative flex-1 group">
                  <div className={cn(
                    "relative mx-auto aspect-square w-60 md:w-72 overflow-hidden shadow-xl transition-transform duration-normal hover:scale-105 rounded-2xl",
                    blobClass
                  )}>
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-cocoa to-sand" />
                    )}

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </div>

                  {/* Floating Badge */}
                  <div className={cn(
                    "absolute -top-4 flex h-12 w-12 items-center justify-center rounded-full bg-cream text-cocoa shadow-lg",
                    isEven ? "right-10" : "left-10"
                  )}>
                    <Icon size={20} />
                  </div>
                </div>

                {/* Text Side */}
                <div className={cn(
                  "flex-1 text-center md:text-left",
                  !isEven && "md:text-right"
                )}>
                  <div className={cn(
                    "mb-4 inline-flex items-center rounded-full border border-cocoa/30 bg-white/50 px-4 py-1 text-xs font-bold uppercase tracking-widest text-cocoa backdrop-blur-sm",
                    !isEven && "flex-row-reverse"
                  )}>
                    {new Date(item.eventDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </div>

                  <h2 className="font-serif text-3xl font-bold text-ink md:text-4xl lg:text-5xl">
                    {item.title}
                  </h2>

                  <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-ink/70 md:mx-0 md:text-lg">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Note from Heart Section */}
      <section className="mt-32 bg-blush/20 py-24 text-center">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="mb-8 font-serif text-4xl font-bold text-ink">Reflections on the Way</h2>
          <p className="mb-8 text-lg italic text-ink/70">
            "Progress is rarely a straight line. It's a series of loops, spirals, and occasional leaps of faith.
            Each detour has taught me something valuable."
          </p>
          <div className="mx-auto h-px w-24 bg-cocoa/30" />
          <p className="mt-8 font-serif text-xl font-medium text-cocoa">
            Every big change starts with a small, quiet decision.
          </p>
        </div>
      </section>
    </div>
  );
}
