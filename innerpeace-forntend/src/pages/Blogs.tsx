import { useState, useMemo } from 'react';
import { SectionHeading } from '@/components/SectionHeading';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { usePosts } from '@/features/posts/queries';
import { BlogCard } from '@/components/BlogCard';

export default function Blogs() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 12;

  const { data: posts, isLoading, error } = usePosts({ page, limit: 100 }); // Fetch all for client-side filtering

  const filteredPosts = useMemo(() => {
    const published = (posts ?? []).filter((post) => post.status === 'published');
    if (!search.trim()) return published;

    const query = search.toLowerCase();
    return published.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.content?.toLowerCase().includes(query)
    );
  }, [posts, search]);

  const totalPages = Math.ceil(filteredPosts.length / limit);
  const paginatedPosts = filteredPosts.slice((page - 1) * limit, page * limit);

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="space-y-6">
        <SectionHeading title="The Journal" subtitle="Reflections" />
        <div className="max-w-md">
          <Input
            type="search"
            placeholder="Find a story..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // Reset to first page on search
            }}
            className="w-full"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-96 rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <Card className="text-center py-16">
          <p className="text-ink/60">Unable to load journal entries. Please try again later.</p>
        </Card>
      ) : paginatedPosts.length > 0 ? (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 stagger-in">
            {paginatedPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 ? (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="ghost"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                ← Previous
              </Button>
              <span className="px-4 text-sm text-ink/70">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="ghost"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next →
              </Button>
            </div>
          ) : null}
        </>
      ) : (
        <Card className="text-center py-16">
          <p className="text-ink/60">
            {search ? 'No stories found matching your search.' : 'The pages are currently empty.'}
          </p>
        </Card>
      )}
    </div>
  );
}
