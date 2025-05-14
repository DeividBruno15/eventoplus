
import { 
  Toast,
  ToastActionElement, 
  ToastProps 
} from "@/components/ui/toast";

import {
  useToast as useToastBase,
  toast as toastBase
} from "@/components/ui/sonner";

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

export function useToast(): UseToastResult {
  const { toast, dismiss, toasts } = useToastBase();
  return { toast, dismiss, toasts };
}

export const toast = toastBase;
