import { useState } from "react";
import { Figure } from "react-bootstrap";
import "./carousel.css";
const Carousel = ({ images }) => {
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
            <Figure>
              <Figure.Image
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
                        backgroundColor: slide === idx ? "red" : "black",
                      }}
                    />
                  );
                })}
              </span>
            </Figure>
          </div>
        );
      })}
    </div>
  );
};

export default Carousel;
