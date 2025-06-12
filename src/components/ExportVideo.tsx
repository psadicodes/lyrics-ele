import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

interface ExportVideoProps {
  onExport: (options: ExportOptions) => Promise<void>;
  isExporting: boolean;
}

export interface ExportOptions {
  filename: string;
  quality: 'low' | 'medium' | 'high' | 'ultra';
  includeAudio: boolean;
  duration: number;
  currentTime?: number;
  capturedFrames?: Uint8Array[];
  frameRate?: number;
  format: 'mp4' | 'webm' | 'gif' | 'png' | 'jpg' | 'svg';
  resolution: '480p' | '720p' | '1080p' | '1440p' | '4k';
  bitrate?: number;
  codec?: 'h264' | 'h265' | 'vp8' | 'vp9' | 'av1';
}

const ExportVideo = ({ onExport, isExporting }: ExportVideoProps) => {
  const [filename, setFilename] = useState('periodic_lyrics_video');
  const [quality, setQuality] = useState<'low' | 'medium' | 'high' | 'ultra'>('medium');
  const [includeAudio, setIncludeAudio] = useState(true);
  const [duration, setDuration] = useState(10);
  const [format, setFormat] = useState<'mp4' | 'webm' | 'gif' | 'png' | 'jpg' | 'svg'>('mp4');
  const [resolution, setResolution] = useState<'480p' | '720p' | '1080p' | '1440p' | '4k'>('1080p');
  const [frameRate, setFrameRate] = useState(30);
  const [codec, setCodec] = useState<'h264' | 'h265' | 'vp8' | 'vp9' | 'av1'>('h264');
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const handleExport = () => {
    if (!filename.trim()) {
      toast({
        title: "Filename required",
        description: "Please enter a filename for your export",
        variant: "destructive"
      });
      return;
    }
    
    // Calculate bitrate based on quality and resolution
    const getBitrate = () => {
      const baseRates = {
        '480p': { low: 500, medium: 1000, high: 1500, ultra: 2000 },
        '720p': { low: 1000, medium: 2000, high: 3000, ultra: 4000 },
        '1080p': { low: 2000, medium: 4000, high: 6000, ultra: 8000 },
        '1440p': { low: 4000, medium: 8000, high: 12000, ultra: 16000 },
        '4k': { low: 8000, medium: 16000, high: 24000, ultra: 32000 }
      };
      return baseRates[resolution][quality];
    };
    
    onExport({
      filename,
      quality,
      includeAudio,
      duration,
      format,
      resolution,
      frameRate,
      codec,
      bitrate: getBitrate()
    });
    
    toast({
      title: "Export started",
      description: `Your ${format.toUpperCase()} video is being prepared for download`
    });
    
    setOpen(false);
  };

  const getFormatDescription = () => {
    switch (format) {
      case 'mp4': return 'Best for sharing and compatibility';
      case 'webm': return 'Smaller file size, web optimized';
      case 'gif': return 'Animated image, no audio';
      case 'png': return 'Single frame screenshot';
      case 'jpg': return 'Single frame image';
      case 'svg': return 'Vector graphics (experimental)';
      default: return '';
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Video
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Export Periodic Lyrics Video</DialogTitle>
          <DialogDescription>
            Configure your video export settings for the best quality and format.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="filename" className="text-right">
              Filename
            </Label>
            <Input
              id="filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="col-span-3"
              placeholder="my_lyrics_video"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="format" className="text-right">
              Format
            </Label>
            <div className="col-span-3">
              <Select value={format} onValueChange={(value: any) => setFormat(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mp4">MP4 Video</SelectItem>
                  <SelectItem value="webm">WebM Video</SelectItem>
                  <SelectItem value="gif">Animated GIF</SelectItem>
                  <SelectItem value="png">PNG Image</SelectItem>
                  <SelectItem value="jpg">JPG Image</SelectItem>
                  <SelectItem value="svg">SVG Vector</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">{getFormatDescription()}</p>
            </div>
          </div>

          {(format === 'mp4' || format === 'webm') && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="resolution" className="text-right">
                  Resolution
                </Label>
                <Select value={resolution} onValueChange={(value: any) => setResolution(value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="480p">480p (854×480)</SelectItem>
                    <SelectItem value="720p">720p (1280×720)</SelectItem>
                    <SelectItem value="1080p">1080p (1920×1080)</SelectItem>
                    <SelectItem value="1440p">1440p (2560×1440)</SelectItem>
                    <SelectItem value="4k">4K (3840×2160)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="quality" className="text-right">
                  Quality
                </Label>
                <Select value={quality} onValueChange={(value: any) => setQuality(value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (Fast export)</SelectItem>
                    <SelectItem value="medium">Medium (Balanced)</SelectItem>
                    <SelectItem value="high">High (Best quality)</SelectItem>
                    <SelectItem value="ultra">Ultra (Maximum quality)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="codec" className="text-right">
                  Codec
                </Label>
                <Select value={codec} onValueChange={(value: any) => setCodec(value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="h264">H.264 (Most compatible)</SelectItem>
                    <SelectItem value="h265">H.265 (Smaller files)</SelectItem>
                    <SelectItem value="vp8">VP8 (WebM standard)</SelectItem>
                    <SelectItem value="vp9">VP9 (Better compression)</SelectItem>
                    <SelectItem value="av1">AV1 (Future standard)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="frameRate" className="text-right">
                  Frame Rate
                </Label>
                <Select value={frameRate.toString()} onValueChange={(value) => setFrameRate(parseInt(value))}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24">24 FPS (Cinematic)</SelectItem>
                    <SelectItem value="30">30 FPS (Standard)</SelectItem>
                    <SelectItem value="60">60 FPS (Smooth)</SelectItem>
                    <SelectItem value="120">120 FPS (Ultra smooth)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {(format === 'mp4' || format === 'webm' || format === 'gif') && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">
                Duration (s)
              </Label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="300"
                value={duration}
                onChange={(e) => setDuration(Math.max(1, Math.min(300, parseInt(e.target.value) || 1)))}
                className="col-span-3"
              />
            </div>
          )}

          {(format === 'mp4' || format === 'webm') && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="includeAudio" className="text-right">
                Include Audio
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Checkbox
                  id="includeAudio"
                  checked={includeAudio}
                  onCheckedChange={(checked) => setIncludeAudio(checked as boolean)}
                />
                <span className="text-sm text-muted-foreground">Add audio track to the video</span>
              </div>
            </div>
          )}

          <div className="bg-muted/50 p-3 rounded-md">
            <h4 className="text-sm font-medium mb-2">Export Preview</h4>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Format: {format.toUpperCase()}</p>
              {(format === 'mp4' || format === 'webm') && (
                <>
                  <p>Resolution: {resolution}</p>
                  <p>Quality: {quality}</p>
                  <p>Frame Rate: {frameRate} FPS</p>
                  <p>Codec: {codec.toUpperCase()}</p>
                  <p>Audio: {includeAudio ? 'Included' : 'Not included'}</p>
                </>
              )}
              {(format === 'mp4' || format === 'webm' || format === 'gif') && (
                <p>Duration: {duration} seconds</p>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleExport} disabled={isExporting}>
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportVideo;