import { trpc } from '@/lib/trpc';
import { Image, FileText, Film, Download, Loader2 } from 'lucide-react';

function getFileIcon(type: string) {
  if (type.startsWith('image')) return <Image className="w-4 h-4 text-blue-400" />;
  if (type.startsWith('video')) return <Film className="w-4 h-4 text-purple-400" />;
  return <FileText className="w-4 h-4 text-muted-foreground" />;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DocumentMediaGallery({ slug }: { slug: string }) {
  const { data: media, isLoading } = trpc.batch21.getMedia.useQuery({ slug });

  if (isLoading) {
    return <div className="flex justify-center py-4"><Loader2 className="w-4 h-4 animate-spin text-muted-foreground" /></div>;
  }

  if (!media || media.length === 0) return null;

  return (
    <div className="mt-6 border-t border-border/50 pt-4">
      <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
        <Image className="w-4 h-4 text-[#d4af37]" /> Attached Media ({media.length})
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {media.map((m: any) => (
          <div key={m.id} className="bg-card/60 border border-border/50 rounded-lg overflow-hidden group">
            {m.fileType.startsWith('image') ? (
              <div className="aspect-video bg-background/50 flex items-center justify-center overflow-hidden">
                <img src={m.fileUrl} alt={m.caption || m.fileName} className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="aspect-video bg-background/50 flex items-center justify-center">
                {getFileIcon(m.fileType)}
              </div>
            )}
            <div className="p-2">
              <div className="text-xs font-medium text-foreground truncate">{m.fileName}</div>
              {m.caption && <div className="text-[10px] text-muted-foreground mt-0.5 truncate">{m.caption}</div>}
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[10px] text-muted-foreground">{formatSize(m.fileSize)}</span>
                <a href={m.fileUrl} target="_blank" rel="noopener noreferrer"
                  className="text-[10px] text-[#d4af37] hover:underline flex items-center gap-0.5">
                  <Download className="w-3 h-3" /> Open
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
