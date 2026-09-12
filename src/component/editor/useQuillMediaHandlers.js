import axios from "axios";
import { useCallback, useRef } from "react";
import toast from "react-hot-toast";
import {
  getVideoCount,
  MAX_IMAGE_SIZE,
  MAX_VIDEO_SIZE,
} from "../util/fileSize";
import { requestPresignedUrl } from "../util/mediaApi";

export const useQuillMediaHandlers = (getContent) => {
  const quillRef = useRef(null);

  // ✅ 이미지 핸들러: 3MB 이하만 허용, base64로 삽입
  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      // ① 사진 개수 검사 (3개 제한)
      if (getImageCount(getContent()) >= MAX_IMAGE_COUNT) {
        toast.error(`사진은 최대 ${MAX_IMAGE_COUNT}개까지 첨부할 수 있습니다.`);
        return;
      }

      // ② 파일 크기 검사 (단일 최대 3MB)
      if (file.size > MAX_IMAGE_SIZE) {
        toast.error(
          `사진은 최대 ${MAX_IMAGE_SIZE / (1024 * 1024)}MB까지 가능합니다.`,
        );
        return;
      }

      const toastId = toast.loading("사진 업로드 중... 0%");

      try {
        const { uploadUrl, fileUrl } = await requestPresignedUrl(
          file.name,
          file.type,
          "review/image", // ← 도메인 구분
        );

        await axios.put(uploadUrl, file, {
          headers: { "Content-Type": file.type },
          onUploadProgress: (e) => {
            if (!e.total) return;
            const percent = Math.round((e.loaded / e.total) * 100);
            toast.loading(`사진 업로드 중... ${percent}%`, { id: toastId });
          },
        });

        const quill = quillRef.current?.getEditor();
        if (!quill) throw new Error("Quill not ready");

        const range = quill.getSelection(true);
        quill.insertEmbed(range.index, "image", fileUrl, "user"); // ✅ URL 삽입
        quill.setSelection(range.index + 1);

        toast.success("사진이 업로드되었습니다.", { id: toastId });
      } catch (err) {
        console.error("image upload err:", err);

        if (err.response?.status === 429) {
          toast.error(
            err.response.data?.message || "업로드 요청이 너무 잦습니다.",
            { id: toastId },
          );
          return;
        }
        toast.error("사진 업로드 실패", { id: toastId });
      }
    };
  }, []);

  // ✅ 영상 핸들러: 50MB 제한, S3 presigned URL 업로드
  const videoHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "video/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      // ① 동영상 개수 검사 (1개 제한)
      if (getVideoCount(getContent()) >= MAX_VIDEO_COUNT) {
        toast.error(
          `동영상은 최대 ${MAX_VIDEO_COUNT}개까지 첨부할 수 있습니다.`,
        );
        return;
      }

      // ② 파일 크기 검사 (최대 50MB)
      if (file.size > MAX_VIDEO_SIZE) {
        toast.error(
          `동영상은 최대 ${MAX_VIDEO_SIZE / (1024 * 1024)}MB까지 가능합니다.`,
        );
        return;
      }

      const toastId = toast.loading("동영상 업로드 중... 0%");

      try {
        // ③ Presigned URL 요청
        const { uploadUrl, fileUrl } = await requestPresignedUrl(
          file.name,
          file.type,
          "review/video", // ← 도메인 구분
        );

        // ④ S3에 직접 PUT (진행률 표시)
        await axios.put(uploadUrl, file, {
          headers: { "Content-Type": file.type },
          onUploadProgress: (e) => {
            if (!e.total) return;
            const percent = Math.round((e.loaded / e.total) * 100);
            toast.loading(`동영상 업로드 중... ${percent}%`, { id: toastId });
          },
        });

        // ⑤ 에디터에 삽입
        const quill = quillRef.current?.getEditor();
        if (!quill) throw new Error("Quill not ready");

        const range = quill.getSelection(true);
        quill.insertEmbed(
          range.index,
          "customVideo",
          { url: fileUrl, size: file.size },
          "user",
        );
        quill.setSelection(range.index + 1);

        toast.success("동영상이 업로드되었습니다.", { id: toastId });
      } catch (err) {
        console.error("video upload err:", err);

        // 429 (Rate Limit) 별도 처리
        if (err.response?.status === 429) {
          toast.error(
            err.response.data?.message || "업로드 요청이 너무 잦습니다.",
            { id: toastId },
          );
          return;
        }
        toast.error("동영상 업로드 실패", { id: toastId });
      }
    };
  }, [getContent]);

  return { quillRef, imageHandler, videoHandler };
};
