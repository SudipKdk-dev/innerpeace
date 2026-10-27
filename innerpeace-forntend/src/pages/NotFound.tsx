import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center animate-fade-in">
      <Card className="text-center max-w-md space-y-6 p-12">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-cocoa">404</h1>
          <h2 className="text-2xl font-semibold">Lost in the Clouds?</h2>
          <p className="text-ink/70">
            The page you're looking for seems to have drifted away.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button to="/">← Go Home</Button>
          <Button to="/blogs" variant="secondary">
            Read Journal
          </Button>
        </div>
      </Card>
    </div>
  );
}
