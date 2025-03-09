import React, { useEffect, useState } from "react";
import { Container, Tab, Tabs } from "react-bootstrap";
import { useParams } from "react-router-dom";
import BsAlertHook from "../hook/BsAlertHook";
import UserProfile from "./UserProfile";
import { getUserDtoById } from "./UserService";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const [file, setFile] = useState(null);
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
        setUser(result.data);
      } catch (error) {
        setErrorMsg(error.response.data.message);
        setAlertError(true);
      }
    };
    getUser();
  }, []);

  return (
    <Container>
      <Tabs>
        <Tab eventKey="profile" title={<h3>프로필</h3>}>
          {user && <UserProfile user={user} />}
        </Tab>
        <Tab eventKey="purchase_stat" title={<h3>구매 통계</h3>}>
          {user && <UserProfile user={user} />}
        </Tab>
        <Tab eventKey="purchase_list" title={<h3>구매 목록</h3>}>
          {user && <UserProfile user={user} />}
        </Tab>
        <Tab eventKey="my_question" title={<h3>나의 질문</h3>}>
          {user && <UserProfile user={user} />}
        </Tab>
        <Tab eventKey="my_review" title={<h3>나의 리뷰</h3>}>
          {user && <UserProfile user={user} />}
        </Tab>
      </Tabs>
    </Container>
  );
};

export default UserDashboard;
