import React, { useEffect, useState } from "react";
import { Container, Tab, Tabs } from "react-bootstrap";
import AlertMessage from "../common/AlertMessage";
import BsAlertHook from "../hook/BsAlertHook";
import UserProfile from "./UserProfile";
import { getUserDtoById } from "./UserService";
import { deleteUserPhoto } from "../modal/ImageService";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./UserDashboard.css";

const UserDashboard = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const { id } = useParams();
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
        const result = await getUserDtoById(id);
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
    if (location.state) {
      const { userState } = location.state;
      setUser(userState);
    } else {
      getUser();
    }
  }, [id]);

  const removePhoto = async () => {
    try {
      const result = await deleteUserPhoto(id);
      window.location.reload();
    } catch (error) {
      setErrorMsg(error.response.data.message);
      setAlertError(true);
    }
  };

  return (
    <Container fluid className="home-container mt-3">
      <Tabs className="tabBackground">
        <Tab eventKey="profile" title={<h5>프로필</h5>}>
          {alertError && (
            <AlertMessage type={"danger"} message={errorMsg} />
          )}
          {alertSuccess && (
            <AlertMessage type={"success"} message={successMsg} />
          )}
          {user && <UserProfile user={user} handleRemovePhoto={removePhoto} />}
        </Tab>
        <Tab eventKey="purchase_stat" title={<h5>구매 통계</h5>}>
        </Tab>
        <Tab eventKey="purchase_list" title={<h5>구매 목록</h5>}>
        </Tab>
        <Tab eventKey="my_question" title={<h5>나의 질문</h5>}>
        </Tab>
        <Tab eventKey="my_review" title={<h5>나의 리뷰</h5>}>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default UserDashboard;
