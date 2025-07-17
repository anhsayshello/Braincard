import { useAuthenticatedStore } from "@/stores/useAuthenticatedStore";
import { useProfileStore } from "@/stores/useProfileStore";

export default function useReset() {
  const setIsAuthenticated = useAuthenticatedStore(
    (state) => state.setIsAuthenticated
  );
  const setProfile = useProfileStore((state) => state.setProfile);
  const reset = () => {
    setIsAuthenticated(false);
    setProfile(null);
  };

  return reset;
}
