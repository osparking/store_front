import { Card, Col, Container, Row } from "react-bootstrap";
import "../../index.css";
import { ingAllData } from "./ingAllData";
import "./ingredient.css";
import IngredTabAccord from "./IngredTabAccord";

const Ingredient = () => {
  return (
    <Container fluid className="home-container mt-5">
      <Row className="justify-content-center allIngred mt-3">
        <Col md={8} className="mt">
          <Card style={{ maxHeight: "720px" }}>
            <Card.Body className="pb-0">
              <div className="mt-3 mb-5">
                <h2 className="mb-1" style={{ paddingLeft: 0 }}>
                  <strong>재료 함량</strong>
                  <br />
                </h2>
                <p className="mb-0 text-end legendFont">(비누 1 개용 원액 126.3g 기준)</p>
                <IngredTabAccord
                  ingAllData={ingAllData}
                  keepOthersOpen={false}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Ingredient;
