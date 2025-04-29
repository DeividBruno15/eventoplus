
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { EventStatus, ApplicationStatus } from "@/types/events";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatDate = (date: Date) => {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const formatDateInput = (value: string): string => {
  // Remove characters that aren't numbers
  let cleaned = value.replace(/\D/g, '');
  
  // Limit to 8 digits (DDMMYYYY)
  if (cleaned.length > 8) {
    cleaned = cleaned.substring(0, 8);
  }
  
  // Format with slashes
  if (cleaned.length > 4) {
    return cleaned.replace(/(\d{2})(\d{2})(\d+)/, '$1/$2/$3');
  } else if (cleaned.length > 2) {
    return cleaned.replace(/(\d{2})(\d+)/, '$1/$2');
  }
  
  return cleaned;
};

export const isDateBeforeToday = (dateString: string): boolean => {
  // Validates and converts a string date in DD/MM/YYYY format
  const parts = dateString.split('/');
  if (parts.length !== 3) return false;
  
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // JavaScript months are 0-indexed
  const year = parseInt(parts[2], 10);
  
  // Check if the date is valid
  if (isNaN(day) || isNaN(month) || isNaN(year)) return false;
  if (day < 1 || day > 31) return false;
  if (month < 0 || month > 11) return false;
  if (year < 1000) return false;
  
  const inputDate = new Date(year, month, day);
  inputDate.setHours(0, 0, 0, 0); // Set time to midnight
  
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to midnight
  
  return inputDate < today;
};

export const getStatusColor = (status: EventStatus) => {
  switch (status) {
    case 'draft':
      return 'bg-yellow-500';
    case 'published':
      return 'bg-blue-500';
    case 'cancelled':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

export const getApplicationStatusColor = (status: ApplicationStatus) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-500';
    case 'accepted':
      return 'bg-green-500';
    case 'rejected':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};
