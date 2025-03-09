// lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges class names using clsx and tailwind-merge
 * This is used by UI components to handle class name merging with proper precedence
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date to a localized string
 * @param date The date to format
 * @param options Formatting options
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', options).format(dateObj);
}

/**
 * Format a date to a relative time string
 * @param date The date to format
 * @returns Relative time string (e.g. "2 hours ago", "yesterday", etc.)
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ago`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    if (diffInDays === 1) {
      return 'yesterday';
    }
    return `${diffInDays} days ago`;
  }
  
  // For older dates, return formatted date
  return formatDate(dateObj, { month: 'short', day: 'numeric' });
}

/**
 * Truncate a string with ellipsis if it exceeds the max length
 * @param str The string to truncate
 * @param maxLength Maximum length before truncation
 * @returns Truncated string
 */
export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) {
    return str;
  }
  return str.slice(0, maxLength) + '...';
}

/**
 * Convert a string to title case
 * @param str The string to convert
 * @returns The string in title case
 */
export function toTitleCase(str: string): string {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Generate an avatar text from a name (initials)
 * @param name The full name
 * @returns Initials (1-2 characters)
 */
export function getInitials(name: string): string {
  if (!name) return '';
  
  const parts = name.split(' ').filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/**
 * Get a color value based on a string (useful for consistent user colors)
 * @param str The string to hash
 * @returns A color value
 */
export function getStringColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const colors = [
    '#2563EB', // blue
    '#16A34A', // green
    '#DC2626', // red
    '#9333EA', // purple
    '#EA580C', // orange
    '#0891B2', // cyan
    '#4F46E5', // indigo
    '#0D9488', // teal
    '#D97706', // amber
    '#7C3AED', // violet
  ];
  
  return colors[Math.abs(hash) % colors.length];
}