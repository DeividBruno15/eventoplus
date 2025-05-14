
import { 
  Toast,
  ToastActionElement, 
  ToastProps 
} from "@/components/ui/toast";

import {
  useToast as useToastBase
} from "@/components/ui/use-toast";

export type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

// Criando uma interface compatível com o tipo retornado do hook original
export interface UseToastResult {
  toast: (props: Omit<ToasterToast, "id">) => void;
  dismiss: (toastId?: string) => void;
  toasts: ToasterToast[];
}

export function useToast(): UseToastResult {
  const { toast, dismiss, toasts } = useToastBase();
  return { toast, dismiss, toasts };
}

export { toast } from "@/components/ui/use-toast";
