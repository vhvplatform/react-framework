/**
 * Image processing utilities
 */

/**
 * Image resize options
 */
export interface ImageResizeOptions {
  width?: number;
  height?: number;
  maintainAspectRatio?: boolean;
  quality?: number; // 0-1
  format?: 'jpeg' | 'png' | 'webp';
}

/**
 * Image crop options
 */
export interface ImageCropOptions {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Resize image
 */
export async function resizeImage(
  file: File,
  options: ImageResizeOptions
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Failed to get canvas context'));
      return;
    }

    img.onload = () => {
      let { width, height } = options;
      const aspectRatio = img.width / img.height;

      if (options.maintainAspectRatio !== false) {
        if (width && !height) {
          height = width / aspectRatio;
        } else if (height && !width) {
          width = height * aspectRatio;
        }
      }

      canvas.width = width || img.width;
      canvas.height = height || img.height;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        `image/${options.format || 'jpeg'}`,
        options.quality || 0.9
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Crop image
 */
export async function cropImage(
  file: File,
  options: ImageCropOptions
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Failed to get canvas context'));
      return;
    }

    img.onload = () => {
      canvas.width = options.width;
      canvas.height = options.height;

      ctx.drawImage(
        img,
        options.x,
        options.y,
        options.width,
        options.height,
        0,
        0,
        options.width,
        options.height
      );

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        'image/png'
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Convert image to base64
 */
export async function imageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Compress image
 */
export async function compressImage(
  file: File,
  quality: number = 0.7
): Promise<Blob> {
  return resizeImage(file, {
    quality,
    maintainAspectRatio: true,
  });
}

/**
 * Get image dimensions
 */
export async function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Convert image format
 */
export async function convertImageFormat(
  file: File,
  format: 'jpeg' | 'png' | 'webp'
): Promise<Blob> {
  return resizeImage(file, { format, quality: 1 });
}

/**
 * Create thumbnail
 */
export async function createThumbnail(
  file: File,
  maxSize: number = 150
): Promise<Blob> {
  return resizeImage(file, {
    width: maxSize,
    height: maxSize,
    maintainAspectRatio: true,
    quality: 0.8,
  });
}

/**
 * Rotate image
 */
export async function rotateImage(
  file: File,
  degrees: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Failed to get canvas context'));
      return;
    }

    img.onload = () => {
      const radians = (degrees * Math.PI) / 180;
      
      if (degrees === 90 || degrees === 270) {
        canvas.width = img.height;
        canvas.height = img.width;
      } else {
        canvas.width = img.width;
        canvas.height = img.height;
      }

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(radians);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        'image/png'
      );
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Apply grayscale filter
 */
export async function applyGrayscale(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Failed to get canvas context'));
      return;
    }

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx.drawImage(img, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg;
        data[i + 1] = avg;
        data[i + 2] = avg;
      }
      
      ctx.putImageData(imageData, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        'image/png'
      );
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}
