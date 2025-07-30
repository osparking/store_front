import { useEffect, useState } from "react";
import { Col, Row, Table } from "react-bootstrap";
import { BsPlusSquareFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import AlertMessage from "../common/AlertMessage";
import BsAlertHook from "../hook/BsAlertHook";
import { getIngredientList } from "./WorkerService";

const StoredIngre = () => {
  const [ingreList, setIngreList] = useState([]);
  const [workerToDel, setWorkerToDel] = useState(null);

  const [ingreAdded, setIngreAdded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const ingreNames = Array.from(
    new Set(ingreList.map((ingre) => ingre.ingreName))
  );

  const {
    successMsg,
    setSuccessMsg,
    alertSuccess,
    setAlertSuccess,
    errorMsg,
    setErrorMsg,
    alertError,
    setAlertError,
  } = BsAlertHook();

  const navigate = useNavigate();

  const readIngredientList = () => {
    getIngredientList()
      .then((data) => {
        if (data) {
          console.log("입고 재료 목록: ", data.data);
          setIngreList(data.data);
        } else {
          console.log("로그인 페이지로");
          navigate("/login");
        }
      })
      .catch((err) => {
        setErrorMsg(err.message);
        setAlertError(true);
      });
  };

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

  useEffect(() => {
    readIngredientList();
  }, []);

  return (
    <main>
      <Row>
        <Col>
          {alertSuccess && (
            <AlertMessage type={"success"} message={successMsg} />
          )}
          {alertError && <AlertMessage type={"danger"} message={errorMsg} />}
        </Col>
        <Col>
          {" "}
          <div className="d-flex justify-content-end">
            <Link to={"/add-stored-ingre"}>
              {" "}
              <BsPlusSquareFill />
            </Link>
          </div>
        </Col>
      </Row>
      <Table bordered hover striped>
        <thead>
          <tr>
            <th>순번</th>
            <th>재료명</th>
            <th>입고일</th>
            <th>구매처</th>
            <th>용량</th>
            <th>단위</th>
            <th>수량</th>
            <th>사용기한</th>
            <th>입력일시</th>
            <th>직원명</th>
            <th colSpan={2}>작업</th>
          </tr>
        </thead>
        <tbody>
          {ingreList.map((ingredient, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{ingredient.ingreName}</td>
              <td>{ingredient.storeDate}</td>
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
              <td>{ingredient.expireDate}</td>
              <td>{ingredient.addTime}</td>
              <td>{ingredient.workerName}</td>
              <td>수정</td>
              <td>삭제</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </main>
  );
};

export default StoredIngre;
