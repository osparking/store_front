import React from "react";
import { api } from "../util/api";
import axios, { HttpStatusCode } from "axios";

const prefix = "http://localhost:9193/api/s1";

export async function uploadEmpPhoto(userId, file) {
  try {
    const formData = new FormData();
    formData.append("empId", userId);
    formData.append("file", file);
  const token = localStorage.getItem("token");
  if (token) {
    const response = await axios({
      method: "post",
      url: `${prefix}/photo/upload`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: formData
    });
    return response.data;
  }
} catch (err) {
  if (err.response.status === HttpStatusCode.Forbidden) {
    return null;
  } else {
    throw err;
  }
  }
}

export async function updatePhoto(photoId, newFile) {
  try {
    const formData = new FormData();
    formData.append("file", newFile);

    const response = await api.put(`/photo/${photoId}/update`, formData);
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
