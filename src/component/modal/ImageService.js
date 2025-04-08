import { callWithToken } from "../user/UserService";
import { api } from "../util/api";

const prefix = "http://localhost:9193/api/s1";

export async function uploadEmpPhoto(userId, file) {
  try {
    const formData = new FormData();
    formData.append("empId", userId);
    formData.append("file", file);

    const result = await callWithToken("post", "/photo/upload", formData);
    return result.data;
  } catch (err) {
    throw err;
  }
}

export async function updatePhoto(photoId, newFile) {
  try {
    const formData = new FormData();
    formData.append("file", newFile);

    const urlSuffix = `/photo/${photoId}/update`;
    const response = await callWithToken("put", urlSuffix, formData);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteUserPhoto(userId) {
  try {
    const response = await api.delete(`/photo/${userId}/del_emp_id`);
    return response.data;
  } catch (error) {
    throw error;
  }
}
