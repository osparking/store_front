import { useState } from "react";
import BsAlertHook from "../hook/BsAlertHook";
import { sendStoIngInfo } from "./WorkerService";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await sendStoIngInfo(ingredient);
      console.log("response: ", response);
      setSuccessMsg(response.message);
      setAlertSuccess(true);
    } catch (error) {
      console.log("error.response: ", error.response);
      setErrorMsg(error.response.data.message);
      setAlertError(true);
    }
  };
  
  return <div>StoIngEntry</div>;
};

export default StoIngEntry;
