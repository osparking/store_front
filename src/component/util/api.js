import axios, { HttpStatusCode } from "axios";
import toast from "react-hot-toast";
import { logoutUser } from "../auth/AuthService";
import { getStorageToken } from "./utilities";

const prefix = "http://localhost:9193/api/s1";

export const api = axios.create({
  baseURL: prefix,
});

export const apic = axios.create({
  baseURL: prefix,
  withCredentials: true,
});

export async function callWithToken(method, urlSuffix, data = null) {
  try {
    const token = getStorageToken();

    if (!token) {
      window.location.href = "/login";
    } else {
      const backendUrl = `${prefix}${urlSuffix}`;

      console.log("backendUrl: ", backendUrl);
      let config = {
        method: method,
        url: backendUrl,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      if (data) {
        config = {
          method: method,
          url: `${prefix}${urlSuffix}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: data,
          withCredentials: true,
        };
        if (!(data instanceof FormData)) {
          config.headers["Content-Type"] = "application/json";
        }
      }
      const result = await axios(config);
      return result;
    }
  } catch (err) {
    console.error("callWithToken 오류: ", err);
    if (err.response?.status === HttpStatusCode.Forbidden) {
      toast.error("금지된 요청 - " + err?.response?.data.message);
      return null;
    } else if (
      err.status === HttpStatusCode.Unauthorized      
    ) {
      let message = "인증 오류. 내용: 콘솔 확인";
      
      if (err.response.data.message.includes("JWT가 만료")) {
        message = "인증이 만료되었습니다.";
      } else {
        console.error("자격 오류: " + err?.response?.data.message);
      }
      logoutUser({ path: "/login", message: message  });
      return null;
    } else if (err.response?.status === HttpStatusCode.InternalServerError) {
      toast.error("서버 오류 - " + err?.response?.data.message);
      throw err;
    } else {
      throw err;
    }
  }
}
