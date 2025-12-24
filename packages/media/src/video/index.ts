/**
 * Video processing utilities
 */

/**
 * Video metadata
 */
export interface VideoMetadata {
  duration: number;
  width: number;
  height: number;
  size: number;
  type: string;
}

/**
 * Get video metadata
 */
export async function getVideoMetadata(file: File): Promise<VideoMetadata> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = () => {
      resolve({
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight,
        size: file.size,
        type: file.type,
      });
      URL.revokeObjectURL(video.src);
    };

    video.onerror = () => {
      reject(new Error('Failed to load video metadata'));
      URL.revokeObjectURL(video.src);
    };

    video.src = URL.createObjectURL(file);
  });
}

/**
 * Extract video thumbnail
 */
export async function extractVideoThumbnail(
  file: File,
  timeInSeconds: number = 1
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Failed to get canvas context'));
      return;
    }

    video.onloadedmetadata = () => {
      video.currentTime = Math.min(timeInSeconds, video.duration);
    };

    video.onseeked = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create thumbnail'));
          }
          URL.revokeObjectURL(video.src);
        },
        'image/jpeg',
        0.9
      );
    };

    video.onerror = () => {
      reject(new Error('Failed to load video'));
      URL.revokeObjectURL(video.src);
    };

    video.src = URL.createObjectURL(file);
  });
}

/**
 * Extract multiple thumbnails
 */
export async function extractVideoThumbnails(
  file: File,
  count: number = 5
): Promise<Blob[]> {
  const metadata = await getVideoMetadata(file);
  const interval = metadata.duration / (count + 1);
  
  const thumbnails: Blob[] = [];
  
  for (let i = 1; i <= count; i++) {
    const thumbnail = await extractVideoThumbnail(file, interval * i);
    thumbnails.push(thumbnail);
  }
  
  return thumbnails;
}

/**
 * Check if browser supports video format
 */
export function supportsVideoFormat(mimeType: string): boolean {
  const video = document.createElement('video');
  return video.canPlayType(mimeType) !== '';
}

/**
 * Get supported video formats
 */
export function getSupportedVideoFormats(): string[] {
  const formats = [
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/quicktime',
  ];
  
  return formats.filter(supportsVideoFormat);
}

/**
 * Create video preview URL
 */
export function createVideoPreviewURL(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Revoke video preview URL
 */
export function revokeVideoPreviewURL(url: string): void {
  URL.revokeObjectURL(url);
}

/**
 * Validate video file
 */
export interface VideoValidation {
  valid: boolean;
  errors: string[];
}

export async function validateVideo(
  file: File,
  options?: {
    maxSize?: number; // in bytes
    maxDuration?: number; // in seconds
    allowedFormats?: string[];
    minWidth?: number;
    minHeight?: number;
  }
): Promise<VideoValidation> {
  const errors: string[] = [];

  // Check file size
  if (options?.maxSize && file.size > options.maxSize) {
    errors.push(`File size exceeds ${options.maxSize / 1024 / 1024}MB`);
  }

  // Check format
  if (options?.allowedFormats && !options.allowedFormats.includes(file.type)) {
    errors.push(`Format ${file.type} not allowed`);
  }

  try {
    const metadata = await getVideoMetadata(file);

    // Check duration
    if (options?.maxDuration && metadata.duration > options.maxDuration) {
      errors.push(`Duration exceeds ${options.maxDuration} seconds`);
    }

    // Check dimensions
    if (options?.minWidth && metadata.width < options.minWidth) {
      errors.push(`Width must be at least ${options.minWidth}px`);
    }

    if (options?.minHeight && metadata.height < options.minHeight) {
      errors.push(`Height must be at least ${options.minHeight}px`);
    }
  } catch (error) {
    errors.push('Failed to read video metadata');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
