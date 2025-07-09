import { Col, Container, Row, Table } from "react-bootstrap";
import "../../index.css";
import { ingAllData } from "./ingAllData";
import "./ingredient.css";
import IngredTabAccord from "./IngredTabAccord";

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
    <Table striped bordered hover className="mt-0 w-100">
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
    <Container fluid className="home-container mt-5">
      <Row className="justify-content-center allIngred mt-3 ">
        <Col md={9} className="mt">
          <div className="mt-3">
            <h2 className="mb-1" style={{ paddingLeft: 0 }}>
              <strong>재료 함량</strong>
              <br />
              <small> 비누 1 개 원액 기준</small>
            </h2>
            <hr />
            <IngredTabAccord ingAllData={ingAllData} keepOthersOpen={true} />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Ingredient;
