import User from "@/types/user.type";
import { persist } from "zustand/middleware";

import { create } from "zustand";

type ProfileStore = {
  profile: User | null;
  setProfile: (newProfile: User | null) => void;
};

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      profile: null,
      setProfile: (newProfile) => set({ profile: newProfile }),
    }),
    {
      name: "profile",
    }
  )
);
