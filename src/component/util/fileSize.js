export const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
export const MAX_VIDEO_COUNT = 1;

export const MAX_SINGLE_IMAGE_SIZE = 3 * 1024 * 1024; // 3MB
export const MAX_IMAGE_COUNT = 3;

export const formatSize = (bytes) => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
};

// base64 문자열의 실제 바이트 크기
const getBase64ByteSize = (base64) => {
  const padding = (base64.match(/=/g) || []).length;
  return (base64.length * 3) / 4 - padding;
};

// HTML에서 모든 이미지(S3 + base64) 크기 합산
export const getTotalImageSize = (html) => {
  if (!html) return 0;
  const doc = new DOMParser().parseFromString(html, "text/html");
  let total = 0;

  doc.querySelectorAll("img").forEach((img) => {
    const src = img.getAttribute("src") || "";
    if (src.startsWith("data:")) {
      const base64 = src.split(",")[1] || "";
      if (base64) total += getBase64ByteSize(base64);
    }
  });

  return total;
};

export const getVideoCount = (html, { includeIframe = false } = {}) => {
  if (!html) return 0;

  const doc = new DOMParser().parseFromString(html, "text/html");
  let count = doc.querySelectorAll("video").length;

  if (includeIframe) count += doc.querySelectorAll("iframe.ql-video").length;

  return count;
};

export const getImageCount = (html) => {
  if (!html) return 0;
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.querySelectorAll("img").length;
};
