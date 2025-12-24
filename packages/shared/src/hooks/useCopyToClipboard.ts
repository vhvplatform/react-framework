import { useState } from 'react';

export interface CopyToClipboardResult {
  /** Copy text to clipboard */
  copy: (text: string) => Promise<void>;
  /** Whether the text was successfully copied */
  copied: boolean;
  /** Error if copy failed */
  error: Error | null;
  /** Reset the copied state */
  reset: () => void;
}

/**
 * Hook to copy text to clipboard
 * @param resetDelay - Time in ms to auto-reset copied state (default: 2000)
 * @returns Object with copy function, copied state, error, and reset function
 */
export function useCopyToClipboard(resetDelay = 2000): CopyToClipboardResult {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const copy = async (text: string) => {
    if (!navigator?.clipboard) {
      setError(new Error('Clipboard not supported'));
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setError(null);

      // Auto-reset after delay
      if (resetDelay > 0) {
        setTimeout(() => {
          setCopied(false);
        }, resetDelay);
      }
    } catch (err) {
      setCopied(false);
      setError(err instanceof Error ? err : new Error('Failed to copy'));
    }
  };

  const reset = () => {
    setCopied(false);
    setError(null);
  };

  return { copy, copied, error, reset };
}
