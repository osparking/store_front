import { useEffect, useState } from "react";
import { Container, Tab, Tabs } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AlertMessage from "../common/AlertMessage";
import BsAlertHook from "../hook/BsAlertHook";
import { deleteUserPhoto } from "../modal/ImageService";
import ManageMyOrder from "./ManageMyOrder";
import "./UserDashboard.css";
import UserProfile from "./UserProfile";
import { getUserDtoById } from "./UserService";
import ManageMyReviews from "./review/ManageMyReviews";

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
    <Container fluid className="home-container">
      <Tabs className="tabBackgroundThick tabHead tabFix contentHolyCentered">
        <Tab eventKey="profile" title={<h5>내 프로필</h5>}>
          {alertError && <AlertMessage type={"danger"} message={errorMsg} />}
          {alertSuccess && (
            <AlertMessage type={"success"} message={successMsg} />
          )}
          {user && <UserProfile user={user} handleRemovePhoto={removePhoto} />}
        </Tab>
        <Tab eventKey="purchase_stat" title={<h5>구매 통계</h5>}></Tab>
        <Tab eventKey="purchase_list" title={<h5>나의 주문</h5>}>
          <ManageMyOrder />
        </Tab>
        <Tab eventKey="my_question" title={<h5>나의 질문</h5>}></Tab>
        <Tab eventKey="my_review" title={<h5>나의 리뷰</h5>}>
          <ManageMyReviews />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default UserDashboard;
