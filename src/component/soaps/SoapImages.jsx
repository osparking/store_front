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

  return (
    <Row className="justify-content-center allIngred pt-3 m-0">
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
          slide={slide}
          setSlide={setSlide}
        />
        <div className="imgCapDiv">
          <Figure className="mt-3">
            <Figure.Caption className="soapCap">
              <strong>{soapImages[slide].desc}</strong>
            </Figure.Caption>
          </Figure>
        </div>
      </Col>
    </Row>
  );
};

export default SoapImages;
