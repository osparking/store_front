import { useState } from "react";
import { Container, Dropdown, Tab, Tabs } from "react-bootstrap";
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

  const classes = "tabBackgroundThick contentHolyCentered";
    
  const isVeryShort = useMediaQuery({ maxHeight: 576 });
  const currentComponent = tabItems.find(
    (item) => item.key === currTabKey,
  )?.component;

  if (isVeryShort) {
    return (
      <Container id="soap-intro-container" fluid>
        <div
          className="mobile-tab-header"
          style={{ position: "fixed", top: "44px", right: "40px" }}
        >
          <Dropdown className="soapIntro">
            <Dropdown.Toggle
              variant="outline-primary"
              className="hamburger-menu"
            >
              ☰ {tabItems.find((item) => item.key === currTabKey)?.title}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {tabItems.map((item) => (
                <Dropdown.Item
                  key={item.key}
                  active={currTabKey === item.key}
                  onClick={() => setCurrTabKey(item.key)}
                >
                  {item.title}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <div className="mobile-tab-content">{currentComponent}</div>
      </Container>
    );
  }

  return (
    <Container id="soap-intro-container" fluid>
      <Tabs
        defaultActiveKey={currTabKey}
        className={`${classes} ${isMedium ? "scrollable-tabs" : ""}`}
        onSelect={handleSoapIntroTabSelect}
      >
        {tabItems.map((item) => (
          <Tab key={item.key} eventKey={item.key} title={<h5>{item.title}</h5>}>
            {item.component}
          </Tab>
        ))}
      </Tabs>
    </Container>
  );
};

export default SoapIntro;
