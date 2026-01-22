import axios, { HttpStatusCode } from "axios";
import { expiredTokenRemoved } from "./utilities";
import { Navigate, useNavigate } from "react-router-dom";

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
    const token = localStorage.getItem("TOKEN");
    if (token) {
      console.log("url: ", `${prefix}${urlSuffix}`);

      if (expiredTokenRemoved()) {
        window.location.href = "/login";
        return Promise.reject(new Error("Token expired"));
      }

      let config = {
        method: method,
        url: `${prefix}${urlSuffix}`,
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
            "Content-Type": "application/json",
          },
          data: data,
          withCredentials: true,
        };
      }
      const result = await axios(config);
      return result;
    } else {
      return null;
    }
  } catch (err) {
    console.error("erro:", err);
    if (
      err.response.status === HttpStatusCode.Forbidden ||
      err.response.status === HttpStatusCode.Unauthorized
    ) {
      return null;
    } else {
      throw err;
    }
  }
}
