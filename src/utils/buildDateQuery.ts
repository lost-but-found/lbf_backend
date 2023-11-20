import moment from "moment";
// buildDateFilter function definition
export default function buildDateFilter({
  date_from,
  date_to,
}: {
  date_from?: string;
  date_to?: string;
}): any {
  const filter: any = {};

  if (date_from) {
    filter.date = {
      ...filter.date,
      $gte: moment(date_from).startOf("day").toDate(),
    };
  }

  if (date_to) {
    filter.date = {
      ...filter.date,
      $lte: moment(date_to).endOf("day").toDate(),
    };
  }

  return filter;
}
