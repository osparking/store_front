import { callWithToken } from "./api";

interface PresignedUrl {
  uploadUrl: string,
  fileUrl: string
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
