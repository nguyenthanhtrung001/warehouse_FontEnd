// utils/FormattedDate.ts
import { format } from 'date-fns';

export const formatDate = (date: Date) => {
  return format(date, 'dd/MM/yyyy - HH:mm:ss');
};
