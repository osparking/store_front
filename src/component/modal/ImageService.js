import React from "react";
import { api } from "../util/api";

export async function uploadEmpPhoto(userId, file) {
  try {
    const formData = new FormData();
    formData.append("empId", userId);
    formData.append("file", file);

    const response = await api.post("/photo/upload", formData);
    return response.data;
  } catch (error) {
    throw error;
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
