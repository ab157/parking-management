import { format, parse } from "date-fns";

export const convertTimeStringToTimeStamp = (timeIn12Hr, forDate) => {
  const date = parse(timeIn12Hr, "hh:mm a", new Date(forDate));
  return date.getTime();
};

export const convertTimeStampToAMPM = (timestamp) => {
  const timeString = format(new Date(timestamp), "hh:mm a");
  return timeString;
};
