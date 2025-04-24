
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'draft':
      return 'bg-gray-500';
    case 'published':
      return 'bg-green-500';
    case 'cancelled':
      return 'bg-red-500';
    case 'finished':
      return 'bg-blue-500';
    case 'open':
      return 'bg-yellow-500';
    case 'closed':
      return 'bg-gray-700';
    case 'in_progress':
      return 'bg-indigo-500';
    default:
      return 'bg-gray-500';
  }
};

export const getApplicationStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-500';
    case 'approved':
      return 'bg-green-500';
    case 'rejected':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};
