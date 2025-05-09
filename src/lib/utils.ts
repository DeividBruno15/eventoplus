
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Returns the appropriate background color class for a given application status.
 */
export function getApplicationStatusColor(status: string): string {
  switch (status) {
    case 'pending':
      return 'bg-amber-500';
    case 'accepted':
      return 'bg-green-500';
    case 'rejected':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
}

/**
 * Formats a date string to DD/MM/YYYY
 * Optimized version with memoization for common inputs
 */
const dateFormatCache = new Map<string, string>();

export function formatDateInput(value: string): string {
  // Check if we already formatted this date
  if (dateFormatCache.has(value)) {
    return dateFormatCache.get(value)!;
  }
  
  // Remove any non-numeric characters
  const numericValue = value.replace(/\D/g, '');
  
  let result: string;
  // Format with slashes
  if (numericValue.length <= 2) {
    result = numericValue;
  } else if (numericValue.length <= 4) {
    result = `${numericValue.slice(0, 2)}/${numericValue.slice(2)}`;
  } else {
    result = `${numericValue.slice(0, 2)}/${numericValue.slice(2, 4)}/${numericValue.slice(4, 8)}`;
  }
  
  // Store in cache if input is complex enough to benefit from caching
  if (numericValue.length > 4) {
    dateFormatCache.set(value, result);
  }
  
  return result;
}

/**
 * Checks if a date string (DD/MM/YYYY) is before today
 * Optimized with early returns and fewer object creations
 */
export function isDateBeforeToday(dateString: string): boolean {
  // Parse date string (DD/MM/YYYY)
  const parts = dateString.split('/');
  if (parts.length !== 3) return false;
  
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Month is 0-based
  const year = parseInt(parts[2], 10);
  
  // Validate date parts
  if (isNaN(day) || isNaN(month) || isNaN(year)) return false;
  if (month < 0 || month > 11) return false;
  if (day < 1 || day > 31) return false;
  
  // Create date objects
  const inputDate = new Date(year, month, day);
  inputDate.setHours(0, 0, 0, 0);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return inputDate < today;
}

/**
 * Formats a number as currency (BRL)
 * Using a cached formatter for performance
 */
const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

/**
 * Debounces a function to improve performance
 * Useful for search inputs and other frequently triggered events
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Cache function results for better performance
 */
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map();
  
  return function(...args: Parameters<T>): ReturnType<T> {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  } as T;
}

/**
 * Advanced performance optimization - LazyLoader for components
 * This improves initial load time by deferring non-critical component loading
 */
export function lazyLoader<T>(loader: () => Promise<T>, fallback?: React.ReactNode): [React.ComponentType, boolean] {
  const [loaded, setLoaded] = React.useState(false);
  const [Component, setComponent] = React.useState<React.ComponentType>(() => 
    (props: any) => fallback as React.ReactElement);
  
  React.useEffect(() => {
    let mounted = true;
    loader().then((module: any) => {
      if (mounted) {
        const Component = module.default || module;
        setComponent(() => Component);
        setLoaded(true);
      }
    });
    return () => { mounted = false; };
  }, [loader]);
  
  return [Component as React.ComponentType, loaded];
}

/**
 * Device detection utility 
 */
export function getDeviceInfo() {
  const userAgent = navigator.userAgent;
  
  // Determine device type
  let deviceType = 'Desktop';
  if (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
    deviceType = 'Mobile';
  } else if (/iPad/i.test(userAgent) || (/Macintosh/i.test(userAgent) && 'ontouchend' in document)) {
    deviceType = 'Tablet';
  }
  
  // Determine operating system
  let os = 'Unknown';
  if (/Windows/i.test(userAgent)) os = 'Windows';
  else if (/Macintosh|Mac OS X/i.test(userAgent)) os = 'MacOS';
  else if (/Linux/i.test(userAgent)) os = 'Linux';
  else if (/Android/i.test(userAgent)) os = 'Android';
  else if (/iOS|iPhone|iPad|iPod/i.test(userAgent)) os = 'iOS';
  
  // Determine browser
  let browser = 'Unknown';
  if (/Chrome/i.test(userAgent) && !/Chromium|Edge|Edg|OPR|Opera/i.test(userAgent)) browser = 'Chrome';
  else if (/Firefox/i.test(userAgent)) browser = 'Firefox';
  else if (/Safari/i.test(userAgent) && !/Chrome|Chromium|Edge|Edg|OPR|Opera/i.test(userAgent)) browser = 'Safari';
  else if (/Edge|Edg/i.test(userAgent)) browser = 'Edge';
  else if (/Opera|OPR/i.test(userAgent)) browser = 'Opera';
  
  return {
    deviceType,
    os,
    browser,
    userAgent,
    isMobile: deviceType === 'Mobile',
    isTablet: deviceType === 'Tablet',
    isDesktop: deviceType === 'Desktop',
  };
}

/**
 * Image optimization - Lazy loading helper
 */
export function optimizeImageLoading(src: string, sizes?: string): {
  src: string;
  loading: 'lazy';
  sizes?: string;
  onLoad?: () => void;
} {
  return {
    src,
    loading: 'lazy',
    sizes,
    onLoad: () => {
      // Image has been loaded, mark as visible for animation if needed
      if (typeof document !== 'undefined') {
        const img = document.querySelector(`img[src="${src}"]`) as HTMLImageElement;
        if (img) {
          img.classList.add('loaded');
        }
      }
    },
  };
}

/**
 * Data fetching optimization - Staggered loading
 * Helps with performance when loading multiple items in a list
 */
export function useStaggeredLoading<T>(items: T[], delay: number = 100): T[] {
  const [visibleItems, setVisibleItems] = React.useState<T[]>([]);

  React.useEffect(() => {
    if (!items.length) return;
    
    setVisibleItems([]);
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    
    items.forEach((item, index) => {
      const timeout = setTimeout(() => {
        setVisibleItems(prev => [...prev, item]);
      }, index * delay);
      timeouts.push(timeout);
    });
    
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [items, delay]);

  return visibleItems;
}

/**
 * String normalization and search optimization
 * For improved, accent-insensitive searches
 */
export function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Optimized search function
 */
export const optimizedSearch = memoize((items: any[], searchTerm: string, fields: string[]): any[] => {
  if (!searchTerm.trim()) return items;
  
  const normalizedTerm = normalizeString(searchTerm);
  
  return items.filter(item => {
    return fields.some(field => {
      const value = item[field];
      if (typeof value !== 'string') return false;
      return normalizeString(value).includes(normalizedTerm);
    });
  });
});
