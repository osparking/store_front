import { api, callWithToken } from "../util/api";

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

export async function getSoapsMonthUser(userId) {
  try {
    const urlSuffix = `/user/${userId}/soaps_month`;
    console.log("suffix:", urlSuffix);
    const result = await callWithToken("get", urlSuffix);
    return result.data;
  } catch (err) {
    throw err;
  }
}

export async function getShapeCount(userId) {
  try {
    const urlSuffix = `/order/${userId}/get_shape_count`;
    const result = await callWithToken("get", urlSuffix);
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

export async function getDefaultRecipient(userId) {
  try {
    const result = await callWithToken("get", `/user/${userId}/get_recipient`);
    return result.data;
  } catch (err) {
    throw err;
  }
}

export async function getMyRecipients(userId, page, size) {
  try {
    const result = await callWithToken(
      "get",
      `/user/get_recipients?id=${userId}&page=${page}&size=${size}`
    );
    return result.data.data;
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
