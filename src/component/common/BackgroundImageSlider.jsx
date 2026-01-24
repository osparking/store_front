import { useState } from "react";
import { Carousel } from "react-bootstrap";
import bgo1 from "../../assets/images/bg/bgo1.jpg";
import bgo2 from "../../assets/images/bg/bgo2.jpg";
import bgo3 from "../../assets/images/bg/bgo3.jpg";
import bgo4 from "../../assets/images/bg/bgo4.jpg";

const BackgroundImageSlider = () => {
  const images = [bgo1, bgo2, bgo3, bgo4];
  const [index, setIndex] = useState(0);
  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };
  return (
    <div className="background-slider">
      <Carousel
        activeIndex={index}
        onSelect={handleSelect}
        interval={20000}
        style={{ width: "100%", maxWidth: "100%", height: "100vh" }}
      >
        {images.map((background, index) => (
          <Carousel.Item key={index} className="carousel-item">
            <img
              className="d-block w-100"
              src={background}
              alt={`제 ${index} 슬라이드`}
            />
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default BackgroundImageSlider;
