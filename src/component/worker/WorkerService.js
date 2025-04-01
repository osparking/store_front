import { api } from "../util/api";

export async function getWorkerList() {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      const result = await axios({
        method: "get",
        url: `${prefix}/admin/worker/get_all`,
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

export async function getAllDept() {
  try {
    const result = await api.get("/worker/get_all_dept");
    return result.data;
  } catch (err) {
    throw err;
  }
}
