import { api } from "../util/api";

export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/autho/login", { email, password });
    return response;
  } catch (error) {
    throw error;
  }
};

const clearLoginUserInfo = () => {
  const items = [
    "USER",
    "LOGIN_ID",
    "TOKEN",
    "IS_ADMIN",
    "ORDER_PAGE_고객",
    "REVIEW_PAGE_고객",
    "ORDER_PAGE_WORKER",
    "WORKER_TAB",
    "SOAP_SHAPE_TAB",
    "SOAP_INTRO_TAB",
  ];

  items.push("IS_WORKER");

  items.forEach((item) => {
    localStorage.removeItem(item);
  });
};

export const logoutUser = () => {
  clearLoginUserInfo();
  window.dispatchEvent(new Event("logoutEvt"));
}

export const verifyEmail = async (token) => {
  try {
    const response = await api.get(`/autho/email_address?token=${token}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};