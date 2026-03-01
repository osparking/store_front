import { useEffect, useState } from "react";
import {
  Button,
  Col,
  OverlayTrigger,
  Row,
  Table,
  Tooltip,
} from "react-bootstrap";
import { BsPencilFill, BsPlusSquareFill, BsTrashFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import AlertMessage from "../common/AlertMessage";
import ItemFilter from "../common/ItemFilter";
import Paginator from "../common/Paginator";
import BsAlertHook from "../hook/BsAlertHook";
import DeleteConfirmModal from "../modal/DeleteConfirmModal";
import IngreDataModal from "./IngreDataModal";
import { deleteStoredIngre, getIngredientList } from "./WorkerService";
import "./ManageIngredient.css";

const ManageIngredient = () => {
  const [ingreList, setIngreList] = useState([]);
  const [workerToDel, setWorkerToDel] = useState(null);

  const [ingreAdded, setIngreAdded] = useState(false);
  const [ingreUpdated, setIngreUpdated] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const ingreNames = Array.from(
    new Set(ingreList.map((ingre) => ingre.ingreName)),
  );

  const [selectedName, setSelectedName] = useState(
    localStorage.getItem("INGRE_NAME") || "",
  );

  const changeSelectedName = (e) => {
    setSelectedName(e);
  };

  const handleClearFilter = () => {
    setSelectedName("");
  };

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

  const [filtered, setFiltered] = useState([]);

  const [currIngrePage, setCurrIngrePage] = useState(
    localStorage.getItem("CURR_INGRE_PAGE") || 1,
  );

  useEffect(() => {
    if (ingreAdded || ingreUpdated) {
      readIngredientList();
      if (ingreUpdated) {
        setIngreUpdated(false);
      }
    }
  }, [ingreAdded, ingreUpdated]);

  useEffect(() => {
    const totalPages = Math.ceil(filtered.length / ingresPerPage);
    const currPage = localStorage.getItem("CURR_INGRE_PAGE");
    // 현재 페이지가 총 페이지를 초과해도, 총 페이지를 현재 페이지에 배정
    if (ingreAdded || totalPages < currPage) {
      setCurrIngrePage(totalPages > 0 ? totalPages : 1);
      if (ingreAdded) {
        setIngreAdded(false);
      }
    } else {
      setCurrIngrePage(currPage);
    }
  }, [filtered]);

  useEffect(() => {
    localStorage.setItem("CURR_INGRE_PAGE", currIngrePage);
  }, [currIngrePage]);

  useEffect(() => {
    localStorage.setItem("INGRE_NAME", selectedName);
    if (selectedName) {
      setFiltered(
        ingreList.filter((ingre) => ingre.ingreName === selectedName),
      );
    } else {
      setFiltered(ingreList);
    }
  }, [ingreList, selectedName]);

  const [ingresPerPage] = useState(5);
  const indexOfLastIngre = currIngrePage * ingresPerPage;
  const indexOfFirstIngre = indexOfLastIngre - ingresPerPage;
  const currIngres = filtered.slice(indexOfFirstIngre, indexOfLastIngre);

  const [ingredient, setIngredient] = useState({});

  let expireDate = new Date();
  expireDate.setFullYear(expireDate.getFullYear() + 1);

  const dummy = {
    ingreName: "가성소다",
    quantity: "1",
    packunit: "kg",
    count: "1",
    storeDate: new Date(),
    buyPlace: "https://smartstore.naver.com/vase_shop/",
    expireDate: expireDate,
  };

  const openWithRow = (row) => {
    setIngredient(row);
    setShowModal(true);
  };

  const [showDelModal, setShowDelModal] = useState(false);
  const [ingIdToDel, setIngIdToDel] = useState(null);
  const [delBtnDisabled, setDelBtnDisabled] = useState(false);

  const handleShowDelModal = (ingId) => {
    setShowDelModal(true);
    setIngIdToDel(ingId);
  };

  const handleIngreDelete = async () => {
    if (ingIdToDel) {
      try {
        setDelBtnDisabled(true);
        const result = await deleteStoredIngre(ingIdToDel);
        setSuccessMsg(result.message);
        setAlertSuccess(true);
        setShowDelModal(false);
        readIngredientList();
      } catch (err) {
        console.error("err:", err);
        setErrorMsg(err.message);
        setAlertError(true);
      } finally {
        setDelBtnDisabled(false);
      }
    }
  };

  return (
    <div>
      <h5 className="chart-title">재료 관리</h5>
      <DeleteConfirmModal
        show={showDelModal}
        onHide={() => setShowDelModal(false)}
        handleDeletion={handleIngreDelete}
        target="입고 재료 정보의"
        disabled={delBtnDisabled}
      />

      <Row className="mb-2">
        <Col md={6}>
          <ItemFilter
            label={"재료명"}
            options={ingreNames}
            selectedOption={selectedName}
            onOptionSelection={changeSelectedName}
            // onOptionSelection={(e) => setSelectedName(e)}
            onClearFilter={handleClearFilter}
          />
        </Col>
        <Col>
          {" "}
          <div className="d-flex justify-content-end">
            <Button onClick={() => openWithRow(dummy)}>
              <BsPlusSquareFill />
            </Button>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          {alertSuccess && (
            <AlertMessage type={"success"} message={successMsg} />
          )}
          {alertError && <AlertMessage type={"danger"} message={errorMsg} />}
        </Col>
      </Row>
      <div className="ingredient-table-container">
        <Table
          bordered
          hover
          striped
          style={{ tableLayout: "fixed", minWidth: "730px" }}
        >
          <colgroup>
            <col style={{ width: "6%" }} />
            <col style={{ width: "9%" }} />
            <col style={{ width: "9%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "6%" }} />
            <col style={{ width: "6%" }} />
            <col style={{ width: "6%" }} />
            <col style={{ width: "11%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "9%" }} />
            <col style={{ width: "5%" }} />
            <col style={{ width: "5%" }} />
          </colgroup>
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
            {currIngres.map((ingredient, index) => (
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
        </Table>
      </div>
      <IngreDataModal
        show={showModal}
        closer={() => setShowModal(false)}
        setIngreAdded={setIngreAdded}
        setIngreUpdated={setIngreUpdated}
        ingredient={ingredient}
        setIngredient={setIngredient}
      />
      <Paginator
        pageSize={ingresPerPage}
        totalItems={filtered.length}
        currPage={currIngrePage}
        setCurrPage={setCurrIngrePage}
      />
    </div>
  );
};

export default ManageIngredient;
