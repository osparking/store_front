import axios, { HttpStatusCode } from "axios";
import { api } from "../util/api";

const prefix = "http://localhost:9193/api/s1";

export async function callWithToken(method, urlSuffix, data = null) {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      console.log("url: ", `${prefix}${urlSuffix}`);
      let config = {
        method: method,
        url: `${prefix}${urlSuffix}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      if (data) {
        config = {
          method: method,
          url: `${prefix}${urlSuffix}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: data,
        }
      } 
      const result = await axios(config);
      return result;
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
    const token = localStorage.getItem("token");
    if (token) {
      const result = await axios({
        method: "delete",
        url: `${prefix}/user/${userId}/delete`,
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
    const result = await callWithToken("get", `/user/${userId}/get_dto`);
    return result.data;
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
