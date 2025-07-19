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
    <Row className="justify-content-center allIngred pt-3 mb-5">
      <Col md={8}>
        <h2 className="ps-0 mb-4" id="normal-soap">
          <strong>보통비누</strong>
        </h2>
        <div className="carousel-container">
          <div className="carousel">
            <button
              className="button button-left"
              style={buttonStyle}
              onClick={() => nextSlide("L")}
              disabled={arrowDisabled}
            >
              <BsArrowLeftCircleFill style={arrowStyle} />
            </button>
            {soapImages.map((soap, idx) => {
              return (
                <img
                  key={idx}
                  style={{
                    backgroundColor: "#263e59",
                    width: "100%",
                    height: "auto",
                  }}
                  src={`${imageRoot}/${soap.image}`}
                  alt={soap.name}
                  className={
                    slide === idx
                      ? "slide carousel"
                      : "slide carousel slide-hidden"
                  }
                />
              );
            })}
            <button
              className="button button-right"
              style={buttonStyle}
              onClick={() => nextSlide("R")}
              disabled={arrowDisabled}
            >
              <BsArrowRightCircleFill style={arrowStyle} />
            </button>
            <span className="indicators">
              {soapImages.map((_, idx) => {
                return (
                  <button
                    key={idx}
                    onClick={() => setSlide(idx)}
                    className={
                      slide === idx
                        ? "indicator"
                        : "indicator indicator-inactive"
                    }
                    style={{
                      backgroundColor: slide === idx ? selColor : "#6199daff",
                    }}
                  />
                );
              })}
            </span>
          </div>
        </div>
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
