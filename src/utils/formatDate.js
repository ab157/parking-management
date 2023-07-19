import { format } from "date-fns";

export const formatDate = (date, style) => {
  return format(new Date(date), style);
};
