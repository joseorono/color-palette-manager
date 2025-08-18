
export interface ShareOptions {
  /** Custom title for the share */
  title?: string;
  /** Custom text/description for the share */
  text?: string;
  /** Custom success message for toast */
  successMessage?: string;
  /** Custom fallback message when Web Share API is not available */
  fallbackMessage?: string;
}

export interface ShareResult {
  success: boolean;
  method: 'native' | 'clipboard' | 'error';
  message: string;
}
