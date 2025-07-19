import React, { useState } from "react";
import { Col, Figure, Row } from "react-bootstrap";
import { BsArrowLeftCircleFill, BsArrowRightCircleFill } from "react-icons/bs";

const SoapImages = ({soapImages, bgColor, indColor}) => {
  const arrowSz = 1.8; // in rem

  const buttonStyle = {
    position: "absolute",
    marginTop: `${-(arrowSz)}rem`,
    zIndex: "1",
    top: "50%",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: `${arrowSz}rem`,
  };

  const [arrowDisabled, setArrowDisabled] = useState(false);
  const selColor = "#d9c1a6";
  const arrowStyle = {
    color: selColor,
  };

  const imageRoot = "/src/assets/images/soap";
  const [slide, setSlide] = useState(0);

  return (
  );
};

export default SoapImages;
