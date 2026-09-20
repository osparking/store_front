// DraggableDialog.jsx
import { forwardRef, useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { useMaximize } from "./MaximizeContext";

const DraggableDialog = forwardRef((props, ref) => {
  const { isMaximized, registerSave, registerRestore } = useMaximize();

  // position을 ref로도 관리 (저장 시 최신값 접근)
  const positionRef = useRef({ x: 0, y: 0 });

  const nodeRef = useRef(null);
  const contentRef = useRef(null);
  const {
    children,
    className,
    contentClassName,
    style,
    onSaveState,
    onRestoreState,
    onContentRef,
    ...rest
  } = props;

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  // 최대화 직전 상태 저장
  const savedRef = useRef(null);
  
  useEffect(() => {
    registerSave(() => {
      const contentEl = contentRef.current;
      savedRef.current = {
        position: { ...positionRef.current },
        contentWidth: contentEl?.style.width || "",
        contentHeight: contentEl?.style.height || "",
        contentMaxWidth: contentEl?.style.maxWidth || "",
        contentMargin: contentEl?.style.margin || "",
        contentPosition: contentEl?.style.position || "",
        contentLeft: contentEl?.style.left || "",
        contentTop: contentEl?.style.top || "",
      };
    });

    registerRestore(() => {
      if (!savedRef.current) return;
      const contentEl = contentRef.current;
      if (contentEl) {
        contentEl.style.width = savedRef.current.contentWidth;
        contentEl.style.height = savedRef.current.contentHeight;
        contentEl.style.maxWidth = savedRef.current.contentMaxWidth;
        contentEl.style.margin = savedRef.current.contentMargin;
        contentEl.style.position = savedRef.current.contentPosition;
        contentEl.style.left = savedRef.current.contentLeft;
        contentEl.style.top = savedRef.current.contentTop;
      }
      setPosition(savedRef.current.position);
      savedRef.current = null;
    });
  }, [registerSave, registerRestore]);

  useEffect(() => {
    if (contentRef.current && onContentRef) {
      onContentRef(contentRef.current);
    }
  }, [onContentRef]);

  // DOM에 붙은 뒤 실제 너비로 x 재계산
  useEffect(() => {
    if (!nodeRef.current) return;
    const el = nodeRef.current;
    const rect = el.getBoundingClientRect();
    const viewportW = document.documentElement.clientWidth;
    const x = Math.max(0, (viewportW - rect.width) / 2);
    setPosition({ x, y: 0 });
    setInitialized(true);
  }, []);

  // ✅ 부모에게 저장/복원 함수 노출
  useEffect(() => {
    if (isMaximized) {
      // 최대화: 부모(.maximized)가 크기를 잡도록 인라인 크기 제거
      const contentEl = contentRef.current;
      if (contentEl) {
        contentEl.style.width = "";
        contentEl.style.height = "";
        contentEl.style.maxWidth = "";
      }
      setPosition({ x: 0, y: 0 });
    }
  }, [isMaximized]);

  return (
    <Draggable
      handle=".modal-header"
      cancel=".btn-close, .maximize-btn, button, input, textarea, select, a"
      nodeRef={nodeRef}
      position={initialized ? position : undefined}
      onDrag={(e, data) => setPosition({ x: data.x, y: data.y })}
      bounds="body"
    >
      <div
        ref={(node) => {
          nodeRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        className={`${className}${isMaximized ? " maximized" : ""}`}
        style={{ ...style, position: "absolute" }}
        {...rest}
      >
        <div
          ref={contentRef}
          className={`modal-content${contentClassName ? " " + contentClassName : ""}`}
        >
          {children}
        </div>
      </div>
    </Draggable>
  );
});

export default DraggableDialog;
