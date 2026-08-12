import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { toast } from 'sonner';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function showComingSoonToast(actionName?: string) {
  toast.info(actionName ? `${actionName} (Coming Soon)` : 'Feature Coming Soon', {
    description: 'This action is scheduled for the upcoming production release.',
  });
}
