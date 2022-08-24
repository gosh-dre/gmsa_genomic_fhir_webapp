import { DateTime } from "luxon";

export const today = DateTime.now().startOf("day");

/**
 * Get format string for local date or local datetime with minute precision.
 * @param value date or datetime string
 */
export const dateOrDatetimeFormat = (value: string) => {
  let format = "dd/MM/yyyy HH:mm";

  if (value.length === 10) {
    format = "dd/MM/yyyy";
  }
  return format;
};

/**
 * Parse dateTime (date or datetime with minute precision) string into Date
 * @param value date or datetime string
 */
export const parseDateTime = (value: string) => {
  return DateTime.fromFormat(value, dateOrDatetimeFormat(value));
};
