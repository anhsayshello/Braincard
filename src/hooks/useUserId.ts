import { useProfileStore } from "@/stores/useProfileStore";

export const useUserId = () => {
  const profile = useProfileStore((state) => state.profile);
  return profile ? profile.id : "";
};
