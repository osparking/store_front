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
            </Figure>
          </div>
        );
      })}
    </div>
  );
};

export default Carousel;
