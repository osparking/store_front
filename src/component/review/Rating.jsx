import { useState } from "react";
import { Container, Form } from "react-bootstrap";
import { FaStar } from "react-icons/fa";

const Rating = ({ stars, setStars }) => {
  const [hover, setHover] = useState(null);
  const handleRatingChange = (value) => {
    setStars(value);
  };

  return (
    <Container>
      <h5 style={{ textAlign: "left" }}>별점 평가</h5>
      <div className="mb-3">
        {[...Array(5)].map((_, index) => {
          const starCount = index + 1;
          return (
            <Form.Label key={index} className="me-2">
              <Form.Check
                type="radio"
                name="rading"
                value={starCount}
                onChange={() => handleRatingChange(starCount)}
                checked={stars === starCount}
                inline
              />
              <FaStar
                size={20}
                className="star"
                color={starCount <= (hover || stars) ? "#ffc107" : "#e4e5e9"}
                onMouseEnter={() => setHover(starCount)}
                onMouseLeave={() => setHover(null)}
              />
            </Form.Label>
          );
        })}
      </div>
    </Container>
  );
};

export default Rating;
