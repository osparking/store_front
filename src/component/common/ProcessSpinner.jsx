import React from "react";
import { Spinner } from "react-bootstrap";

const ProcessSpinner = ({ size = "sm", animation = "grow", message = "" }) => {
  return (
    <>
      <div className="text-center" style={{ zIndex: "10" }}>
        <Spinner
          as="span"
          animation={animation}
          size={size}
          role="status"
          aria-hidden="true"
        />
      </div>

      {message && (
        <div
          className="sr-only"
          aria-live="polite"
          style={{
            position: "absolute",
            color: "white",
            zIndex: "9",
          }}
        >
          {message}&nbsp;중...
        </div>
      )}
    </>
  );
};

export default ProcessSpinner;
