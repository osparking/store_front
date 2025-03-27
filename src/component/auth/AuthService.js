import { api } from "../util/api";

export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/autho/login", { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = () => {
  localStorage.removeItem("userId");
  window.dispatchEvent(new Event("logoutEvt"));
}

export const verifyEmail = async (token) => {
    try {
        const response = await api.get(`/authro/email_address?token=${token}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};