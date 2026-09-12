import { callWithToken } from "./api";

export const requestPresignedUrl = async (fileName, contentType) => {
  const res = await callWithToken("POST", "/media/presigned_url", {
    fileName,
    contentType,
  });
  // res는 axios 응답 객체이므로 .data에서 꺼내야 함
  return res.data;
};