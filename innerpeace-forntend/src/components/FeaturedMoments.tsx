import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Play, X, Sparkles } from 'lucide-react';
import { useReels } from '@/features/reels/queries';

function extractYoutubeId(url: string): string {
    const cleanUrl = url.split('?')[0];
    const patterns = [
        /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]+)/,
        /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]+)/,
        /(?:youtu\.be\/)([a-zA-Z0-9_-]+)/,
    ];
    for (const pattern of patterns) {
        const match = cleanUrl.match(pattern);
        if (match) return match[1];
    }
    const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
    if (watchMatch) return watchMatch[1];
    return cleanUrl;
}

export function FeaturedMoments() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [playingId, setPlayingId] = useState<number | null>(null);
    const [hoveredId, setHoveredId] = useState<number | null>(null);
    const { data: reels, isLoading } = useReels();

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 320;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    if (!isLoading && (!reels || reels.length === 0)) {
        return null;
    }

    return (
        <section className="relative py-20 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-cocoa/10 to-transparent rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-tl from-sand/30 to-transparent rounded-full blur-3xl" />
            </div>

            {/* Header */}
            <div className="relative text-center space-y-6 mb-16 animate-fade-in">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cocoa/10 to-sand/30 backdrop-blur-sm">
                    <Sparkles className="w-4 h-4 text-cocoa" />
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cocoa">Glimpses</span>
                </div>
                <h2 className="font-serif text-5xl md:text-6xl font-bold text-ink leading-tight">
                    Visual <span className="text-transparent bg-clip-text bg-gradient-to-r from-cocoa to-ink">Diaries</span>
                </h2>
                <p className="mx-auto max-w-xl text-lg text-ink/60 leading-relaxed">
                    Fleeting moments caught in time, shared to inspire and connect.
                </p>
            </div>

            {/* Carousel */}
            <div className="relative group">
                {/* Navigation buttons */}
                <button
                    className="absolute left-4 md:left-8 top-1/2 z-20 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/90 shadow-xl shadow-ink/10 text-ink opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-white"
                    onClick={() => scroll('left')}
                    aria-label="Scroll left"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                    className="absolute right-4 md:right-8 top-1/2 z-20 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/90 shadow-xl shadow-ink/10 text-ink opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-white"
                    onClick={() => scroll('right')}
                    aria-label="Scroll right"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>

                {/* Gradient masks */}
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-cream to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-cream to-transparent z-10 pointer-events-none" />

                {/* Cards container */}
                <div
                    ref={scrollRef}
                    className="flex gap-8 overflow-x-auto px-8 md:px-16 pb-8 pt-4 scrollbar-hide snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {isLoading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex-none snap-center animate-pulse"
                                style={{ width: '300px', height: '520px' }}
                            >
                                <div className="h-full w-full rounded-[2.5rem] bg-gradient-to-br from-sand/50 to-sand/20" />
                            </div>
                        ))
                    ) : (
                        (reels ?? []).map((reel, index) => {
                            const youtubeId = extractYoutubeId(reel.youtubeUrl);
                            const isPlaying = playingId === reel.id;
                            const isHovered = hoveredId === reel.id;

                            return (
                                <div
                                    key={reel.id}
                                    className="relative flex-none snap-center group/card"
                                    style={{
                                        width: '300px',
                                        height: '520px',
                                        animationDelay: `${index * 100}ms`
                                    }}
                                    onMouseEnter={() => setHoveredId(reel.id)}
                                    onMouseLeave={() => setHoveredId(null)}
                                >
                                    {/* Glow effect */}
                                    <div
                                        className={`absolute -inset-4 rounded-[3rem] bg-gradient-to-br from-cocoa/20 via-transparent to-sand/30 blur-2xl transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                                    />

                                    {/* Card */}
                                    <div
                                        className={`relative h-full w-full overflow-hidden rounded-[2.5rem] bg-ink shadow-2xl shadow-ink/20 transition-all duration-500 ${isHovered && !isPlaying ? 'scale-[1.02] -translate-y-2' : ''}`}
                                    >
                                        {isPlaying ? (
                                            <>
                                                <iframe
                                                    width="100%"
                                                    height="100%"
                                                    src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&loop=1&playlist=${youtubeId}&controls=1&modestbranding=1&rel=0`}
                                                    title="YouTube video player"
                                                    frameBorder="0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                    allowFullScreen
                                                    className="absolute inset-0 h-full w-full"
                                                />
                                                <button
                                                    onClick={() => setPlayingId(null)}
                                                    className="absolute right-4 top-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-sm text-white hover:bg-black/80 transition-all hover:scale-110"
                                                    aria-label="Close video"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                {/* Thumbnail */}
                                                <div className="absolute inset-0 overflow-hidden">
                                                    <img
                                                        src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
                                                        alt={reel.title || 'Video thumbnail'}
                                                        className={`h-full w-full object-cover transition-all duration-700 ${isHovered ? 'scale-110 brightness-75' : 'scale-100 brightness-[0.85]'}`}
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
                                                        }}
                                                    />
                                                    {/* Gradient overlays */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30" />
                                                    <div className={`absolute inset-0 bg-gradient-to-br from-cocoa/20 to-transparent opacity-0 transition-opacity duration-500 ${isHovered ? 'opacity-100' : ''}`} />
                                                </div>

                                                {/* Content */}
                                                <div className="absolute inset-0 flex flex-col justify-between p-6">
                                                    {/* Top badge */}
                                                    <div className="self-start">
                                                        {index === 0 && (
                                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-red-500 to-red-600 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg shadow-red-500/30">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                                                Featured
                                                            </span>
                                                        )}
                                                        {index > 0 && (
                                                            <span className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/80">
                                                                #{index + 1}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Play button */}
                                                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                                                        <button
                                                            onClick={() => setPlayingId(reel.id)}
                                                            className={`relative flex items-center justify-center w-20 h-20 rounded-full transition-all duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
                                                            aria-label="Play video"
                                                        >
                                                            {/* Ripple effect */}
                                                            <span className={`absolute inset-0 rounded-full bg-white/20 animate-ping ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
                                                            <span className={`absolute inset-0 rounded-full bg-white/10 ${isHovered ? 'scale-150 opacity-0' : 'scale-100 opacity-100'} transition-all duration-500`} />

                                                            {/* Button background */}
                                                            <span className={`absolute inset-0 rounded-full transition-all duration-300 ${isHovered ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-xl shadow-red-500/40' : 'bg-white/20 backdrop-blur-md'}`} />

                                                            {/* Icon */}
                                                            <Play className={`relative ml-1 h-8 w-8 transition-colors duration-300 ${isHovered ? 'text-white fill-white' : 'text-white fill-white/80'}`} />
                                                        </button>
                                                    </div>

                                                    {/* Bottom content */}
                                                    <div className="space-y-3 text-center">
                                                        {reel.title ? (
                                                            <p className={`text-base font-medium text-white transition-all duration-300 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-80'}`}>
                                                                {reel.title}
                                                            </p>
                                                        ) : (
                                                            <div className={`inline-block rounded-full bg-white/10 backdrop-blur-sm px-4 py-1.5 transition-all duration-300 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-70'}`}>
                                                                <span className="text-xs font-medium uppercase tracking-wider text-white/90">
                                                                    Play
                                                                </span>
                                                            </div>
                                                        )}

                                                        {/* Duration indicator */}
                                                        <div className={`flex justify-center gap-1 transition-all duration-500 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                                            <span className="w-8 h-1 rounded-full bg-white/40" />
                                                            <span className="w-2 h-1 rounded-full bg-white/20" />
                                                            <span className="w-2 h-1 rounded-full bg-white/20" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="flex justify-center gap-2 mt-8">
                {(reels ?? []).map((reel, i) => (
                    <button
                        key={reel.id}
                        onClick={() => {
                            if (scrollRef.current) {
                                scrollRef.current.scrollTo({
                                    left: i * 320,
                                    behavior: 'smooth'
                                });
                            }
                        }}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${i === 0 ? 'w-6 bg-cocoa' : 'bg-ink/20 hover:bg-ink/40'}`}
                    />
                ))}
            </div>
        </section>
    );
}
