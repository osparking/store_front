import React, { useEffect, useState } from "react";
import { Container, Tab, Tabs } from "react-bootstrap";
import AlertMessage from "../common/AlertMessage";
import BsAlertHook from "../hook/BsAlertHook";
import UserProfile from "./UserProfile";
import { getUserDtoById } from "./UserService";
import { deleteUserPhoto } from "../modal/ImageService";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const userId = localStorage.getItem("userId");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
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

  useEffect(() => {
    const getUser = async () => {
      try {
        const result = await getUserDtoById(userId);
        if (result) {
          setUser(result.data);
        } else {
          navigate("/login");
        }
      } catch (error) {
        const errMsg = error.response.data.error;
        setErrorMsg(errMsg === "Bad Request" ? "잘못된 요청" : errMsg);
        setAlertError(true);
      }
    };
    getUser();
  }, [userId]);

  const removePhoto = async () => {
    try {
      const result = await deleteUserPhoto(userId);
      window.location.reload();
    } catch (error) {
      setErrorMsg(error.response.data.message);
      setAlertError(true);
    }
  };

  return (
    <Container>
      <Tabs>
        <Tab eventKey="profile" title={<h3>프로필</h3>}>
          {alertError && (
            <AlertMessage type={"danger"} message={errorMsg} />
          )}
          {alertSuccess && (
            <AlertMessage type={"success"} message={successMsg} />
          )}
          {user && <UserProfile user={user} handleRemovePhoto={removePhoto} />}
        </Tab>
        <Tab eventKey="purchase_stat" title={<h3>구매 통계</h3>}>
        </Tab>
        <Tab eventKey="purchase_list" title={<h3>구매 목록</h3>}>
        </Tab>
        <Tab eventKey="my_question" title={<h3>나의 질문</h3>}>
        </Tab>
        <Tab eventKey="my_review" title={<h3>나의 리뷰</h3>}>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default UserDashboard;
