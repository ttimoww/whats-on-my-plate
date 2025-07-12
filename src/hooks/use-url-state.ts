import { parseAsInteger, useQueryState } from "nuqs";

export function useUrlState() {
  return useQueryState("plate", parseAsInteger);
}
