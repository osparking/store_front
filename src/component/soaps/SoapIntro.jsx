import { useState } from "react";
import { Container, Tab, Tabs } from "react-bootstrap";
import "../../index.css";
import BumShapes from "./BumShapes";
import Effect from "./Effect";
import Ingredient from "./Ingredient";
import ProduceSteps from "./ProduceSteps";
import "./soapIntro.css";

const SoapIntro = () => {
  const handleSoapIntroTabSelect = (key) => {
    localStorage.setItem("SOAP_INTRO_TAB", key);
  };

  const [currTabKey, setCurrTabKey] = useState(
    localStorage.getItem("SOAP_INTRO_TAB") || "effect",
  );

  return (
    <Container
      fluid
      className="home-container"
      style={{ top: "62px" }}
    >
      <Tabs
        defaultActiveKey={currTabKey}
        className="tabBackgroundThick contentHolyCentered"
        onSelect={handleSoapIntroTabSelect}
      >
        <Tab eventKey="effect" title={<h5 className="tabLabel">효능 소개</h5>}>
          <Effect />
        </Tab>
        <Tab
          eventKey="ingredient"
          title={<h5 className="tabLabel">비누 재료</h5>}
        >
          <Ingredient />
        </Tab>
        <Tab eventKey="steps" title={<h5 className="tabLabel">제조 절차</h5>}>
          <ProduceSteps />
        </Tab>
        <Tab eventKey="shapes" title={<h5 className="tabLabel">비누 외형</h5>}>
          <BumShapes />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default SoapIntro;
