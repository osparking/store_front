import axios, { HttpStatusCode } from "axios";
import { logoutUser } from "../auth/AuthService";
import { TokenRefreshingError } from "./errors";
import { getAccessToken, setAccessToken } from "./tokenStore";
import { getStorage } from "./utilities";

axios.defaults.withCredentials = true; // 모든 요청에 쿠키 포함
axios.defaults.headers.common["Content-Type"] = "application/json";

// 환경변수로 바꿔줍니다
const prefix = import.meta.env.VITE_API_BASE_URL + "/s1";

export const api = axios.create({
  baseURL: prefix,
});

// refresh 토큰으로 새 AT 발급 요청
const refreshAccessToken = async (): Promise<string> => {
  try {
    // RT 제출 방식 - Authorization 헤더 대신 쿠키에 자동 포함
    const response = await axios.post(`${prefix}/autho/refresh_token`, null, {
      withCredentials: true,
    });
    const aToken: string = response.data.data.token;

    setAccessToken(aToken);
    return aToken;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const msg = error.response?.data?.message;

      if (msg === "RT_MISSING" || msg === "RT_REVOKED_OR_EXPIRED") {
        throw new TokenRefreshingError("RT_EXPIRED", msg);
      }
    }
    throw error;
  }
};

// 1. 유효한 토큰을 가져오는 내부 함수 (캐싱된 리프레시 프로미스를 활용)
const getValidToken = async () => {
  let token = getAccessToken();

  // 토큰 부재 혹은 만료 > 제거
  if (!token || isExpired(token)) {
    if (token) {
      // 내가 읽은 토큰이 여전히 저장된 그 토큰일 때만 제거
      // (다른 요청이 이미 갱신했을 수 있음)
      const storage = getStorage();

      if (storage.getItem("TOKEN") === token) {
        storage.removeItem("TOKEN");
      }
    }
    token = null;
  }

  if (!token) {
    if (!refreshPromise) {
      refreshPromise = (async () => {
        try {
          const newToken = await refreshAccessToken();
          return newToken;
        } finally {
          refreshPromise = null;
        }
      })();
    }
    token = await refreshPromise; // 실패 시 Error 호출부로 전파
  }

  return token; // 항상 string
};

// 빌드 헬퍼
function buildConfig<T extends Record<string, unknown>>(
  method: string,
  urlSuffix: string,
  token: string,
  data?: T,
) {
  const config: {
    method: string;
    url: string;
    headers: Record<string, string>;
    data?: T;
  } = {
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

const base64UrlToBase64 = (str) => {
  // 1. URL-safe 문자를 표준 Base64 문자로 치환
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  // 2. 패딩 추가 (4의 배수가 되도록)
  const pad = base64.length % 4;
  if (pad) {
    base64 += "=".repeat(4 - pad);
  }
  return base64;
};

const isExpired = (token) => {
  try {
    const base64Payload = token.split(".")[1]; // 페이로드 부분 추출
    const standardBase64 = base64UrlToBase64(base64Payload);
    const payload = JSON.parse(atob(standardBase64));
    return payload.exp * 1000 <= Date.now();
  } catch (e) {
    console.error("토큰 디코딩 실패:", e);
    return true;
  }
};

// 모듈 최상단에 공유 변수 선언 (파일 외부로 export 불필요)
let refreshPromise: Promise<string> | null = null;

export async function callWithToken<T extends Record<string, unknown>>(
  method: string,
  urlSuffix: string,
  data?: T,
) {
  const originalRequest = async (token: string) => {
    const config = buildConfig(method, urlSuffix, token, data);
    return await axios(config);
  };

  try {
    // 유효한 토큰 획득 (내부적으로 중복 리프레시 방지됨)
    const token = await getValidToken();

    return await originalRequest(token);
  } catch (error) {
    if (error instanceof TokenRefreshingError) {
      logoutUser({ path: "/login", message: "로그인 유지 기간 만료" });
    } else if (error.response?.status === HttpStatusCode.Unauthorized) {
      logoutUser({ path: "/login", message: "로그인 필요 자원 요청" });
    }
    throw error;
  }
}
