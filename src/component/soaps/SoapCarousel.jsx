import { useState } from "react";
import { BsArrowLeftCircleFill, BsArrowRightCircleFill } from "react-icons/bs";

const SoapCarousel = ({ soapImages, bgColor, indColor, slide, setSlide }) => {
  const arrowSz = 1.8; // in rem

  const buttonStyle = {
    alignItems: "center",
    background: "none",
    border: "none",
    cursor: "pointer",
    display: "inline-flex",
    fontSize: `${arrowSz}rem`,
    height: "fit-content",
    justifyContent: "center",
    margin: 0,
    marginTop: `${-arrowSz / 2}rem`,
    padding: 0,
    position: "absolute",
    width: "fit-content",
    zIndex: "1",
  };

  const [arrowDisabled, setArrowDisabled] = useState(false);
  const selColor = "#d9c1a6";
  const arrowStyle = {
    color: selColor,
  };

  const imageRoot = "/soap";

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
                backgroundColor: bgColor,
                width: "100%",
                height: "auto",
              }}
              src={`${imageRoot}/${soap.image}`}
              alt={soap.name}
              className={
                slide === idx ? "slide carousel" : "slide carousel slide-hidden"
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
                  slide === idx ? "indicator" : "indicator indicator-inactive"
                }
                style={{
                  backgroundColor: slide === idx ? selColor : indColor,
                }}
              />
            );
          })}
        </span>
      </div>
    </div>
  );
};

export default SoapCarousel;
