import { useEffect, useRef } from "react"; // 1. useRef import 추가
import { Button } from "react-bootstrap";
import ReactDOM from "react-dom";
import Draggable from "react-draggable";
import "./CustomerDetails.css";
import "./InfoModalDraggable.css";

const InfoModalDraggable = ({
  show,
  onHide,
  title,
  children,
  idPrefix = "customer",
}) => {
  const nodeRef = useRef(null);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onHide();
    };
    if (show) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [show, onHide]);

  if (!show) return null;

  return ReactDOM.createPortal(
    <div
      className="modal-overlay"
      onClick={onHide}
      aria-modal="true"
      role="dialog"
    >
      <Draggable handle=".modal-header" nodeRef={nodeRef}>
        <div
          id={`${idPrefix}-info-modal`}
          className="modal-wrapper"
          ref={nodeRef}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h3 id={`${idPrefix}-info-title`}>{title}</h3>
            <button id="modal-close-btn" className="close-btn" onClick={onHide}>
              ✕
            </button>
          </div>
          <div className="modal-body">{children}</div>
          <div className="modal-footer justify-content-center char2button">
            <Button onClick={onHide} style={{ padding: 0 }}>
              닫기
            </Button>
          </div>
        </div>
      </Draggable>
    </div>,
    document.getElementById("root"),
  );
};

export default InfoModalDraggable;
