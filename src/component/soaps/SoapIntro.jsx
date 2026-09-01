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
    setCurrTabKey(key);
  };

  const isMediumWide = useMediaQuery({ maxWidth: 1199 });
  const tabItems = [
    {
      key: "effect",
      header: "효능 소개",
      component: <Effect />,
    },
    {
      key: "ingredient",
      header: "비누 재료",
      component: <Ingredient />,
    },
    {
      key: "steps",
      header: "제조 절차",
      component: <ProduceSteps />,
    },
    {
      key: "shapes",
      header: "비누 외형",
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
      <>
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
                    {item.header}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <div className="mobile-tab-content">{currentComponent}</div>
        </Container>
      </>
    );
  }

  const tabMeta = {
    effect: {
      title: "범이비누 - 효능",
      description:
        "올리브오일 엑스트라버진 수제비누 범이비누(BumSoap)의 효능을 소개합니다.",
    },
    ingredient: {
      title: "범이비누 - 재료",
      description:
        "올리브오일 엑스트라버진 수제비누 범이비누(BumSoap)의 재료를 소개합니다.",
    },
    steps: {
      title: "범이비누 - 제조절차",
      description:
        "올리브오일 엑스트라버진 수제비누 범이비누(BumSoap) 제조 절차를 소개합니다.",
    },
    shapes: {
      title: "범이비누 - 외형",
      description:
        "올리브오일 엑스트라버진 수제비누 범이비누(BumSoap)의 모양을 소개합니다.",
    },
  };

  return (
    <>
      <title>{tabMeta[currTabKey]?.title || "범이비누 - 소개"}</title>
      <meta
        name="description"
        content={tabMeta[currTabKey]?.description || "범이비누를 소개합니다."}
      />
      <Container id="soap-intro-container" fluid>
        <Tabs
          defaultActiveKey={currTabKey}
          className={`${classes} ${isMediumWide ? "scrollable-tabs" : ""}`}
          onSelect={handleSoapIntroTabSelect}
        >
          {tabItems.map((item) => (
            <Tab
              key={item.key}
              eventKey={item.key}
              title={<h5>{item.header}</h5>}
            >
              {item.component}
            </Tab>
          ))}
        </Tabs>
      </Container>
    </>
  );
};

export default SoapIntro;
