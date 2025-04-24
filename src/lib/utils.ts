import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { EventStatus } from "@/types/events";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (date: Date) => {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const getStatusColor = (status: EventStatus) => {
  switch (status) {
    case 'open':
      return 'bg-green-500';
    case 'closed':
      return 'bg-gray-500';
    case 'published':
      return 'bg-blue-500';
    case 'draft':
      return 'bg-yellow-500';
    case 'cancelled':
      return 'bg-red-500';
    case 'finished':
      return 'bg-purple-500';
    case 'in_progress':
      return 'bg-orange-500';
    default:
      return 'bg-gray-500';
  }
};

export const getApplicationStatusColor = (status: 'pending' | 'approved' | 'rejected') => {
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
