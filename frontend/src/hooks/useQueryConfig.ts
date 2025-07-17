import { CardQueryParams } from "@/types/card.type";
import useQueryParams from "./useQueryParams";
import { isUndefined, omitBy } from "lodash";

export type QueryConfig = {
  [key in keyof CardQueryParams]: string;
};
export default function useQueryConfig() {
  const queryParams: QueryConfig = useQueryParams();
  const queryConfig: QueryConfig = omitBy(
    {
      q: queryParams.q,
      page: queryParams.page || "1",
      filter: queryParams.filter,
      sortOrder: queryParams.sortOrder,
      sortBy: queryParams.sortBy,
    },
    isUndefined
  );
  return queryConfig;
}
