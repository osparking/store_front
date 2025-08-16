import { useState } from "react";
import { Col, Figure, Row } from "react-bootstrap";
import SoapCarousel from "./SoapCarousel";
import "./soapImages.css";

const SoapImages = ({ soapImages, bgColor, indColor, heading }) => {
  const arrowSz = 1.8; // in rem

  const buttonStyle = {
    position: "absolute",
    marginTop: `${-arrowSz}rem`,
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

  const nextSlide = (lOrR) => {
    if (arrowDisabled) {
      return;
    }
    let newSlide = -1;
    if (lOrR === "R") {
      newSlide = (slide + 1) % soapImages.length;
    } else {
      newSlide = (slide - 1 + soapImages.length) % soapImages.length;
    }
    setSlide(newSlide);
    setArrowDisabled(true); // Disable the arrow
    setTimeout(() => {
      setArrowDisabled(false);
    }, 200);
  };

  return (
    <Row className="justify-content-center allIngred pt-3 mb-5">
      <Col md={8}>
        <h5 className="ps-0 mb-4" id="normal-soap">
          <strong>
            {heading} 영상 - {soapImages.length} 개
          </strong>
        </h5>
        <SoapCarousel
          soapImages={soapImages}
          bgColor={bgColor}
          indColor={indColor}
        />
        <div className="imgCapDiv">
          <Figure className="mt-3">
            <Figure.Caption className="soapCap">
              <strong>{soapImages[slide].desc}</strong>
            </Figure.Caption>
          </Figure>
        </div>
      </Col>
      <hr />
    </Row>
  );
};

export default SoapImages;
