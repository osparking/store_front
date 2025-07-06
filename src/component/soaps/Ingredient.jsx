import { Col, Container, Row, Table } from "react-bootstrap";
import "../../index.css";
import { ingAllData } from "./ingAllData";
import IngredAccordion from "./IngredAccordion";
import "./ingredient.css";

const ingAllRows = ingAllData.map((ingred, idx) => (
  <tr className={ingred.id === "" ? "table-row" : ""} key={idx}>
    <td>{ingred.id}</td>
    <td>{ingred.name}</td>
    <td className="text-center">{ingred.weight}</td>
    <td className="text-center">{ingred.incRate}</td>
    <td>{ingred.etcEffect}</td>
  </tr>
));

const IngredTable = () => {
  return (
    <Table striped bordered hover className="mt-0 w-75">
      <thead>
        <tr>
          <th>#</th>
          <th>재료명</th>
          <th className="text-center">중량(g)</th>
          <th className="text-center">함유비(%)</th>
          <th className="text-center">비고/효능</th>
        </tr>
      </thead>
      <tbody>{ingAllRows}</tbody>
    </Table>
  );
};

const Ingredient = () => {
  return (
    <Container fluid className="home-container ">
      <Row className="justify-content-center ">
        <Col>
          <div className="d-flex justify-content-center">
            <IngredTable />
          </div>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col>
          <div className="d-flex justify-content-center">
            <IngredAccordion items={ingAllData} keepOthersOpen={true} />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Ingredient;
