import { api } from "../util/api";

export async function registerUser(user) {
  try {
    const result = await api.post("/user/add", user);
    return result.data;
  } catch (err) {
    throw err;
  }
}