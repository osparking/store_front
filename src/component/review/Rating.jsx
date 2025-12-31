import { useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import { FaStar } from "react-icons/fa";
import { formatDate } from "../util/utilities";
import "./Rating.css";

const Rating = ({ stars, setStars, editable, review }) => {
  const [hover, setHover] = useState(null);
  const handleRatingChange = (value) => {
    if (editable) setStars(value);
  };

  return (
    <Container>
      <Row className="align-items-center">
        <Col xs={4} md={4}>
          <h5 style={{ textAlign: "left" }}>별점 평가</h5>
          <div>
            {[...Array(5)].map((_, index) => {
              const starCount = index + 1;
              return (
                <Form.Label key={index} style={{marginRight: '-8px'}}>
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
                    color={
                      starCount <= (hover || stars) ? "#ffc107" : "#e4e5e9"
                    }
                    onMouseEnter={() => setHover(editable && starCount)}
                    onMouseLeave={() => setHover(null)}
                  />
                </Form.Label>
              );
            })}
          </div>
        </Col>
        <Col className="text-center" xs={4} md={4}>
          <span>작성 일시 : {formatDate(review.reviewTime)}</span>
        </Col>
        <Col className="text-end" xs={4} md={4}>
          {!editable && (
            <span className="me-2">작성자: {review.customerName}</span>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Rating;
