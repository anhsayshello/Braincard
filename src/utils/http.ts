import axios, { AxiosInstance, HttpStatusCode } from "axios";
import config from "@/constants/config";
import {
  URL_GOOGLELOGIN,
  URL_LOGOUT,
  URL_REGISTER,
  URL_USERNAMELOGIN,
} from "@/apis/auth.api";
import AuthResponse from "@/types/auth.type";
import { authService } from "@/services/authService";
import { useAccessTokenStore } from "@/stores/useAccessTokenStore";

class Http {
  instance: AxiosInstance;
  constructor() {
    this.instance = axios.create({
      baseURL: config.baseUrl,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });
    this.instance.interceptors.request.use(
      async (config) => {
        await useAccessTokenStore.persist.rehydrate();
        const access_token = useAccessTokenStore.getState().access_token;
        if (access_token) {
          config.headers.Authorization = `Bearer ${access_token}`;
        }
        return config;
      },
      function (error) {
        return Promise.reject(error);
      }
    );

    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config;
        if (
          url === URL_USERNAMELOGIN ||
          url?.includes(URL_GOOGLELOGIN) ||
          url === URL_REGISTER
        ) {
          const data = response.data as AuthResponse;
          console.log(data);
          if (data.access_token) {
            authService.setAuthData(data);
          }
        } else if (url === URL_LOGOUT) {
          authService.clearAuthData();
        }
        return response;
      },
      function (error) {
        if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          // const data: any | undefined = error.response?.data;
          console.log(error);
          // const message = data?.message || error.message;
          // toast.error(data.error || message);
        }
        if (error.response?.status === HttpStatusCode.Unauthorized) {
          authService.clearAuthData();
        }
        return Promise.reject(error);
      }
    );
  }
}

const http = new Http().instance;
export default http;
