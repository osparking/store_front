import axios, { HttpStatusCode } from "axios";
import { logoutUser } from "../auth/AuthService";
import { getStorage, getStorageToken, storeJWT } from "./utilities";

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
    if (response.data?.data?.token) {
      storeJWT(response.data);
      
      return response.data.data.token;
    }
    throw new Error("New access token not received");
  } catch (error) {
    // 갱신 실패 (RT 만료, 무효 등)
    logoutUser({ path: "/login", message: "로그인 유지 기간 만료" });
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
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  // 2. 패딩 추가 (4의 배수가 되도록)
  const pad = base64.length % 4;
  if (pad) {
    base64 += '='.repeat(4 - pad);
  }
  return base64;
};

const isExpired = (token) => {
  try {
    const base64Payload = token.split('.')[1]; // 페이로드 부분 추출
    const standardBase64 = base64UrlToBase64(base64Payload);
    const payload = JSON.parse(atob(standardBase64));
    return payload.exp * 1000 <= Date.now();
  } catch (e) {
    console.error('토큰 디코딩 실패:', e);
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

    // 만료된 토큰은 즉시 삭제
    if (token && isExpired(token)) {
      const storage = getStorage();
      storage.removeItem("TOKEN");
      token = null;
    }

    // 토큰이 없는 경우 (만료 포함) 리프레시 시도
    if (!token) {
      // 이미 진행 중인 리프레시가 있다면 그것을 재사용
      if (!refreshPromise) {
        // 진행 중인 리프레시가 없으면 새로 시작하고, 결과를 Promise에 저장
        refreshPromise = refreshAccessToken()
          .then((newToken) => {
            // 서버에서 새 토큰을 받으면 스토리지에 저장 (다른 곳에서도 사용 가능하도록)
            const storage = getStorage();
            storage.setItem("TOKEN", newToken);
            return newToken; // 다음 .then / await 에게 전달
          })
          .finally(() => {
            // 성공/실패 여부와 상관없이, 요청이 끝나면 캐시된 Promise를 비움
            // (실패 시 다음 요청이 다시 시도할 수 있도록)
            refreshPromise = null;
          });
      }
      // 캐싱된 Promise(새로 시작했거나 기존 것)가 완료될 때까지 대기
      token = await refreshPromise;
    }
    return token;
  };

  try {
    // 유효한 토큰 획득 (내부적으로 중복 리프레시 방지됨)
    const token = await getValidToken();
    return await originalRequest(token);
  } catch (err) {
    console.error("callWithToken 오류: ", err);

    // 401 발생 시 (토큰이 검증 단계에서 실패한 경우) 재시도
    if (err.response?.status === HttpStatusCode.Unauthorized) {
      try {
        // 재시도 시에도 동일하게 중복 리프레시 방지 로직을 태움
        // (혹시 모를 경쟁 상태를 대비해 getValidToken 재사용)
        const newToken = await getValidToken(); 
        return await originalRequest(newToken);
      } catch (error) {
        if (error.response?.status === HttpStatusCode.Unauthorized) {
          // 리프레시 자체가 401(리프레시 토큰 만료 등)이면 로그아웃
          logoutUser({ path: "/login", message: "로그인 유지 기간 만료" });
        }
        return error;
      }
    }

    // 그 외 오류 (403 등)는 로그아웃 처리
    logoutUser({ path: "/login", message: "접근 권한 위반 오류" });
    throw err;
  }
}