import moment from "moment";

export const today = moment().startOf("day");

/**
 * Get format string for local date or local datetime with minute precision.
 * @param value date or datetime string
 */
export const dateOrDatetimeFormat = (value: string) => {
  let format = "DD/MM/YYYY HH:mm";

  if (value.length === 10) {
    format = "DD/MM/YYYY";
  }
  return format;
};

/**
 * Parse dateTime (date or datetime with minute precision) string into Date
 * @param value date or datetime string
 */
export const parseDateTime = (value: string) => {
  return moment(value, dateOrDatetimeFormat(value), true);
};
