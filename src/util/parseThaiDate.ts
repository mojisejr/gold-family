import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export const parseThaiDate = (date: Date) => {
  const currentDate = dayjs(date);
  const thisYear = currentDate.add(543, 'year');
  const formattedDate = thisYear.format('DD/MM/YYYY');
  return formattedDate;
};

export const getFormattedDate = (date: Date) => {
  const currentDate = dayjs(date).format('YYYY-MM-DD');
  return currentDate;
};
