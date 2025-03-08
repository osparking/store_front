import React, { useEffect, useState } from "react";
import { Container, Tab, Tabs } from "react-bootstrap";
import { useParams } from "react-router-dom";
import BsAlertHook from "../hook/BsAlertHook";
import UserProfile from "./UserProfile";
import { getUserById } from "./UserService";

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
        const result = await getUserById(userId);
        setUser(result.data);
      } catch (error) {
        setErrorMsg(error.response.data.message);
        setShowErrorAlert(true);
      }
    };
    getUser();
  }, []);

  return (
    <Container>
      <Tabs>
        <Tab>
          <UserProfile user={user} />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default UserDashboard;
