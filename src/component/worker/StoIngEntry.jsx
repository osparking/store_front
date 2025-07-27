import { useState } from "react";
import BsAlertHook from "../hook/BsAlertHook";

const StoIngEntry = () => {
  const [ingredient, setIngredient] = useState({
    ingreName: "가성소다",
    quantity: "1",
    packunit: "kg",
    count: "1",
    storeDate: "2020-11-29",
    buyPlace: "https://smartstore.naver.com/vase_shop/",
    expireDate: "2120-11-28",
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

  const handleChange = (e) => {
    setUser({ ...ingredient, [e.target.name]: e.target.value });
  };

  return <div>StoIngEntry</div>;
};

export default StoIngEntry;
