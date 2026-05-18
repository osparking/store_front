import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { BsPencilFill, BsTrashFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import "./WorkerTable.css";

const IngredientTable = (
  ingreList,
  currIngrePage,
  openWithRow,
  handleShowDelModal,
) => {
  function isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (e) {
      return false;
    }
  }

  function getDomain(url) {
    let domain = new URL(url);
    domain = domain.hostname;
    return domain;
  }

  const ingredientTableColumnGroup = () => {
    return (
      <colgroup>
        <col style={{ width: "5%" }} />
        <col style={{ width: "13%" }} />
        <col style={{ width: "14%" }} />
        <col style={{ width: "5%" }} />
        <col style={{ width: "5%" }} />
        <col style={{ width: "5%" }} />
        <col style={{ width: "11%" }} />
        <col style={{ width: "11%" }} />
        <col style={{ width: "9%" }} />
        <col style={{ width: "5%" }} />
        <col style={{ width: "5%" }} />
      </colgroup>
    );
  };

  return (
    <div
      className="worker-table-wrapper ingredient"
      style={{ width: "fit-content" }}
    >
      {/* Fixed Header Section */}
      <div className="table-header">
        <table className="table table-bordered table-hover table-striped styled-data-table">
          {ingredientTableColumnGroup()}
          <thead>
            <tr>
              <th>순번</th>
              <th>재료명</th>
              <th>구매처</th>
              <th>용량</th>
              <th>단위</th>
              <th>수량</th>
              <th>입고일</th>
              <th>사용기한</th>
              <th>직원명</th>
              <th colSpan={2}>작업</th>
            </tr>
          </thead>
        </table>
      </div>

      {/* Scrollable Body Section */}
      <div className="table-body ingredient">
        <table className="table table-bordered table-hover table-striped styled-data-table">
          {ingredientTableColumnGroup()}
          <tbody>
            {ingreList.map((ingredient, index) => (
              <tr key={index}>
                <td>{(currIngrePage - 1) * 10 + index + 1}</td>
                <td>{ingredient.ingreName}</td>
                <td>
                  {isValidUrl(ingredient.buyPlace) ? (
                    <Link to={ingredient.buyPlace} target="_blank">
                      {getDomain(ingredient.buyPlace)}
                    </Link>
                  ) : (
                    ingredient.buyPlace
                  )}
                </td>
                <td>{ingredient.quantity}</td>
                <td>{ingredient.packunit}</td>
                <td>{ingredient.count}</td>
                <td>{ingredient.storeDate}</td>
                <td>{ingredient.expireDate}</td>
                <td>{ingredient.workerName}</td>
                <td>
                  <OverlayTrigger
                    overlay={
                      <Tooltip id={`tooltip-view-${index}`}>정보 편집</Tooltip>
                    }
                  >
                    <Button
                      size="sm"
                      style={{ backgroundColor: "transparent", border: "none" }}
                      onClick={() => openWithRow(ingredient)}
                    >
                      <BsPencilFill className="text-success" />
                    </Button>
                  </OverlayTrigger>
                </td>
                <td>
                  <OverlayTrigger
                    overlay={
                      <Tooltip id={`tooltip-view-${index}`}>
                        입고 기록 삭제
                      </Tooltip>
                    }
                  >
                    <Link
                      to={"#"}
                      className="text-danger"
                      onClick={() => handleShowDelModal(ingredient.id)}
                    >
                      <BsTrashFill />
                    </Link>
                  </OverlayTrigger>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IngredientTable;
