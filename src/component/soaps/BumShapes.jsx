import { Col, Container, Row } from "react-bootstrap";

const BumShapes = () => {
  return (
    <Container fluid className="home-container mt-5">
      <Row className="justify-content-center allIngred mt-3">
        <Col md={8}>
          <h2 className="ps-0 m-4">
            <strong>비누 외형 3 종</strong>
          </h2>
          <h5>범이비누의 세가지 외형은 다음 두 요소에 의하여 빚어집니다.</h5>
        </Col>
      </Row>
    </Container>
  );
};

export default BumShapes;
