import { ExtractedFrame } from '../types';

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export async function extractVideoFrames(
  videoFile: File,
  frameCount: number = 4
): Promise<{ duration: number; durationFormatted: string; frames: ExtractedFrame[] }> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    const objectUrl = URL.createObjectURL(videoFile);
    video.src = objectUrl;

    const frames: ExtractedFrame[] = [];

    video.onloadedmetadata = async () => {
      const duration = video.duration || 60;
      const durationFormatted = formatTime(duration);

      const targetTimes: number[] = [];
      for (let i = 1; i <= frameCount; i++) {
        targetTimes.push((duration * i) / (frameCount + 1));
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const captureFrameAt = (time: number): Promise<ExtractedFrame> => {
        return new Promise((res) => {
          const onSeeked = () => {
            video.removeEventListener('seeked', onSeeked);
            canvas.width = Math.min(video.videoWidth || 640, 640);
            canvas.height = Math.min(video.videoHeight || 360, 360);
            if (ctx) {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            }
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            res({
              timestamp: time,
              formattedTime: formatTime(time),
              dataUrl,
            });
          };
          video.addEventListener('seeked', onSeeked);
          video.currentTime = time;
        });
      };

      try {
        for (const time of targetTimes) {
          const frame = await captureFrameAt(time);
          frames.push(frame);
        }
        URL.revokeObjectURL(objectUrl);
        resolve({ duration, durationFormatted, frames });
      } catch (err) {
        URL.revokeObjectURL(objectUrl);
        reject(err);
      }
    };

    video.onerror = (e) => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('无法解析该视频文件'));
    };
  });
}
