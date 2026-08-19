import axios, { HttpStatusCode } from "axios";
import { logoutUser } from "../auth/AuthService";
import { getStorage, getStorageToken, storeJWtoken } from "./utilities";

axios.defaults.withCredentials = true; // 모든 요청에 쿠키 포함
axios.defaults.headers.common["Content-Type"] = "application/json";

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
  try {
    // RT 제출 방식 - Authorization 헤더 대신 쿠키에 자동 포함
    const response = await axios.post(`${prefix}/autho/refresh_token`, null, {
      withCredentials: true,
    });
    const aToken = response.data?.data?.token;

    if (aToken) {
      storeJWtoken(aToken);
      return aToken;
    }
  } catch (error) {
    const msg = error.response?.data.message;
    
    // AT 갱신 실패 원인: RT 미제출, RT 취소(revoke), RT 만료
    if (msg === "RT_MISSING" || msg === "RT_REVOKED_OR_EXPIRED") {
      logoutUser({ path: "/login", message: "로그인 유지 기간 만료" });
    } else {
      return null;
    }
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
    config.withCredentials = true;
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
  if (!token) return true;

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
let refreshPromise = null;

export async function callWithToken(method, urlSuffix, data = null) {
  const originalRequest = async (token) => {
    const config = buildConfig(method, urlSuffix, data, token);
    return await axios(config);
  };

  // 1. 유효한 토큰을 가져오는 내부 함수 (캐싱된 리프레시 프로미스를 활용)
  const getValidToken = async () => {
    let token = getStorageToken();

    // 만료된 토큰 제거
    if (isExpired(token)) {
      const storage = getStorage();
      storage.removeItem("TOKEN");
      token = null;
    }

    if (!token) {
      // 토큰이 없는 경우 리프레싱
      if (!refreshPromise) {
        refreshPromise = (async () => {
          try {
            const newToken = await refreshAccessToken();

            if (newToken) {
              const storage = getStorage();
              storage.setItem("TOKEN", newToken);
              return newToken;
            }
            return null; // 도달 불가?
          } finally {
            refreshPromise = null;
          }
        })();
      }
      token = await refreshPromise;
    }
    return token;
  };

  try {
    // 유효한 토큰 획득 (내부적으로 중복 리프레시 방지됨)
    const token = await getValidToken();
    if (token) {
      return await originalRequest(token);
    }
  } catch (err) {
    console.error("callWithToken 오류: ", err);

    // 401 발생 시 (토큰이 검증 단계에서 실패한 경우) 재시도
    if (err.response?.status === HttpStatusCode.Unauthorized) {
      try {
        // 재시도 시에도 동일하게 중복 리프레시 방지 로직을 태움
        // (혹시 모를 경쟁 상태를 대비해 getValidToken 재사용)
        const newToken = await getValidToken();
        if (newToken) {
          return await originalRequest(newToken);
        }
      } catch (error) {
        if (error.response?.status === HttpStatusCode.Unauthorized) {
          // 리프레시 자체가 401(리프레시 토큰 만료 등)이면 로그아웃
          logoutUser({ path: "/login", message: "로그인 유지 기간 만료" });
        }
        return error;
      }
    }

    // 그 외 오류 (403 등)는 로그아웃 처리
    // logoutUser({ path: "/login", message: "접근 권한 위반 오류" });
    throw err;
  }
}
