
import { 
  Toast,
  ToastActionElement, 
  ToastProps 
} from "@/components/ui/toast";

import {
  Toaster,
  toast as sonnerToast
} from "sonner";

// Re-export for backwards compatibility
export const toast = (props: {
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: "default" | "destructive";
  duration?: number;
  [key: string]: any;
}) => {
  const { title, description, variant, duration, ...rest } = props;
  
  const options = {
    description,
    duration,
    ...rest
  };
  
  if (title) {
    sonnerToast(title, options);
  } else if (description) {
    // If there's no title but there is a description, use the description as the main message
    sonnerToast(description, rest);
  } else {
    // Fallback if neither title nor description is provided
    sonnerToast("Notification", rest);
  }
};

export type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

// Creating an interface compatible with the original hook return type
export interface UseToastResult {
  toast: (props: { 
    title?: React.ReactNode; 
    description?: React.ReactNode; 
    variant?: "default" | "destructive";
    duration?: number;
    [key: string]: any;
  }) => void;
  dismiss: (toastId?: string) => void;
  toasts: ToasterToast[];
}

// Implement the useToast hook using Sonner's toast functionality
export function useToast(): UseToastResult {
  // In Sonner, there's no direct useToast equivalent, so we'll create a wrapper
  const dismiss = (toastId?: string) => {
    if (toastId) {
      sonnerToast.dismiss(toastId);
    } else {
      sonnerToast.dismiss();
    }
  };
  
  // We need to return an object with the same shape as UseToastResult
  return { 
    toast,
    dismiss,
    toasts: [] // Sonner doesn't expose a way to get all toasts, so we return an empty array
  };
}
