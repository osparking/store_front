import { callWithToken } from "./api";

interface PresignedUrl {
  uploadUrl: string;
  fileUrl: string;
  key: string;
}

interface PresignedGetUrl {
  url: string;
}

export const requestPresignedUrl = async (
  fileName: string,
  contentType: string,
  domain: string,
): Promise<PresignedUrl> => {
  const res = await callWithToken("POST", "/media/presigned_url", {
    domain,
    fileName,
    contentType,
  });
  return res.data;
};

export const getPresignedGetUrl = async (
  key: string,
): Promise<PresignedGetUrl> => {
  const res = await callWithToken(
    "GET",
    "/media/presigned_get_url",
    undefined,
    { key },
  );
  return res.data.url;
};
