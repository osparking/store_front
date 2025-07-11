import { Col, Container, Row } from "react-bootstrap";
import "../../index.css";
import "./produceSteps.css";

const ProduceSteps = () => {
  return (
    <Container fluid className="home-container mt-5">
      <Row className="justify-content-center allIngred mt-3">
        <Col md={8}>
          <table className="stepInfo mt-5">
            <thead>
              <tr>
                <td className="WARNING h4">경고</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="ms-2 me-2">
                    작업자는 비누 생산 절차 중{" "}
                    <span className="WARNING">가성소다수</span>
                    (별칭 <span className="WARNING">양잿물</span>)를 만들어
                    사용하므로, 작업 중 심한 화상 등 부작용 방지를 위하여,
                    지정된 장비를 착용하고, 작업 지침을 준수해야 된다.
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </Col>
      </Row>
    </Container>
  );
};

export default ProduceSteps;
