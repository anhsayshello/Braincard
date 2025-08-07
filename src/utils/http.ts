import axios, { AxiosInstance, HttpStatusCode } from "axios";
import config from "@/constants/config";
import {
  clearLS,
  getAccessTokenFromLS,
  setAccessTokenToLS,
  setProfileToLS,
} from "./auth";
import { URL_LOGIN, URL_LOGOUT, URL_REGISTER } from "@/apis/auth.api";
import AuthResponse from "@/types/auth.type";

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
      (config) => {
        const access_token = getAccessTokenFromLS();
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
        if (url === URL_LOGIN || url === URL_REGISTER) {
          const data = response.data as AuthResponse;
          if (data.access_token) {
            setAccessTokenToLS(data.access_token);
            setProfileToLS(data.user);
          }
        } else if (url === URL_LOGOUT) {
          clearLS();
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
          clearLS();
        }
        return Promise.reject(error);
      }
    );
  }
}

const http = new Http().instance;
export default http;
