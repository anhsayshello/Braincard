import userApi from "@/apis/user.api";
import { useAuthenticatedStore } from "@/stores/useAuthenticatedStore";
import { useQuery } from "@tanstack/react-query";

const useUserQuery = () => {
  const isAuthenticated = useAuthenticatedStore(
    (state) => state.isAuthenticated
  );

  return useQuery({
    queryKey: ["me"],
    queryFn: () => userApi.getMe(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
};
export default useUserQuery;
