export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

type DateString = Date | number | string;

export const getDefaultDateValue = (date: DateString) => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};
