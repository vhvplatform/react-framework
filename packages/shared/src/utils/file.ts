/**
 * Download a file from a URL or Blob
 * @param data - URL string or Blob
 * @param filename - Name for the downloaded file
 */
export function downloadFile(data: string | Blob, filename: string): void {
  const url = typeof data === 'string' ? data : URL.createObjectURL(data);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  if (typeof data !== 'string') {
    URL.revokeObjectURL(url);
  }
}

/**
 * Read file as text
 * @param file - File object
 * @returns Promise with text content
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

/**
 * Read file as data URL
 * @param file - File object
 * @returns Promise with data URL
 */
export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Get file extension
 * @param filename - File name
 * @returns File extension (without dot)
 */
export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
}

/**
 * Get file name without extension
 * @param filename - File name
 * @returns File name without extension
 */
export function getFileNameWithoutExtension(filename: string): string {
  return filename.replace(/\.[^/.]+$/, '');
}

/**
 * Check if file is image
 * @param file - File object or filename
 * @returns true if image
 */
export function isImageFile(file: File | string): boolean {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
  
  if (typeof file === 'string') {
    const ext = getFileExtension(file).toLowerCase();
    return imageExtensions.includes(ext);
  }
  
  return file.type.startsWith('image/');
}

/**
 * Check if file is video
 * @param file - File object or filename
 * @returns true if video
 */
export function isVideoFile(file: File | string): boolean {
  const videoExtensions = ['mp4', 'mov', 'avi', 'wmv', 'flv', 'webm', 'mkv'];
  
  if (typeof file === 'string') {
    const ext = getFileExtension(file).toLowerCase();
    return videoExtensions.includes(ext);
  }
  
  return file.type.startsWith('video/');
}

/**
 * Check if file is audio
 * @param file - File object or filename
 * @returns true if audio
 */
export function isAudioFile(file: File | string): boolean {
  const audioExtensions = ['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a'];
  
  if (typeof file === 'string') {
    const ext = getFileExtension(file).toLowerCase();
    return audioExtensions.includes(ext);
  }
  
  return file.type.startsWith('audio/');
}

/**
 * Convert bytes to human-readable file size
 * @param bytes - File size in bytes
 * @param decimals - Number of decimal places
 * @returns Formatted file size
 */
export function formatFileSize(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}
