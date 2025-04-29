
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
  let cleaned = value.replace(/\D/g, '');
  
  if (cleaned.length > 8) {
    cleaned = cleaned.substring(0, 8);
  }
  
  if (cleaned.length > 4) {
    return cleaned.replace(/(\d{2})(\d{2})(\d+)/, '$1/$2/$3');
  } else if (cleaned.length > 2) {
    return cleaned.replace(/(\d{2})(\d+)/, '$1/$2');
  }
  
  return cleaned;
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
