import { getAccessTokenFromLS } from "@/utils/auth";
import { create } from "zustand";

type AuthenticatedStore = {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
};

export const useAuthenticatedStore = create<AuthenticatedStore>((set) => ({
  isAuthenticated: Boolean(getAccessTokenFromLS()),
  setIsAuthenticated: (nextIsAuthenticated) =>
    set({ isAuthenticated: nextIsAuthenticated }),
}));
