import { Card } from '@/components/ui/card';

export function StateBlock({ title, description }: { title: string; description?: string }) {
  return (
    <Card className="flex flex-col gap-2">
      <p className="text-sm font-semibold text-ink">{title}</p>
      {description ? <p className="text-sm text-ink/70">{description}</p> : null}
    </Card>
  );
}
