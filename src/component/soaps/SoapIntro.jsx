import { Container, Tab, Tabs } from "react-bootstrap";
import Effect from "./Effect";
import "../../index.css";
import "./soapIntro.css";

const SoapIntro = () => {
  return (
    <Container fluid className="home-container mt-3">
      <Tabs className="tabBackground tabHead">
        <Tab
          eventKey="soap_effect"
          title={<h5 className="tabLabel">효능 소개</h5>}
        >
          <Effect />
        </Tab>
        <Tab
          eventKey="soap_ingredient"
          title={<h5 className="tabLabel">비누 재료</h5>}
        ></Tab>
        <Tab
          eventKey="soap_produce_steps"
          title={<h5 className="tabLabel">제조 절차</h5>}
        ></Tab>
        <Tab
          eventKey="soap_shapes"
          title={<h5 className="tabLabel">외형 종류</h5>}
        ></Tab>
      </Tabs>
    </Container>
  );
};

export default SoapIntro;
