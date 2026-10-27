import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Clock, Share2, Copy, Check, MessageCircle, Send } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { usePostBySlug } from '@/features/posts/queries';
import { resolveMediaUrl } from '@/lib/media';
import { formatDate } from '@/lib/format';
import { CommentSection } from '@/components/comments/CommentSection';

function getReadingTime(content: string | null): number {
  if (!content) return 1;
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

function useReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };

    window.addEventListener('scroll', updateProgress);
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return progress;
}

function ShareButton({ title }: { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const url = typeof window !== 'undefined' ? window.location.href : '';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`,
      color: 'hover:bg-green-100 hover:text-green-600'
    },
    {
      name: 'Telegram',
      icon: Send,
      href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      color: 'hover:bg-blue-100 hover:text-blue-500'
    },
    {
      name: 'Twitter',
      icon: () => (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      color: 'hover:bg-gray-100 hover:text-gray-800'
    },
    {
      name: 'Facebook',
      icon: () => (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      color: 'hover:bg-blue-100 hover:text-blue-600'
    }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center rounded-full border border-ink/10 bg-white/80 p-3 text-ink/70 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:text-cocoa hover:shadow-md"
        aria-label="Share post"
      >
        <Share2 size={20} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 animate-scale-in rounded-2xl border border-ink/10 bg-white p-2 shadow-xl">
          <div className="mb-2 px-3 py-2">
            <p className="text-xs font-medium uppercase tracking-wider text-ink/50">Share via</p>
          </div>

          {/* Social Share Links */}
          <div className="space-y-1">
            {shareLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink/70 transition-colors ${link.color}`}
              >
                <link.icon />
                {link.name}
              </a>
            ))}
          </div>

          <div className="my-2 border-t border-ink/10" />

          {/* Copy Link */}
          <button
            onClick={handleCopy}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink/70 transition-colors hover:bg-sand/50"
          >
            {copied ? (
              <>
                <Check size={16} className="text-green-500" />
                <span className="text-green-600">Copied!</span>
              </>
            ) : (
              <>
                <Copy size={16} />
                Copy link
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = usePostBySlug(slug!);
  const progress = useReadingProgress();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 animate-fade-in">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-96 rounded-2xl" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <Card className="mx-auto max-w-3xl text-center py-16 animate-fade-in">
        <h2 className="text-2xl font-semibold mb-4">Story Not Found</h2>
        <p className="text-ink/60 mb-6">This page seems to be missing.</p>
        <Button to="/blogs">← Back to Journal</Button>
      </Card>
    );
  }

  const imageUrl = resolveMediaUrl(post.image);
  const readingTime = getReadingTime(post.content ?? null);

  return (
    <>
      {/* Reading Progress Bar */}
      <div
        className="reading-progress"
        style={{ transform: `scaleX(${progress / 100})` }}
      />

      <article className="mx-auto max-w-3xl space-y-8 animate-fade-in">
        {/* Back Button & Share */}
        <div className="flex items-center justify-between">
          <Link to="/blogs" className="inline-flex items-center text-sm text-ink/70 hover:text-ink transition-colors">
            ← Back to Journal
          </Link>
          <ShareButton title={post.title} />
        </div>

        {/* Header */}
        <header className="space-y-4">
          <div className="flex items-center gap-4 text-xs uppercase tracking-widest text-ink/50">
            <span>{formatDate(post.publishedAt ?? post.createdAt)}</span>
            <span className="flex items-center gap-1.5">
              <Clock size={12} />
              {readingTime} min read
            </span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance">
            {post.title}
          </h1>
        </header>

        {/* Cover Image */}
        {imageUrl && (
          <div className="relative overflow-hidden rounded-3xl shadow-soft">
            <img
              src={imageUrl}
              alt={post.title}
              className="w-full h-auto max-h-[500px] object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div className="whitespace-pre-wrap leading-relaxed text-ink/90 text-lg">
            {post.content}
          </div>
        </div>

        {/* Comment Section */}
        <CommentSection postId={post.id} />

        {/* Navigation */}
        <div className="flex justify-center pt-8 border-t border-ink/10">
          <Button to="/blogs" variant="ghost">
            ← Read more stories
          </Button>
        </div>
      </article>
    </>
  );
}
