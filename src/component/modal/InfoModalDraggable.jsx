import { useEffect, useRef } from "react"; // 1. useRef import 추가
import { Button } from "react-bootstrap";
import ReactDOM from "react-dom";
import Draggable from "react-draggable";
import "./InfoModalDraggable.css";

const InfoModalDraggable = ({ show, onHide, title, children }) => {
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
          id="customer-info-modal"
          className="modal-wrapper"
          ref={nodeRef}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h3 id="customer-info-title">{title}</h3>
            <button id="modal-close-btn" className="close-btn" onClick={onHide}>
              ✕
            </button>
          </div>
          <div className="modal-body">{children}</div>
          <div className="modal-footer justify-content-center">
            <Button onClick={onHide}>닫기</Button>
          </div>
        </div>
      </Draggable>
    </div>,
    document.getElementById("root"),
  );
};

export default InfoModalDraggable;
