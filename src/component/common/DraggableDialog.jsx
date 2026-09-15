// DraggableDialog.jsx
import { forwardRef, useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";

const DraggableDialog = forwardRef((props, ref) => {
  const nodeRef = useRef(null);
  const { children, className, style, ...rest } = props;
  
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [initialized, setInitialized] = useState(false);

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

  return (
    <Draggable
      handle=".modal-header"
      cancel=".btn-close, button, input, textarea, select, a"
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
        className={className}
        style={{ ...style, position: "absolute" }}
        {...rest}
      >
        <div className="modal-content">
          {children}
        </div>
      </div>
    </Draggable>
  );
});

export default DraggableDialog;
