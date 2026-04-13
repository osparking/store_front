import { useState } from "react";
import { Container, Tab, Tabs } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";
import "../../index.css";
import "../user/userDashboard.css";
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

  const isMedium = useMediaQuery({ maxWidth: 992 });
  const tabItems = [
    {
      key: "effect",
      title: "효능 소개",
      component: <Effect />,
    },
    { key: "ingredient", title: "비누 재료", component: <Ingredient /> },
    {
      key: "steps",
      title: "제조 절차",
      component: <ProduceSteps />,
    },
    { key: "shapes", title: "비누 외형", component: <BumShapes /> },
  ];

  if (isMedium) {
    return (
      <Container id="soap-intro-container" fluid style={{ top: "62px" }}>
        <Tabs
          defaultActiveKey={currTabKey}
          className="tabBackgroundThick contentHolyCentered scrollable-tabs"
          onSelect={handleSoapIntroTabSelect}
        >
          {tabItems.map((item) => (
            <Tab
              key={item.key}
              eventKey={item.key}
              title={<h5>{item.title}</h5>}
            >
              {item.component}
            </Tab>
          ))}
        </Tabs>
      </Container>
    );
  } else {
    return (
      <Container id="soap-intro-container" fluid style={{ top: "62px" }}>
        <Tabs
          defaultActiveKey={currTabKey}
          className="tabBackgroundThick contentHolyCentered"
          onSelect={handleSoapIntroTabSelect}
        >
          {tabItems.map((item) => (
            <Tab
              key={item.key}
              eventKey={item.key}
              title={<h5>{item.title}</h5>}
            >
              {item.component}
            </Tab>
          ))}
        </Tabs>
      </Container>
    );
  }
};

export default SoapIntro;
