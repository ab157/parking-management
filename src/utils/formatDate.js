import { format, parse } from "date-fns";

// To convert date from (06:00 AM) to a timestamp using respective date
export const convertTimeStringToTimeStamp = (timeIn12Hr, forDate) => {
  const date = parse(timeIn12Hr, "hh:mm a", new Date(forDate));
  return date.getTime(); // returns timestamp
};

// Converts timestamp into a (hh:mm a) format
export const convertTimeStampToAMPM = (timestamp) => {
  const timeString = format(new Date(timestamp), "hh:mm a");
  return timeString;
};
