import axios, { HttpStatusCode } from "axios";
import { logoutUser } from "../auth/AuthService";
import {
  clearTokens,
  getStorage,
  getStorageToken,
  storeJWT,
} from "./utilities";

const prefix = "http://localhost:9193/api/s1";

export const api = axios.create({
  baseURL: prefix,
});

export const apic = axios.create({
  baseURL: prefix,
  withCredentials: true,
});

// refresh 토큰으로 새 AT 발급 요청
const refreshAccessToken = async () => {
  const refreshToken =
    localStorage.getItem("REFRESH") || sessionStorage.getItem("REFRESH");

  if (!refreshToken) throw new Error("No refresh token");

  try {
    // RT를 Authorization 헤더가 아닌 별도로 전달 (또는 쿠키에 자동 포함)
    const response = await axios.post(`${prefix}/autho/refresh_token`, {
      refreshToken: refreshToken,
    });
    const save_login = "true" === localStorage.getItem("SAVE_LOGIN");
    storeJWT(response.data, save_login);

    return response.data.data.token;
  } catch (error) {
    // 갱신 실패 (RT 만료, 무효 등)
    clearTokens();
    throw error;
  }
};

// 빌드 헬퍼
function buildConfig(method, urlSuffix, data, token) {
  const config = {
    method,
    url: `${prefix}${urlSuffix}`,
    headers: { Authorization: `Bearer ${token}` },
  };
  if (data) {
    config.data = data;
    if (!(data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }
  }
  return config;
}

const isExpired = (token) => {
  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload.exp * 1000 <= Date.now();
};

export async function callWithToken(method, urlSuffix, data = null) {
  const originalRequest = async (token) => {
    const config = buildConfig(method, urlSuffix, data, token);
    return await axios(config);
  };

  try {
    let token = getStorageToken();

    if (token && isExpired(token)) {
      const storage = getStorage();
      storage.removeItem("TOKEN");
    }

    if (!token) {
      console.log("tokens refreshed");
      token = await refreshAccessToken();
    }
    return await originalRequest(token);
  } catch (err) {
    console.error("callWithToken 오류: ", err);
    // 401 Unauthorized state 때, 갱신 후, 요청 재시도
    if (err.response?.status === HttpStatusCode.Unauthorized) {
      try {
        const newToken = await refreshAccessToken();
        console.log("두 토큰 리프레시 성공 :-)");
        // 갱신 성공 시 원래 요청 재시도
        return await originalRequest(newToken);
      } catch (refreshError) {
        // 갱신 실패 -> 로그아웃
        logoutUser({ path: "/login", message: "인증이 만료되었습니다." });
        return null;
      }
    }
    throw err;
  }
}
