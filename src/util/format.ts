import moment from "moment";

export const jsonParse = (data: any) => {
  return JSON.parse(JSON.stringify(data));
};

export const formatDate = (date: any, format?: string) => {
  return moment(date).format(format ?? "DD/MM/YYYY");
};
