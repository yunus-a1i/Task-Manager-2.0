import { format, isToday, isTomorrow, isPast, parseISO } from 'date-fns';

export const formatDate = (date) => {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM dd, yyyy');
};

export const formatDateTime = (date) => {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM dd, yyyy HH:mm');
};

export const getRelativeDate = (date) => {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  
  if (isToday(d)) return 'Today';
  if (isTomorrow(d)) return 'Tomorrow';
  if (isPast(d)) return 'Overdue';
  
  return formatDate(d);
};

export const isOverdue = (date) => {
  if (!date) return false;
  const d = typeof date === 'string' ? parseISO(date) : date;
  return isPast(d) && !isToday(d);
};