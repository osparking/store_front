import { Card, Col, Container, Row } from "react-bootstrap";
import "../../index.css";
import { ingAllData } from "./ingAllData";
import "./ingredient.css";
import IngredTabAccord from "./IngredTabAccord";

const Ingredient = () => {
  return (
    <Row
      className="justify-content-center mt-2 mb-2"
      style={{ height: "80vh" }}
    >
      <Col md={8}>
        <Card style={{ minWidth: "620px" }}>
          <Card.Body className="pb-0">
            <div className="mb-5">
              <h2 className="mb-3" style={{ paddingLeft: 0 }}>
                <strong>재료 함량</strong>
                <br />
              </h2>
              <p className="mb-0 text-end legendFont">
                (비누 1 개용 원액 126.3g 기준)
              </p>
              <IngredTabAccord ingAllData={ingAllData} keepOthersOpen={false} />
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default Ingredient;
