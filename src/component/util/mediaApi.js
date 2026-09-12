import { callWithToken } from "./api";

export const requestPresignedUrl = async (fileName, contentType, domain) => {
  const res = await callWithToken("POST", "/media/presigned_url", {
    domain,
    fileName,
    contentType,
  });
  return res.data;
};
