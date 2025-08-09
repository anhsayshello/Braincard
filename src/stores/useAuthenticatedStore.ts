import { create } from "zustand";
import { useAccessTokenStore } from "./useAccessTokenStore";

type AuthenticatedStore = {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
};

export const useAuthenticatedStore = create<AuthenticatedStore>((set) => ({
  isAuthenticated: false,
  setIsAuthenticated: (nextIsAuthenticated) =>
    set({ isAuthenticated: nextIsAuthenticated }),
}));

useAccessTokenStore.subscribe((state, prevState) => {
  const wasAuthenticated = Boolean(prevState.access_token);
  const isAuthenticated = Boolean(state.access_token);

  if (wasAuthenticated !== isAuthenticated) {
    useAuthenticatedStore.getState().setIsAuthenticated(isAuthenticated);
  }
});

const initialToken = useAccessTokenStore.getState().access_token;
useAuthenticatedStore.getState().setIsAuthenticated(Boolean(initialToken));
