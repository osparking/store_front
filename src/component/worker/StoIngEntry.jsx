import { useState } from "react";
import BsAlertHook from "../hook/BsAlertHook";

const StoIngEntry = () => {
  const [ingredient, setIngredient] = useState({
    ingreName: "",
    quantity: "",
    packunit: "",
    count: "",
    storeDate: "",
    buyPlace: "",
    workerId: "",
    expireDate: "",
  });

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

  return <div>StoIngEntry</div>;
};

export default StoIngEntry;
