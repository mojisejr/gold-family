import { DateTimeString } from 'src/interfaces/util/dateTimeString';

export const dateTimeExtranctor = (data: string) => {
  const pattern =
    /(\d{2}\/\d{2}\/\d{4}) เวลา (\d{2}:\d{2}) น\. \(ครั้งที่ (\d+)\)/;
  const match = pattern.exec(data);

  let result: DateTimeString;
  if (match) {
    result = {
      date: match[1],
      time: match[2],
      round: parseInt(match[3], 10),
    };
  }
  return result;
};
