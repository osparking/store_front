import React from "react";
import { api } from "../util/api";

export async function uploadEmpPhoto(userId, newFile) {
  try {
    console.log("user Id: " + userId);
    const formData = new FormData();
    formData.append("empId", userId);
    formData.append("file", newFile);

    const response = await api.post("/photo/upload", formData);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function updateEmpPhoto(photoId, newFile) {
  try {
    console.log("photo Id: " + photoId);
    const formData = new FormData();
    formData.append("file", newFile);

    const response = await api.put(`/photo/${photoId}/update`, formData, {
      headers: { "Content-Type": "application/octet-stream" },
    });
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
