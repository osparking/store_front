import { api } from "../util/api";

export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/autho/login", { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};
