import axios, { HttpStatusCode } from "axios";
import { api } from "../util/api";

const prefix = "http://localhost:9193/api/s1";

export const toggleEnabledColumn = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      const result = await axios({
        method: "put",
        url: `${prefix}/admin/worker/${userId}/toggle`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return result.data;
    } else {
      return null;
    }
  } catch (err) {
    if (err.response.status === HttpStatusCode.Forbidden) {
      return null;
    } else {
      throw err;
    }
  }
};

export async function getUserByMonthType() {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      const result = await axios({
        method: "get",
        url: `${prefix}/admin/user/count_stat`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return result.data;
    } else {
      return null;
    }
  } catch (err) {
    if (err.response.status === HttpStatusCode.Forbidden) {
      return null;
    } else {
      throw err;
    }
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

export async function getUserCount() {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      const result = await axios({
        method: "get",
        url: `${prefix}/admin/user/count`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return result.data;
    } else {
      return null;
    }
  } catch (err) {
    if (err.response.status === HttpStatusCode.Forbidden) {
      return null;
    } else {
      throw err;
    }
  }
}

export async function getUserDtoById(userId) {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      const result = await axios({
        method: "get",
        url: `${prefix}/user/${userId}/get_dto`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return result.data;
    } else {
      return null;
    }
  } catch (err) {
    throw err;
  }
}

export async function changePwd(userId,  curPwd, newPwd, cnfPwd) {
  try {
    const request = { curPwd, newPwd, cnfPwd };
    const result = await api.put(`/user/change_pwd/${userId}`, request);
    return result.data;
  } catch (err) {
    throw err;
  }
}
