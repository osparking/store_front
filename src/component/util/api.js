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
    console.error("erro:", err);
    if (
      err.response.status === HttpStatusCode.Forbidden ||
      err.response.status === HttpStatusCode.Unauthorized
    ) {
      toast.error(err?.response?.data.message);
      return null;
    } else if (
      err.response.status === HttpStatusCode.InternalServerError &&
      err.response.data.message.includes("JWT expired")
    ) {
      logoutUser({path: "/login", message: "인증이 만료되었습니다."});
      throw err;
    } else {
      throw err;
    }
  }
}
