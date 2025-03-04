import React from 'react'
import { Carousel } from 'react-bootstrap'
import bgo1 from "../../assets/images/bg/bgo1.jpg"
import bgo2 from "../../assets/images/bg/bgo2.jpg"
import bgo3 from "../../assets/images/bg/bgo3.jpg"
import bgo4 from "../../assets/images/bg/bgo4.jpg"
const BackgroundImageSlider = () => {
  const images = [bgo1, bgo2, bgo3, bgo4];
  const [index, setIndex] = useState(0);
  return (
    <div className="background-slider">
      <Carousel activeIndex={index} onSelect={handleSelect} interval={20000}>
        {images.map((background, index) => (
          <Carousel.Item key={index}>
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

export default BackgroundImageSlider
