import { api } from "../util/api";

export async function registerUser(user) {
  try {
    const result = await api.post("/user/add", user);
    return result.data;
  } catch (err) {
    throw err;
  }
}

export async function getUserById(userId) {
  try {
    const result = await api.get(`/user/${userId}/get`);
    return result.data;
  } catch (err) {
    throw err;
  }
}