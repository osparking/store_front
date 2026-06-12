import { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { BsPlusSquareFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import AlertMessage from "../common/AlertMessage";
import ItemFilter from "../common/ItemFilter";
import Paginator from "../common/Paginator";
import BsAlertHook from "../hook/BsAlertHook";
import DeleteConfirmModal from "../modal/DeleteConfirmModal";
import { getRecordRange } from "../util/utilities";
import IngreDataModal from "./IngreDataModal";
import IngredientTable from "./IngredientTable";
import {
  deleteStoredIngre,
  getAllIngreNames,
  getIngredientPage,
} from "./WorkerService";

const ManageIngredient = () => {
  const [ingreList, setIngreList] = useState([]);
  const [workerToDel, setWorkerToDel] = useState(null);

  const [ingreAdded, setIngreAdded] = useState(false);
  const [ingreUpdated, setIngreUpdated] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [ingreNames, setIngreNames] = useState([]);
  const [selectedName, setSelectedName] = useState(
    localStorage.getItem("INGRE_NAME") || "",
  );

  const [ingrePage, setIngrePage] = useState({});

  const handleClearFilter = () => {
    setSelectedName("");
    changePage(1);
    localStorage.removeItem("INGRE_NAME");
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

  const readIngredientPage = (pageNo) => {
    getIngredientPage(selectedName, pageNo, ingresPerPage)
      .then((response) => {
        if (response) {
          setIngrePage(response.pageContent);
          setIngreList(response.pageContent.content);
          setTotalPages(response.totalPages);
        } else {
          navigate("/login");
        }
      })
      .catch((err) => {
        setErrorMsg(err.message);
        setAlertError(true);
      });
  };

  useEffect(() => {
    if (selectedName) {
      localStorage.setItem("INGRE_NAME", selectedName);
    } else {
      localStorage.removeItem("INGRE_NAME");
    }
    readIngredientPage(currIngrePage);
    const readIngreNames = async () => {
      try {
        const response = await getAllIngreNames();
        setIngreNames(response.data);
      } catch (error) {
        console.error(error.response.data.message);
      }
    };
    readIngreNames();
  }, [selectedName]);

  const [currIngrePage, setCurrIngrePage] = useState(
    parseInt(localStorage.getItem("CURR_INGRE_PAGE")) || 1,
  );

  useEffect(() => {
    if (ingreAdded) {
      handleClearFilter();
    }

    if (ingreAdded || ingreUpdated) {
      readIngredientPage(currIngrePage);
      if (ingreUpdated) {
        setIngreUpdated(false);
      } else {
        setIngreAdded(false);
      }
    }
  }, [ingreAdded, ingreUpdated]);

  const [totalPages, setTotalPages] = useState(1);

  const changePage = (pageNo) => {
    localStorage.setItem("CURR_INGRE_PAGE", pageNo);
    setCurrIngrePage(pageNo);
    readIngredientPage(pageNo);
  };

  const handleFilterChange = (name) => {
    setSelectedName(name);
    changePage(1);
  };

  const [ingresPerPage] = useState(10);
  const indexOfLastIngre = currIngrePage * ingresPerPage;
  const indexOfFirstIngre = indexOfLastIngre - ingresPerPage;

  const [ingredient, setIngredient] = useState({});

  let expireDate = new Date();
  expireDate.setFullYear(expireDate.getFullYear() + 1);

  const dummy = {
    ingreName: "",
    quantity: "1",
    packunit: "kg",
    count: "1",
    storeDate: new Date(),
    buyPlace: "",
    expireDate: expireDate,
  };

  const openWithRow = (row) => {
    setIngredient(row);
    setShowModal(true);
  };

  const [showDelModal, setShowDelModal] = useState(false);
  const [ingIdToDel, setIngIdToDel] = useState(null);
  const [delBtnDisabled, setDelBtnDisabled] = useState(false);

  const [ingNameToDel, setIngNameToDel] = useState();
  const handleShowDelModal = (ingId, ingName) => {
    setIngNameToDel(ingName);
    setShowDelModal(true);
    setIngIdToDel(ingId);
  };

  const handleIngreDelete = async (isPageLastItem) => {
    if (ingIdToDel) {
      try {
        setDelBtnDisabled(true);
        const result = await deleteStoredIngre(ingIdToDel);
        setSuccessMsg(result.message);
        setAlertSuccess(true);
        setShowDelModal(false);
        if (isPageLastItem && currIngrePage > 1) {
          changePage(currIngrePage - 1);
        } else {
          readIngredientPage(currIngrePage);
        }
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
    <div className="main-container">
      <DeleteConfirmModal
        show={showDelModal}
        onHide={() => setShowDelModal(false)}
        handleDeletion={handleIngreDelete}
        target={ingNameToDel}
        disabled={delBtnDisabled}
        isPageLastItem={ingreList.length === 1}
        modalClass="delete-ingredient-confirm"
      />

      <Row className="mb-2 justify-content-center">
        <Col
          xs={12}
          md={7}
          className="d-flex justify-content-start"
          style={{ maxWidth: "400px" }}
        >
          <ItemFilter
            label={"재료명"}
            options={ingreNames}
            selectedOption={selectedName}
            onOptionSelection={handleFilterChange}
            onClearFilter={handleClearFilter}
          />
          <div className="ms-2 justify-content-end mt-1">
            <Button
              onClick={() => openWithRow(dummy)}
              className="d-inline-flex align-items-center"
            >
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
      <div className="justify-content-center align-items-center">
        <p className="text-center mb-0">
          {getRecordRange(
            ingrePage,
            indexOfFirstIngre,
            indexOfLastIngre,
            "재료",
          )}
        </p>
      </div>
      <div style={{ overflow: "auto" }}>
        {IngredientTable(
          ingreList,
          currIngrePage,
          openWithRow,
          handleShowDelModal,
        )}
      </div>
      <IngreDataModal
        show={showModal}
        closer={() => setShowModal(false)}
        setIngreAdded={setIngreAdded}
        setIngreUpdated={setIngreUpdated}
        ingredient={ingredient}
        setIngredient={setIngredient}
      />
      <div className="pb-1">
        <Paginator
          pageSize={ingresPerPage}
          totalItems={ingrePage.totalElements}
          totalPages={totalPages}
          currPage={currIngrePage}
          setCurrPage={(pageNo) => changePage(pageNo)}
          darkBackground="true"
        />
      </div>
    </div>
  );
};

export default ManageIngredient;
