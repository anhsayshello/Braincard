import User from "@/types/user.type";

export const setAccessTokenToLS = (access_token: string) =>
  localStorage.setItem("access_token", access_token);
export const getAccessTokenFromLS = () =>
  localStorage.getItem("access_token") || "";

export const setProfileToLS = (profile: User) =>
  localStorage.setItem("profile", JSON.stringify(profile));
export const getProfileFromLS = () => {
  const result = localStorage.getItem("profile");
  return result ? JSON.parse(result) : null;
};

export const localStorageEventTarget = new EventTarget();
export const clearLS = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("profile");
  const clearLSEvent = new Event("clearLS");
  localStorageEventTarget.dispatchEvent(clearLSEvent);
};
