import { Spinner } from "react-bootstrap";

const ProcessSpinner = ({ size = "sm", animation = "grow", message = "" }) => {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ zIndex: "10" }}
    >
      <Spinner
        as="span"
        animation={animation}
        size={size}
        role="status"
        aria-hidden="true"
        style={{ width: "0.8rem", height: "0.8rem" }}
      />

      {message && (
        <span
          className="sr-only"
          aria-live="polite"
          style={{
            position: "absolute",
            color: "white",
            zIndex: "9",
          }}
        >
          {message}&nbsp;중...
        </span>
      )}
    </div>
  );
};

export default ProcessSpinner;
