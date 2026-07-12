import { useEffect, useRef, useState } from "react";
import { Container, Dropdown, Tab, Tabs } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";
import { useLocation } from "react-router-dom";
import "../../index.css";
import "../user/userDashboard.css";
import BumShapes from "./BumShapes";
import Effect from "./Effect";
import Ingredient from "./Ingredient";
import ProduceSteps from "./ProduceSteps";
import "./soapIntro.css";

const SoapIntro = () => {
  const location = useLocation();
  const selectedTab = location.state?.selectedTab;

  const [currTabKey, setCurrTabKey] = useState(() => {
    return selectedTab || localStorage.getItem("SOAP_INTRO_TAB") || "effect";
  });

  const imageRowRef = useRef(null);

  useEffect(() => {
    if (selectedTab) {
      localStorage.setItem("SOAP_INTRO_TAB", selectedTab);
      if (selectedTab === "shapes") {
        if (location.state.scrollTo === "imageRowRef") {
          imageRowRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    }
    // selectedTab을 히스토리에서 제거 (F5 부활 방지)
    const currentState = window.history.state;

    if (currentState?.usr?.selectedTab) {
      // usr 객체를 복사하고 selectedTab 키만 삭제
      const newUsr = { ...currentState.usr };
      delete newUsr.selectedTab;

      // 기존 state는 유지하되, usr만 교체하여 replaceState 호출
      window.history.replaceState(
        { ...currentState, usr: newUsr },
        "", // title (보통 빈 문자열)
      );
    }
  }, [selectedTab]); // 빈 배열: 최초 1회만 실행

  const handleSoapIntroTabSelect = (key) => {
    localStorage.setItem("SOAP_INTRO_TAB", key);
  };

  const isMediumWide = useMediaQuery({ maxWidth: 1199 });
  const tabItems = [
    {
      key: "effect",
      title: "효능 소개",
      component: <Effect />,
    },
    {
      key: "ingredient",
      title: "비누 재료",
      component: <Ingredient />,
    },
    {
      key: "steps",
      title: "제조 절차",
      component: <ProduceSteps />,
    },
    {
      key: "shapes",
      title: "비누 외형",
      component: <BumShapes imageRowRef={imageRowRef} />,
    },
  ];

  const classes = "tabBackgroundThick contentHolyCentered";

  const isVeryShort = useMediaQuery({ maxHeight: 599 });
  const isVeryNarrow = useMediaQuery({ maxWidth: 599 });

  const currentComponent = tabItems.find(
    (item) => item.key === currTabKey,
  )?.component;

  if (isVeryShort || isVeryNarrow) {
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
        className={`${classes} ${isMediumWide ? "scrollable-tabs" : ""}`}
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
