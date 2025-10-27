import userApi from "@/apis/user.api";
import { useQuery } from "@tanstack/react-query";
import { useAuthenticatedStore } from "@/stores/useAuthenticatedStore";

export default function useUserStatistic() {
  const isAuthenticated = useAuthenticatedStore(
    (state) => state.isAuthenticated
  );
  const { data: dataUserStats, isPending } = useQuery({
    queryKey: ["stats"],
    queryFn: () => userApi.getStats(),
    enabled: isAuthenticated,
  });

  return { dataUserStats, isPending };
}
