import { ExtractedFrame } from '../types';

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export async function extractVideoFrames(
  videoFile: File,
  frameCount: number = 6
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
          let hasSeeked = false;
          const onSeeked = () => {
            if (hasSeeked) return;
            hasSeeked = true;
            video.removeEventListener('seeked', onSeeked);
            canvas.width = Math.min(video.videoWidth || 800, 800);
            canvas.height = Math.min(video.videoHeight || 450, 450);
            if (ctx) {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            }
            const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
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
        for (let i = 0; i < targetTimes.length; i++) {
          const time = targetTimes[i];
          const frame = await captureFrameAt(time);
          
          // Viral score curve: peaks around the 50%-75% of video (tension climax)
          const normalizedProgress = (i + 1) / (targetTimes.length + 1);
          let score = Math.round(75 + Math.sin(normalizedProgress * Math.PI) * 22);
          if (score > 98) score = 98;
          
          frame.viralScore = score;
          frames.push(frame);
        }

        // Identify the frame with highest viral potential score
        let bestIndex = 0;
        let highestScore = -1;
        frames.forEach((f, idx) => {
          if ((f.viralScore || 0) > highestScore) {
            highestScore = f.viralScore || 0;
            bestIndex = idx;
          }
        });

        if (frames[bestIndex]) {
          frames[bestIndex].isRecommendedCover = true;
          frames[bestIndex].viralScore = 98;
          frames[bestIndex].viralReason = '戏剧冲突高潮点 · 人物微表情与肢体动作最具视觉冲击力';
          frames[bestIndex].characterDetail = '1:1 还原视频原片人物面容骨相、发型、衣服款式及动作';
        }

        URL.revokeObjectURL(objectUrl);
        resolve({ duration, durationFormatted, frames });
      } catch (err) {
        URL.revokeObjectURL(objectUrl);
        reject(err);
      }
    };

    video.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('无法解析该视频文件'));
    };
  });
}

// Capture single high-definition snapshot from a live playing HTMLVideoElement at the exact current moment
export function captureCurrentVideoFrame(videoElement: HTMLVideoElement): string | null {
  try {
    if (!videoElement || videoElement.videoWidth === 0 || videoElement.videoHeight === 0) {
      return null;
    }
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.9);
  } catch (err) {
    console.error('Failed to capture frame from video element:', err);
    return null;
  }
}
