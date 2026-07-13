import { api } from "../util/api";

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
  const items = [
    "ADMIN_TAB",
    "CURR_INGRE_PAGE",
    "DASHBOARD_TAB",
    "INGRE_NAME",
    "IS_ADMIN",
    "LOGIN_ID",
    "ORDER_ACTION",
    "ORDER_ID",
    "ORDER_ID_TOSS",
    "ORDER_PAGE_고객",
    "ORDER_PAGE_WORKER",
    "QUESTION_PAGE_관리",
    "QUESTION_PAGE",
    "REVIEW_PAGE_고객",
    "REVIEW_PAGE_CUSTOMER",
    "SAVE_LOGIN",
    "TOKEN",
    "USER",
    "WORKER_TAB",
  ];

  items.push("IS_WORKER");

  items.forEach((item) => {
    localStorage.removeItem(item);
  });

  sessionStorage.removeItem("TOKEN");
};

export const logoutUser = (detail) => {
  clearLoginUserInfo();
  window.dispatchEvent(
    new CustomEvent("logoutEvt", { detail: detail }),
  );
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
