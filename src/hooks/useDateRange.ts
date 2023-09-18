import { useState } from "react";

type DateRange = { start: Date; end: Date };

type useDateRangeReturnType = [DateRange, (d: Date) => void, (d: Date) => void];
const useDateRange = (props?: {
  start: Date;
  end: Date;
}): useDateRangeReturnType => {
  const today = new Date();
  let start = props ? props.start : today;
  let end = props ? props.end : today;

  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start,
    end,
  });
  const setStart = (value: Date) => {
    setDateRange((state) => ({
      ...state,
      start: new Date(value.setHours(0, 0, 0, 0)),
    }));
  };
  const setEnd = (value: Date) => {
    setDateRange((state) => ({
      ...state,
      end: new Date(value.setHours(23, 59, 59, 999)),
    }));
  };

  return [dateRange, setStart, setEnd];
};

export default useDateRange;
