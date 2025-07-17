import User from "@/types/user.type";
import { getProfileFromLS } from "@/utils/auth";
import { create } from "zustand";

type ProfileStore = {
  profile: User | null;
  setProfile: (newProfile: User | null) => void;
};

export const useProfileStore = create<ProfileStore>((set) => ({
  profile: getProfileFromLS(),
  setProfile: (newProfile) => set({ profile: newProfile }),
}));
