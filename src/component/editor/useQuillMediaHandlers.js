import { useRef, useCallback } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { requestPresignedUrl } from "../util/mediaApi";
import {
  MAX_TOTAL_VIDEO_SIZE,
  MAX_SINGLE_IMAGE_SIZE,
  formatSize,
  getTotalVideoSize,
  getTotalImageSize,
} from "../util/fileSize";

export const useQuillMediaHandlers = (getContent) => {
  const quillRef = useRef(null);

  // ✅ 이미지 핸들러: 1MB 이하만 허용, base64로 삽입
  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;

      if (file.size > MAX_SINGLE_IMAGE_SIZE) {
        toast.error("이미지는 1MB 이내만 업로드 가능합니다.");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const quill = quillRef.current?.getEditor();
        if (!quill) return;
        const range = quill.getSelection(true);
        quill.insertEmbed(range.index, "image", reader.result, "user");
        quill.setSelection(range.index + 1);
      };
      reader.readAsDataURL(file);
    };
  }, []);

  // ✅ 영상 핸들러: 5MB 합계 제한, S3 presigned URL 업로드
  const videoHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "video/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      // ① 합계 검사
      const currentTotal = getTotalVideoSize(getContent());
      if (currentTotal + file.size > MAX_TOTAL_VIDEO_SIZE) {
        const remain = Math.max(0, MAX_TOTAL_VIDEO_SIZE - currentTotal);
        toast.error(
          `영상은 총 5MB까지 가능합니다. (남은 용량: ${formatSize(remain)})`
        );
        return;
      }

      const toastId = toast.loading("영상 업로드 중... 0%");

      try {
        // ② presigned URL 요청
        const { uploadUrl, fileUrl } = await requestPresignedUrl(
          file.name,
          file.type
        );

        // ③ S3에 직접 PUT (callWithToken 사용 금지! 순수 axios)
        await axios.put(uploadUrl, file, {
          headers: { "Content-Type": file.type },
          onUploadProgress: (e) => {
            if (!e.total) return;
            const percent = Math.round((e.loaded / e.total) * 100);
            toast.loading(`영상 업로드 중... ${percent}%`, { id: toastId });
          },
        });

        // ④ 에디터에 삽입
        const quill = quillRef.current?.getEditor();
        if (!quill) throw new Error("Quill not ready");

        const range = quill.getSelection(true);
        quill.insertEmbed(
          range.index,
          "customVideo",
          { url: fileUrl, size: file.size },
          "user"
        );
        quill.setSelection(range.index + 1);

        toast.success("영상이 업로드되었습니다.", { id: toastId });
      } catch (err) {
        console.error("video upload err:", err);

        // 429 (Rate Limit) 별도 처리
        if (err.response?.status === 429) {
          toast.error(
            err.response.data?.message || "업로드 요청이 너무 잦습니다.",
            { id: toastId }
          );
          return;
        }
        toast.error("영상 업로드 실패", { id: toastId });
      }
    };
  }, [getContent]);

  return { quillRef, imageHandler, videoHandler };
};
