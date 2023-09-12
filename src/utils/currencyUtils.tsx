export const toRupiah = (value: number): string =>
  "Rp" + value.toLocaleString("en-GB");

export const toNumber = (value: string): number =>
  Number(value.replaceAll(/[^0-9]/g, ""));
