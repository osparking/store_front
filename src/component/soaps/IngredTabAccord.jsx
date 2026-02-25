import { Fragment, useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../../index.css";
import "./ingredient.css";
import "./ingredTabAccord.css";

const IngredTabAccord = ({ ingAllData, keepOthersOpen }) => {
  const [accordionItems, setAccordionItems] = useState(null);

  useEffect(() => {
    if (ingAllData) {
      setAccordionItems([
        ...ingAllData.map((item) => ({
          ...item,
          expanded: false,
        })),
      ]);
    }
  }, [ingAllData]);

  function handleAccordionToggle(clickedItem) {
    setAccordionItems([
      ...accordionItems.map((item) => {
        let expanded = item.expanded;
        if (clickedItem.id === item.id) {
          expanded = !item.expanded;
        } else if (!keepOthersOpen) {
          expanded = false;
        }
        const status = JSON.stringify({ ...item, expanded });
        console.log("item stat: " + status);
        return { ...item, expanded };
      }),
    ]);
  }

  const imageRoot = "/ingred";

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
      <ul>
        <li className="disc">구매처: {getStore(ingred)}</li>
        <li className="disc">구매 단위: {ingred.buyUnit}</li>
        <li className="disc">가격/택배: {ingred.price}</li>
        <li className="disc">재료 설명: {ingred.desc}</li>
      </ul>
    );
  }

  const ingAllRows = accordionItems?.map((ingredient, idx) => {
    return (
      <Fragment key={idx}>
        {/* Clickable header row */}
        <tr className={ingredient.id === "" ? "sumRow" : ""}>
          <td>{ingredient.id}</td>
          <td className="text-center">
            {ingredient.id ? (
              <div style={{ display: "flex", alignItems: "center" }}>
                <button
                  style={{ width: "100%" }}
                  className="toggle text-end"
                  onClick={() => handleAccordionToggle(ingredient)}
                >
                  {ingredient.name}
                </button>
                <small>
                  <span className="direction-indicator simple">
                    {ingredient.expanded ? "一" : "十"}
                  </span>
                </small>
              </div>
            ) : (
              ingredient.name
            )}
          </td>
          <td className="text-center">{ingredient.weight}</td>
          <td className="text-center">{ingredient.incRate}</td>
          <td className="text-start">{ingredient.etcEffect}</td>
        </tr>

        {/* Toggleable content row */}
        <tr
          className={`accordion-content ${ingredient.expanded ? "expanded" : ""}`}
        >
          <td colSpan={2}>
            <img
              className={ingredient.id === 2 ? "squareImg" : "circleImg"}
              src={`${imageRoot}/${ingredient.image}`}
              alt={ingredient.name}
            />
          </td>
          <td colSpan={3}>
            <AttrList ingred={ingredient} />
          </td>
        </tr>
      </Fragment>
    );
  });

  return (
    <Table striped hover className="mt-0" id="ingredientTable">
      <thead>
        <tr className="text-center">
          <th>#</th>
          <th>재료명</th>
          <th>중량(g)</th>
          <th>비율(%)</th>
          <th>비고/효능</th>
        </tr>
      </thead>
      <tbody>{ingAllRows}</tbody>
    </Table>
  );
};

export default IngredTabAccord;
