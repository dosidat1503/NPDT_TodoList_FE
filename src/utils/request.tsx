import axios from "axios";
import Cookies from "js-cookie";
import { logout } from "../components/Layouts/DefaultLayout/Sidebar/sidebar";
import { setToken } from "../pages/Login/Login";

interface RefreshToken {
  access_token: string;
  expires_in: number;
}

const request = axios.create({
  baseURL: "http://localhost:8000/",
  headers: {
    "Content-Type": "application/json",
  },
});

request.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

request.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      request
        .post<RefreshToken>("/api/refresh", {
          refreshToken: Cookies.get("refreshToken"),
        })
        .then((res) => {
          const { access_token, expires_in } = res.data;

          setToken({
            token: access_token,
            expiresIn: expires_in,
            type: "accessToken",
          });

          request.defaults.headers.common["Authorization"] =
            `Bearer ${res.data.access_token}`;
        })
        .catch((error) => {
          throw error;
        });

      return request(originalRequest);
    } else if (originalRequest._retry) {
      logout();
    }
  },
);

export default request;
