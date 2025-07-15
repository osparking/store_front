import { BsArrowLeftCircleFill, BsArrowRightCircleFill } from "react-icons/bs";
import "./carousel.css";
import { useState } from "react";
import { Figure } from "react-bootstrap";
import "./carousel.css";
const Carousel = ({ images, bgColor, selColor, disColor }) => {
  const imageRoot = "/src/assets/images/soap";
  const [slide, setSlide] = useState(0);

  console.log("Carousel images:", images);
  return (
    <div>
      {images.map((soap, idx) => {
        return (
          <div
            className={slide === idx ? "carousel" : "carousel slide-hidden"}
            key={idx}
          >
            <BsArrowLeftCircleFill
              className="arrow arrow-left"
              style={{ color: selColor }}
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
            </Figure>
            <BsArrowRightCircleFill
              className="arrow arrow-right"
              style={{ color: selColor }}
            />            
          </div>
        );
      })}
    </div>
  );
};

export default Carousel;
