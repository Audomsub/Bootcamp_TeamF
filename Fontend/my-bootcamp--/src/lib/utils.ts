import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string): string {
  return new Intl.DateTimeFormat('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'pending':
      return 'badge-pending';
    case 'approved':
    case 'completed':
      return 'badge-approved';
    case 'rejected':
      return 'badge-rejected';
    case 'shipped':
      return 'badge-shipped';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function generateOrderNumber(): string {
  return 'ORD-' + Date.now().toString(36).toUpperCase();
}
