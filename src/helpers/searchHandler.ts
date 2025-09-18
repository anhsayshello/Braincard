import { QueryConfig } from "@/hooks/useQueryConfig";
import {
  createSearchParams,
  Location,
  NavigateOptions,
  To,
} from "react-router";

const searchHandler = ({
  queryConfig,
  pathName,
  navigate,
  location,
}: {
  queryConfig: QueryConfig;
  pathName: string;
  navigate: (to: To, options?: NavigateOptions) => void | Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  location?: Location<any>;
}) => {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.trim();
    const { deckName } = location?.state || {};

    if (searchValue !== queryConfig.q) {
      navigate(
        {
          pathname: pathName,
          search: createSearchParams({
            ...queryConfig,
            q: searchValue,
          }).toString(),
        },
        {
          state: { deckName },
        }
      );
    }
  };
};

export default searchHandler;
