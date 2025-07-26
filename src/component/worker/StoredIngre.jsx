import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BsAlertHook from "../hook/BsAlertHook";
import { getIngredientList } from "./WorkerService";

const StoredIngre = () => {
  const [ingreList, setIngreList] = useState([]);
  const [showDelModal, setShowDelModal] = useState(false);
  const [workerToDel, setWorkerToDel] = useState(null);

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

  useEffect(() => {
    readIngredientList();
  }, []);

  return <div>입고 재료 목록</div>;
};

export default StoredIngre;
