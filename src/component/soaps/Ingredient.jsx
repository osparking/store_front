import { Card, Col, Row } from "react-bootstrap";
import "../../index.css";
import { ingAllData } from "./ingAllData";
import "./ingredient.css";
import IngredTabAccord from "./IngredTabAccord";

const Ingredient = () => {
  return (
    <Row className="justify-content-center">
      <Col xs={12} md={10} lg={9} style={{ overflow: "auto", height: "100%" }}>
        <Card
          id="ingredCard"
          style={{ maxWidth: "1030px" }}
          className="mx-auto"
        >
          <Card.Body>
            <h2 className="mb-1">
              <strong>재료 함량</strong>
              <br />
            </h2>
            <p className="mb-0 text-end legendFont">
              (비누 1 개용 원액 126.3g 기준)
            </p>
            <div
              style={{
                maxWidth: "100%",
                overflow: "auto",
              }}
              className="mx-auto"
            >
              <IngredTabAccord ingAllData={ingAllData} keepOthersOpen={true} />
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default Ingredient;
