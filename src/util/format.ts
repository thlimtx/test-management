import moment from "moment";

export const jsonParse = (data: any) => {
  return JSON.parse(JSON.stringify(data));
};

export const formatDate = (date: any, format?: string) => {
  return date ? moment(date).format(format ?? "DD/MM/YYYY") : "-";
};

export const formatDuration = (time: any, format?: any) => {
  const duration = time
    ? moment.duration(time, format ?? "milliseconds").toISOString()
    : "-";
  const durationDisplay = duration
    .replace("P", "")
    .replace("T", "")
    .replace("H", ":")
    .replace("M", ":")
    .replace("S", "");
  return durationDisplay;
};

export const formateRuntime = (curValue: any, targetValue: any) => {
  return (
    formatDuration(moment(curValue).diff(targetValue))
      .split(".")[0]
      .replace(":", "m") + "s"
  );
};
