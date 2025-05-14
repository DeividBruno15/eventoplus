
import { 
  Toast,
  ToastActionElement, 
  ToastProps 
} from "@/components/ui/toast";

import {
  Toaster,
  toast
} from "sonner";

// Re-export for backwards compatibility
export { toast };

export type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

// Creating an interface compatible with the original hook return type
export interface UseToastResult {
  toast: (props: { title?: React.ReactNode; description?: React.ReactNode; variant?: "default" | "destructive" }) => void;
  dismiss: (toastId?: string) => void;
  toasts: ToasterToast[];
}

// Implement the useToast hook using Sonner's toast functionality
export function useToast(): UseToastResult {
  // In Sonner, there's no direct useToast equivalent, so we'll create a wrapper
  const dismiss = (toastId?: string) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  };
  
  // We need to return an object with the same shape as UseToastResult
  return { 
    toast: (props) => {
      const { title, description, variant, ...rest } = props;
      if (title) {
        toast(title, {
          description,
          ...rest
        });
      } else if (description) {
        // If there's no title but there is a description, use the description as the main message
        toast(description, rest);
      } else {
        // Fallback if neither title nor description is provided
        toast("Notification", rest);
      }
    },
    dismiss,
    toasts: [] // Sonner doesn't expose a way to get all toasts, so we return an empty array
  };
}
