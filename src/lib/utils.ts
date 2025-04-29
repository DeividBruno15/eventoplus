
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
 */
export function formatDateInput(value: string): string {
  // Remove any non-numeric characters
  const numericValue = value.replace(/\D/g, '');
  
  // Format with slashes
  if (numericValue.length <= 2) {
    return numericValue;
  } else if (numericValue.length <= 4) {
    return `${numericValue.slice(0, 2)}/${numericValue.slice(2)}`;
  } else {
    return `${numericValue.slice(0, 2)}/${numericValue.slice(2, 4)}/${numericValue.slice(4, 8)}`;
  }
}

/**
 * Checks if a date string (DD/MM/YYYY) is before today
 */
export function isDateBeforeToday(dateString: string): boolean {
  // Parse date string (DD/MM/YYYY)
  const parts = dateString.split('/');
  if (parts.length !== 3) return false;
  
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Month is 0-based
  const year = parseInt(parts[2], 10);
  
  // Create date objects
  const inputDate = new Date(year, month, day);
  inputDate.setHours(0, 0, 0, 0);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return inputDate < today;
}

/**
 * Formats a number as currency (BRL)
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

