import { useState } from "react";
import { Container, Form } from "react-bootstrap";
import { FaStar } from "react-icons/fa";
import "./Rating.css";

const Rating = ({ stars, setStars, editable }) => {
  const [hover, setHover] = useState(null);
  const handleRatingChange = (value) => {
    if (editable) setStars(value);
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
                name="rating"
                value={starCount}
                onChange={() => handleRatingChange(starCount)}
                checked={stars === starCount}
                inline
              />
              <FaStar
                size={20}
                className={editable ? "star" : "star no-cursor"}
                color={starCount <= (hover || stars) ? "#ffc107" : "#e4e5e9"}
                onMouseEnter={() => setHover(editable && starCount)}
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
