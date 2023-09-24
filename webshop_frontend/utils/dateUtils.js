import { format } from "date-fns";

export const formatDate = (date) => {
  return format(new Date(date), "dd.MM.yyyy");
};

export const formatTime = (date) => {
  return format(new Date(date), "HH:mm");
};

export const formatDateTime = (date) => {
  return format(new Date(date), "dd.MM.yyyy HH:mm");
};
