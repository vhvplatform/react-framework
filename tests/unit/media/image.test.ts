import { describe, it, expect, vi, beforeEach } from 'vitest';
import { imageToBase64, getImageDimensions } from '@vhvplatform/media';

describe('Media Package - Image Utilities', () => {
  // Mock File for testing
  const createMockFile = (name: string, type: string, content: string = 'mock-content'): File => {
    const blob = new Blob([content], { type });
    return new File([blob], name, { type });
  };

  beforeEach(() => {
    // Mock URL.createObjectURL
    global.URL.createObjectURL = vi.fn(() => 'mock-url');
    global.URL.revokeObjectURL = vi.fn();
  });

  describe('imageToBase64', () => {
    it('should convert image file to base64 string', async () => {
      const mockFile = createMockFile('test.jpg', 'image/jpeg');
      const mockBase64 = 'data:image/jpeg;base64,mockdata';

      // Mock FileReader
      const mockFileReader = {
        readAsDataURL: vi.fn(function (this: FileReader) {
          // Simulate successful read
          setTimeout(() => {
            (this as unknown as { result: string }).result = mockBase64;
            if (this.onload) {
              this.onload({} as ProgressEvent<FileReader>);
            }
          }, 0);
        }),
        result: '',
        onload: null as ((event: ProgressEvent<FileReader>) => void) | null,
        onerror: null as ((event: ProgressEvent<FileReader>) => void) | null,
      };

      vi.spyOn(global, 'FileReader').mockImplementation(
        () => mockFileReader as unknown as FileReader
      );

      const result = await imageToBase64(mockFile);
      expect(result).toBe(mockBase64);
      expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith(mockFile);
    });

    it('should handle errors when reading file fails', async () => {
      const mockFile = createMockFile('test.jpg', 'image/jpeg');

      const mockFileReader = {
        readAsDataURL: vi.fn(function (this: FileReader) {
          setTimeout(() => {
            if (this.onerror) {
              this.onerror(new Error('Read failed') as unknown as ProgressEvent<FileReader>);
            }
          }, 0);
        }),
        result: '',
        onload: null as ((event: ProgressEvent<FileReader>) => void) | null,
        onerror: null as ((event: ProgressEvent<FileReader>) => void) | null,
      };

      vi.spyOn(global, 'FileReader').mockImplementation(
        () => mockFileReader as unknown as FileReader
      );

      await expect(imageToBase64(mockFile)).rejects.toThrow();
    });

    it('should handle different image formats', async () => {
      const formats = [
        { name: 'test.jpg', type: 'image/jpeg' },
        { name: 'test.png', type: 'image/png' },
        { name: 'test.webp', type: 'image/webp' },
      ];

      for (const format of formats) {
        const mockFile = createMockFile(format.name, format.type);
        const mockBase64 = `data:${format.type};base64,mockdata`;

        const mockFileReader = {
          readAsDataURL: vi.fn(function (this: FileReader) {
            setTimeout(() => {
              (this as unknown as { result: string }).result = mockBase64;
              if (this.onload) {
                this.onload({} as ProgressEvent<FileReader>);
              }
            }, 0);
          }),
          result: '',
          onload: null as ((event: ProgressEvent<FileReader>) => void) | null,
          onerror: null as ((event: ProgressEvent<FileReader>) => void) | null,
        };

        vi.spyOn(global, 'FileReader').mockImplementation(
          () => mockFileReader as unknown as FileReader
        );

        const result = await imageToBase64(mockFile);
        expect(result).toBe(mockBase64);
      }
    });
  });

  describe('getImageDimensions', () => {
    it('should return width and height of image', async () => {
      const mockFile = createMockFile('test.jpg', 'image/jpeg');
      const mockWidth = 800;
      const mockHeight = 600;

      // Mock Image
      class MockImage {
        onload: (() => void) | null = null;
        onerror: (() => void) | null = null;
        src = '';
        width = 0;
        height = 0;

        constructor() {
          setTimeout(() => {
            this.width = mockWidth;
            this.height = mockHeight;
            if (this.onload) {
              this.onload();
            }
          }, 0);
        }
      }

      global.Image = MockImage as unknown as typeof Image;

      const dimensions = await getImageDimensions(mockFile);
      expect(dimensions).toEqual({ width: mockWidth, height: mockHeight });
    });

    it('should handle errors when image fails to load', async () => {
      const mockFile = createMockFile('test.jpg', 'image/jpeg');

      class MockImage {
        onload: (() => void) | null = null;
        onerror: ((error: Event) => void) | null = null;
        src = '';
        width = 0;
        height = 0;

        constructor() {
          setTimeout(() => {
            if (this.onerror) {
              this.onerror(new Error('Failed to load image') as unknown as Event);
            }
          }, 0);
        }
      }

      global.Image = MockImage as unknown as typeof Image;

      await expect(getImageDimensions(mockFile)).rejects.toThrow();
    });

    it('should handle different image sizes', async () => {
      const sizes = [
        { width: 100, height: 100 },
        { width: 1920, height: 1080 },
        { width: 50, height: 200 },
      ];

      for (const size of sizes) {
        const mockFile = createMockFile('test.jpg', 'image/jpeg');

        class MockImage {
          onload: (() => void) | null = null;
          onerror: (() => void) | null = null;
          src = '';
          width = 0;
          height = 0;

          constructor() {
            setTimeout(() => {
              this.width = size.width;
              this.height = size.height;
              if (this.onload) {
                this.onload();
              }
            }, 0);
          }
        }

        global.Image = MockImage as unknown as typeof Image;

        const dimensions = await getImageDimensions(mockFile);
        expect(dimensions).toEqual(size);
      }
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle empty file', async () => {
      const mockFile = createMockFile('empty.jpg', 'image/jpeg', '');

      const mockFileReader = {
        readAsDataURL: vi.fn(function (this: FileReader) {
          setTimeout(() => {
            (this as unknown as { result: string }).result = 'data:image/jpeg;base64,';
            if (this.onload) {
              this.onload({} as ProgressEvent<FileReader>);
            }
          }, 0);
        }),
        result: '',
        onload: null as ((event: ProgressEvent<FileReader>) => void) | null,
        onerror: null as ((event: ProgressEvent<FileReader>) => void) | null,
      };

      vi.spyOn(global, 'FileReader').mockImplementation(
        () => mockFileReader as unknown as FileReader
      );

      const result = await imageToBase64(mockFile);
      expect(result).toBe('data:image/jpeg;base64,');
    });

    it('should handle very large file sizes', async () => {
      const largeContent = 'x'.repeat(10 * 1024 * 1024); // 10MB
      const mockFile = createMockFile('large.jpg', 'image/jpeg', largeContent);

      const mockFileReader = {
        readAsDataURL: vi.fn(function (this: FileReader) {
          setTimeout(() => {
            (this as unknown as { result: string }).result =
              'data:image/jpeg;base64,verylongstring';
            if (this.onload) {
              this.onload({} as ProgressEvent<FileReader>);
            }
          }, 0);
        }),
        result: '',
        onload: null as ((event: ProgressEvent<FileReader>) => void) | null,
        onerror: null as ((event: ProgressEvent<FileReader>) => void) | null,
      };

      vi.spyOn(global, 'FileReader').mockImplementation(
        () => mockFileReader as unknown as FileReader
      );

      const result = await imageToBase64(mockFile);
      expect(result).toBeTruthy();
    });

    it('should handle invalid file types gracefully', async () => {
      const mockFile = createMockFile('test.txt', 'text/plain');

      const mockFileReader = {
        readAsDataURL: vi.fn(function (this: FileReader) {
          setTimeout(() => {
            (this as unknown as { result: string }).result = 'data:text/plain;base64,mockdata';
            if (this.onload) {
              this.onload({} as ProgressEvent<FileReader>);
            }
          }, 0);
        }),
        result: '',
        onload: null as ((event: ProgressEvent<FileReader>) => void) | null,
        onerror: null as ((event: ProgressEvent<FileReader>) => void) | null,
      };

      vi.spyOn(global, 'FileReader').mockImplementation(
        () => mockFileReader as unknown as FileReader
      );

      const result = await imageToBase64(mockFile);
      expect(result).toBeTruthy();
    });

    it('should handle zero-dimension images', async () => {
      const mockFile = createMockFile('test.jpg', 'image/jpeg');

      class MockImage {
        onload: (() => void) | null = null;
        onerror: (() => void) | null = null;
        src = '';
        width = 0;
        height = 0;

        constructor() {
          setTimeout(() => {
            this.width = 0;
            this.height = 0;
            if (this.onload) {
              this.onload();
            }
          }, 0);
        }
      }

      global.Image = MockImage as unknown as typeof Image;

      const dimensions = await getImageDimensions(mockFile);
      expect(dimensions).toEqual({ width: 0, height: 0 });
    });
  });
});
