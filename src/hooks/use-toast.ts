
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
  toast: (props: Omit<ToasterToast, "id">) => void;
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
      toast(title, {
        description,
        ...rest
      });
    },
    dismiss,
    toasts: [] // Sonner doesn't expose a way to get all toasts, so we return an empty array
  };
}
