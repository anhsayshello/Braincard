import userApi from "@/apis/user.api";
import { useAuthenticatedStore } from "@/stores/useAuthenticatedStore";
import { useProfileStore } from "@/stores/useProfileStore";
import { useQuery } from "@tanstack/react-query";

const useUserQuery = () => {
  const isAuthenticated = useAuthenticatedStore(
    (state) => state.isAuthenticated
  );
  const profile = useProfileStore((state) => state.profile);
  console.log(profile, "profile store");

  return useQuery({
    queryKey: ["me", profile?.id],
    queryFn: () => userApi.getMe(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
};
export default useUserQuery;
