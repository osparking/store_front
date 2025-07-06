import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../../index.css";
import "./ingredAccordion.css";

const IngredAccordion = ({ items, keepOthersOpen }) => {
  const [accordionItems, setAccordionItems] = useState(null);
  const imageRoot = "/src/assets/images/ingred";

  useEffect(() => {
    if (items) {
      setAccordionItems([
        ...items.map((item) => ({
          ...item,
          toggled: false,
        })),
      ]);
    }
  }, [items]);

  function handleAccordionToggle(clickedItem) {
    setAccordionItems([
      ...accordionItems.map((item) => {
        let toggled = item.toggled;
        if (clickedItem.id === item.id) {
          toggled = !item.toggled;
        } else if (!keepOthersOpen) {
          toggled = false;
        }
        return { ...item, toggled };
      }),
    ]);
  }

  function getStore(ingred) {
    if (ingred.storeUrl) {
      return (
        <Link to={ingred.storeUrl} target="_blank">
          {ingred.store}
        </Link>
      );
    }
    return ingred.store;
  }

  function AttrList({ ingred }) {
    return (
      <ol className="discType">
        <li>구매처: {getStore(ingred)}</li>
        <li>구매 단위: {ingred.buyUnit}</li>
        <li>가격/택배: {ingred.price}</li>
        <li>재료 설명: {ingred.desc}</li>
      </ol>
    );
  }

  return (
    <div className="accordion-parent w-75">
      {accordionItems
        ?.filter((item) => item.id !== "")
        .map((listItem, key) => {
          return (
            <div
              className={`accordion ${listItem.toggled ? "toggled" : ""}`}
              key={key}
            >
              <button
                className="toggle"
                onClick={() => handleAccordionToggle(listItem)}
              >
                <p>
                  재료 {listItem.id}. {listItem.name}
                </p>
                <div className="direction-indicator">
                  {listItem.toggled ? "一" : "十"}
                </div>
              </button>
              <div className="content-parent">
                <Container>
                  <Row className="m-3">
                    <Col xs={5} className="justify-content-center">
                      <div className="justify-content-center d-flex align-items-center">
                        <img
                          className="circleImg"
                          src={`${imageRoot}/${listItem.image}`}
                          alt={listItem.name}
                        />
                      </div>
                    </Col>
                    <Col className="frame-10">
                      <AttrList ingred={listItem} />
                    </Col>
                  </Row>
                </Container>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default IngredAccordion;
