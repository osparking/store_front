import { api } from "../util/api";
import { removeUserKeys } from "../util/utilities";

export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/autho/login", { email, password });
    return response;
  } catch (error) {
    if (error.code === "ERR_NETWORK") {
      alert("네트워크 오류");
    }
    throw error;
  }
};

export async function getEmailViaToken(token) {
  try {
    const url = `/autho/email?token=${token}`;
    const result = await api.get(url);
    return result.data;
  } catch (err) {
    throw err;
  }
}

export const clearLoginUserInfo = () => {
  removeUserKeys();
  sessionStorage.clear();
};

export const logoutUser = async (detail) => {
  try {
    await api.post('/autho/logout');
    if (localStorage.getItem("LOGIN_ID")) {
      window.dispatchEvent(new CustomEvent("logoutEvt", { detail: detail }));
    }
    clearLoginUserInfo();
  } catch(error) {
    throw error;
  }
};

export const verify_token = async (token) => {
  const url = `/autho/verify_token?token=${token}`;
  try {
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyEmail = async (token) => {
  try {
    const response = await api.get(`/autho/email_address?token=${token}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
