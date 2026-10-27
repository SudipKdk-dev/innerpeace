import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { resolveMediaUrl } from '@/lib/media';
import { formatDate, truncateText } from '@/lib/format';
import { Card } from '@/components/ui/card';
import type { Post } from '@/features/posts/types';

function getReadingTime(content: string | null): number {
  if (!content) return 1;
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

interface BlogCardProps {
  post: Post;
}

export function BlogCard({ post }: BlogCardProps) {
  const imageUrl = resolveMediaUrl(post.image);
  const readingTime = getReadingTime(post.content ?? null);

  return (
    <Link to={`/blogs/${post.slug}`} className="group block h-full">
      <Card className="relative h-full overflow-hidden border border-ink/8 transition-all duration-normal ease-out-expo hover:shadow-card-hover hover:-translate-y-1">
        {/* Image with parallax-like hover */}
        <div className="relative h-56 w-full overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-slow ease-out-expo group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-blush via-sand to-moss/20" />
          )}
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          {/* Reading time badge */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-ink shadow-sm backdrop-blur-sm">
            <Clock size={12} />
            <span>{readingTime} min read</span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3 p-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-cocoa/70">
            {formatDate(post.publishedAt ?? post.createdAt)}
          </p>
          <h3 className="font-serif text-2xl font-bold leading-snug text-ink transition-colors duration-300 group-hover:text-cocoa">
            {post.title}
          </h3>
          {post.content && (
            <p className="text-sm leading-relaxed text-ink/60 line-clamp-2">
              {truncateText(post.content, 140)}
            </p>
          )}

          {/* Read more arrow */}
          <div className="flex items-center gap-2 text-sm font-medium text-cocoa opacity-0 translate-x-[-10px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
            Read article
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
