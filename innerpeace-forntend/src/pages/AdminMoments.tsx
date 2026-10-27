import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SectionHeading } from '@/components/SectionHeading';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMomentsAdmin } from '@/features/moments/queries';
import { completeMoment, fetchMomentPlayUrl, presignMoment } from '@/features/moments/api';
import { useToast } from '@/components/ui/toast';
import { formatDate } from '@/lib/format';
import { useAuth } from '@/hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';

const schema = z.object({
  video: z.any()
});

type FormValues = z.infer<typeof schema>;

export default function AdminMoments() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const { data: moments, isLoading } = useMomentsAdmin(Boolean(token));
  const { push } = useToast();
  const [uploading, setUploading] = useState(false);
  const [playUrl, setPlayUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    const fileList = values.video as FileList | undefined;
    if (!fileList || !fileList[0]) {
      push({ type: 'error', message: 'Select a video file first.' });
      return;
    }
    const file = fileList[0];

    try {
      setUploading(true);
      const ext = file.name.split('.').pop();
      const presign = await presignMoment(file.type, ext);
      const uploadResponse = await fetch(presign.uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type }
      });
      if (!uploadResponse.ok) {
        throw new Error('Upload failed.');
      }
      await completeMoment(presign.momentId);
      push({ type: 'success', message: `Moment uploaded (ID ${presign.momentId}).` });
      reset();
      await queryClient.invalidateQueries({ queryKey: ['moments', 'admin'] });
    } catch (err: any) {
      push({ type: 'error', message: err?.response?.data?.message ?? err?.message ?? 'Upload failed.' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      <SectionHeading title="Manage Moments" subtitle="Admin" />

      <Card className="space-y-4">
        <h2 className="text-xl font-semibold">Upload a Moment</h2>
        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <Input type="file" accept="video/*" {...register('video')} />
          <Button type="submit" disabled={isSubmitting || uploading}>
            {uploading ? 'Uploading...' : 'Upload Moment'}
          </Button>
        </form>
        <p className="text-xs text-ink/60">Presigned uploads send the video directly to S3.</p>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-xl font-semibold">Moments Library</h2>
        {isLoading ? <p className="text-sm text-ink/70">Loading moments...</p> : null}
        <div className="grid gap-3">
          {(moments ?? []).map((moment) => (
            <div key={moment.id} className="flex flex-col gap-2 rounded-2xl border border-ink/10 bg-cream/60 p-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge>{moment.status}</Badge>
                <span className="text-sm font-semibold">Moment #{moment.id}</span>
                <span className="text-xs text-ink/60">{formatDate(moment.createdAt)}</span>
              </div>
              <p className="text-xs text-ink/60">MIME: {moment.mimeType}</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={async () => {
                    try {
                      const result = await fetchMomentPlayUrl(moment.id);
                      setPlayUrl(result.url);
                    } catch {
                      push({ type: 'error', message: 'Unable to fetch playback URL.' });
                    }
                  }}
                >
                  Get playback URL
                </Button>
              </div>
            </div>
          ))}
          {!isLoading && !(moments ?? []).length ? (
            <p className="text-xs text-ink/60">No moments uploaded yet.</p>
          ) : null}
        </div>
      </Card>

      {playUrl ? (
        <Card className="space-y-4">
          <h2 className="text-xl font-semibold">Playback Preview</h2>
          <video src={playUrl} controls className="w-full rounded-2xl" />
        </Card>
      ) : null}
    </div>
  );
}
