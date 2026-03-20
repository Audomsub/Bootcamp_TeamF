import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return `${new Intl.NumberFormat('th-TH').format(amount)}  บาท`;
}

export function formatDate(date: string | null | undefined): string {
  if (!date) return '-';
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '-';
    return new Intl.DateTimeFormat('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(d);
  } catch {
    return '-';
  }
}

export function formatDateTime(date: string | null | undefined): string {
  if (!date) return '-';
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '-';
    return new Intl.DateTimeFormat('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return '-';
  }
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

export function getImageUrl(path: string | null | undefined): string {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
}
