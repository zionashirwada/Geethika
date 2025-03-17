
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { convertText } from '../translators/UnicodeToSinhala';
import { UnicodeToBamini } from '@/translators/UnicodeToBamini';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts Unicode Sinhala text to FM font encoding
 * This is a mapping of Unicode Sinhala characters to their FM font equivalents
 */
export function unicodeToFMFont(text: string): string {
  if (!text) return '';
  return convertText(text);
}

export function unicodeToBamini(text: string): string {
  if (!text) return '';
  return UnicodeToBamini(text);
}
