export const toRupiah = (value: number): string =>
  "Rp" + value.toLocaleString("en-GB");

export const toNumber = (value: string): number =>
  Number(value.replaceAll(/[^0-9]/g, ""));

export const toFormattedDate = (
  value: Date,
  asToday: boolean = false
): string => {
  if (asToday && value.toDateString() == new Date().toDateString())
    return "Hari ini";

  return value.toLocaleDateString("id", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
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

  return `${value.toLocaleTimeString("en-gb", {
    hour: "numeric",
    minute: "numeric",
  })}${displayedTimezone}`;
};
