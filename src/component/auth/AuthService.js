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

const clearLoginUserInfo = () => {
  const items = [
    "ADMIN_TAB",
    "DASHBOARD_TAB",
    "IS_ADMIN",
    "LOGIN_ID",
    "ORDER_PAGE_고객",
    "ORDER_PAGE_WORKER",
    "QUESTION_PAGE_관리",
    "QUESTION_PAGE",
    "REVIEW_PAGE_고객",
    "REVIEW_PAGE_CUSTOMER",
    "SOAP_INTRO_TAB",
    "SOAP_SHAPE_TAB",
    "TOKEN",
    "USER",
    "WORKER_TAB",
  ];

  items.push("IS_WORKER");

  items.forEach((item) => {
    localStorage.removeItem(item);
  });
};

export const logoutUser = () => {
  clearLoginUserInfo();
  window.dispatchEvent(new Event("logoutEvt"));
};

export const verifyEmail = async (token) => {
  try {
    const response = await api.get(`/autho/email_address?token=${token}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
