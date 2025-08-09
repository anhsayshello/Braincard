import { persist } from "zustand/middleware";

import { create } from "zustand";

type AccessTokenStore = {
  access_token: string | null;
  setAccessToken: (access_token: string | null) => void;
};

export const useAccessTokenStore = create<AccessTokenStore>()(
  persist(
    (set) => ({
      access_token: null,
      setAccessToken: (newAccessToken) => set({ access_token: newAccessToken }),
    }),
    {
      name: "access_token",
    }
  )
);
