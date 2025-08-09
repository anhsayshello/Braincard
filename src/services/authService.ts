import { useAccessTokenStore } from "@/stores/useAccessTokenStore";
import { useProfileStore } from "@/stores/useProfileStore";
import AuthResponse from "@/types/auth.type";

export const authService = {
  setAuthData(authResponse: AuthResponse) {
    if (authResponse.access_token) {
      useAccessTokenStore.getState().setAccessToken(authResponse.access_token);
      useProfileStore.getState().setProfile(authResponse.user);
    }
  },

  clearAuthData() {
    useAccessTokenStore.getState().setAccessToken(null);
    useProfileStore.getState().setProfile(null);
  },
};
