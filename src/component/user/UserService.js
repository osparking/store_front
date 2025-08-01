import { api, callWithToken } from "../util/api";

const prefix = "http://localhost:9193/api/s1";

export async function updateUser(userId, user) {
  try {
    const url = `/user/${userId}/update`;
    const result = await callWithToken("put", url, user);
    return result.data;
  } catch (err) {
    throw err;
  }
}

export async function deleteUserAccount(userId) {
  try {
    const urlSuffix = `/user/${userId}/delete`;
    const result = await callWithToken("delete", urlSuffix);
    return result.data;
  } catch (err) {
    throw err;
  }
}

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

export async function getUserDtoById(userId) {
  try {
    const result = await callWithToken("get", `/user/${userId}/get_dto`);
    return result ? result.data : result;
  } catch (err) {
    throw err;
  }
}

export async function changePwd(userId, curPwd, newPwd, cnfPwd) {
  try {
    const request = { curPwd, newPwd, cnfPwd };
    const result = await callWithToken(
      "put",
      `/user/change_pwd/${userId}`,
      request
    );
    return result ? result.data : result;
  } catch (err) {
    throw err;
  }
}
