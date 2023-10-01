import moment from "moment";

export const toRupiah = (value: number, withSymbol: boolean = true): string =>
  `${withSymbol ? "Rp" : ""}${value
    .toString()
    .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}`;

export const toNumber = (value: string): number =>
  Number(value.replaceAll(/[^0-9]/g, ""));

export const toFormattedDate = (
  value: Date,
  asToday: boolean = false
): string => {
  if (asToday && value.toDateString() == new Date().toDateString())
    return "Hari ini";

  return moment(value).format("DD/MM/YYYY");
};

export const toFormattedTime = (value: Date): string => {
  const timezoneOffset = -value.getTimezoneOffset() / 60;
  let displayedTimezone = "";
  if (timezoneOffset == 7) {
    displayedTimezone = " WIB";
  } else if (timezoneOffset == 8) {
    displayedTimezone = " WITA";
  } else if (timezoneOffset == 9) {
    displayedTimezone = " WIT";
  }

  return `${moment(value).format("HH:mm")}${displayedTimezone}`;
};

export const toFormattedDateTime = (value: Date): string => {
  return `${toFormattedDate(value)} ${toFormattedTime(value)}`;
};
