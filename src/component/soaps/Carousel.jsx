import { BsArrowLeftCircleFill, BsArrowRightCircleFill } from "react-icons/bs";
import "./carousel.css";
import { useState } from "react";
import { Figure } from "react-bootstrap";
const Carousel = ({ images, bgColor, selColor, disColor }) => {
  const imageRoot = "/src/assets/images/soap";
  const [slide, setSlide] = useState(0);

  const nextSlide = () => {
    setSlide((slide + 1) % images.length);
  };

  const prevSlide = () => {
    setSlide((slide - 1 + images.length) % images.length);
  };

  console.log("Carousel images:", images);
  return (
    <div >
      {images.map((soap, idx) => {
        return (
          <div
            className={slide === idx ? "carousel" : "carousel slide-hidden"}
            key={idx}
          >
            <BsArrowLeftCircleFill
              className="arrow arrow-left"
              style={{ color: selColor }}
              onClick={prevSlide}
            />
            <Figure>
              <Figure.Image
                style={{ backgroundColor: bgColor }}
                src={`${imageRoot}/${soap.image}`}
                alt={soap.name}
                className="slide"
              />
              <span className="indicators">
                {images.map((_, idx) => {
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
                        backgroundColor: slide === idx ? selColor : disColor,
                      }}
                    />
                  );
                })}
              </span>
              <Figure.Caption>
                <h6 className="narrow">{soap.desc}</h6>
              </Figure.Caption>
            </Figure>
            <BsArrowRightCircleFill
              className="arrow arrow-right"
              style={{ color: selColor }}
              onClick={nextSlide}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Carousel;
