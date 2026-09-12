export const MAX_TOTAL_VIDEO_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_SINGLE_IMAGE_SIZE = 1 * 1024 * 1024; // 1MB

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

// HTML에서 모든 영상 크기 합산 (S3 + 기존 base64)
export const getTotalVideoSize = (html) => {
  if (!html) return 0;
  const doc = new DOMParser().parseFromString(html, "text/html");
  let total = 0;

  // S3 업로드 영상: data-size 속성 사용
  doc.querySelectorAll("video[data-size]").forEach((v) => {
    total += parseInt(v.getAttribute("data-size") || "0", 10);
  });

  // 기존 base64 영상 (마이그레이션 전 데이터)
  doc.querySelectorAll("video[src^='data:'], source[src^='data:']").forEach((el) => {
    const src = el.getAttribute("src") || "";
    const base64 = src.split(",")[1] || "";
    if (base64) total += getBase64ByteSize(base64);
  });

  return total;
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