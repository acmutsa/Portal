import { differenceInDays } from "date-fns";

export const absUrl = (path: string): string => {
  path = path.trim();
  if (path.startsWith("http")) return path;
  if (path.indexOf("/") === 0) path = path.substring(1);

  const appUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return `${appUrl}/${path}`;
};


export type Weekday = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

const weekdayIndex = {
  "sunday": 0,
  "monday": 1,
  "tuesday": 2,
  "wednesday": 3,
  "thursday": 4,
  "friday": 5,
  "saturday": 6
};

// Modifies a date object to become the nearest weekday as specified
export const moveToNearestWeekday = (date: Date, weekday: Weekday) => {
  const targetIndex = weekdayIndex[weekday];
  if (date.getDay() != targetIndex)
    date.setDate(date.getDate() - ((date.getDay() + (7 - targetIndex)) % 7));
};

// Does not operate in the future, startDate < endDate.
export const getDates = (step: number, startDate: Date, endDate: Date | null = null, weekday: Weekday | null = null) => {
  // If a weekday is specified, the first date returned will be of that weekday. If a step of 7 is used, then all will
  // be of that same weekday.
  if (weekday)
    moveToNearestWeekday(startDate, weekday);

  // If not specified, the endDate is assumed to be today. The end date is not guaranteed to be in the returned array.
  endDate = endDate ?? new Date();

  const weeks = Math.floor(differenceInDays(endDate, startDate) / 7);
  if (weeks <= 0)
    return [];


  const tempDate = new Date(startDate);
  return [tempDate, ...Array.apply(null, Array(weeks)).map((_, i: number) => {
    tempDate.setDate(tempDate.getDate() + 7);
    return new Date(tempDate);
  })];
};

export const sum = (a: number, b: number) => a + b;

export const generateGoogleCalendarLink = (title: string, description: string, location: string, start: Date, end: Date) => {
  title = title.replaceAll(" ", "+");
  description = description.replaceAll(" ", "+");
  location = location.replaceAll(" ", "+");
  const startString = new Date(start || "").toISOString().replace(/[^\w\s]/gi, '');
  const endString = new Date(end || "").toISOString().replace(/[^\w\s]/gi, '');
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${description}&dates=${startString}/${endString}&location=${location}`;
};