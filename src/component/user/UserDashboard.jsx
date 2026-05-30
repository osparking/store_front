import { createContext, useEffect, useState } from "react";
import { Container, Dropdown, Tab, Tabs } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "../../index.css";
import ManageQuestions from "../admin/ManageQuestions";
import AlertMessage from "../common/AlertMessage";
import BsAlertHook from "../hook/BsAlertHook";
import { deleteUserPhoto } from "../modal/ImageService";
import ManageMyOrder from "./ManageMyOrder";
import OverviewUser from "./OverviewUser";
import MyReviewsPage from "./review/MyReviewsPage";
import "./userDashboard.css";
import UserProfile from "./UserProfile";
import { getUserDtoById } from "./UserService";

export const ReviewsContext = createContext();

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

  const [activeKey, setActiveKey] = useState("profile");

  useEffect(() => {
    const dashboardTab = localStorage.getItem("DASHBOARD_TAB");
    setActiveKey(dashboardTab ? dashboardTab : "profile");
  }, []);

  const changeActiveKey = (eventKey) => {
    localStorage.setItem("DASHBOARD_TAB", eventKey);
    setActiveKey(eventKey);
  };

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

  const isVeryNarrow = useMediaQuery({ maxWidth: 599 });
  const isVeryShort = useMediaQuery({ maxHeight: 599 });
  const isMedium = useMediaQuery({ minWidth: 600, maxWidth: 1199 });
  const [reviewsVersion, setReviewsVersion] = useState(1);
  const refreshReviews = () => setReviewsVersion((prev) => prev + 1);

  const tabItems = [
    {
      key: "profile",
      title: "내 프로필",
      component: user && (
        <UserProfile user={user} handleRemovePhoto={removePhoto} />
      ),
    },
    { key: "purchase_stat", title: "구매 통계", component: <OverviewUser /> },
    {
      key: "purchase_list",
      title: "나의 주문",
      component: <ManageMyOrder />,
    },
    {
      key: "my_question",
      title: "나의 질문",
      component: <ManageQuestions mine />,
    },
    {
      key: "my_review",
      title: "나의 리뷰",
      component: <MyReviewsPage />,
    },
  ];

  const currentComponent = tabItems.find(
    (item) => item.key === activeKey,
  )?.component;

  const dashBoardContent = () => {
    if (isVeryNarrow || isVeryShort) {
      return (
        <>
          <div className="mobile-tab-header">
            <Dropdown style={{ borderRadius: "0.4rem" }}>
              <Dropdown.Toggle
                variant="outline-primary"
                className="hamburger-menu"
                style={{ fontSize: "16px" }}
              >
                {tabItems.find((item) => item.key === activeKey)?.title}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {tabItems.map((item) => (
                  <Dropdown.Item
                    key={item.key}
                    active={activeKey === item.key}
                    onClick={() => changeActiveKey(item.key)}
                  >
                    {item.title}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <div className="mobile-tab-content">
            {alertError && <AlertMessage type="danger" message={errorMsg} />}
            {alertSuccess && (
              <AlertMessage type="success" message={successMsg} />
            )}
            {currentComponent}
          </div>
        </>
      );
    } else if (isMedium) {
      return (
        <Tabs
          activeKey={activeKey}
          onSelect={changeActiveKey}
          className="tabBackgroundThick contentHolyCentered scrollable-tabs"
          id="scrollable-tabs"
        >
          {tabItems.map((item) => (
            <Tab
              className="mediumWindowDashboardTab"
              key={item.key}
              eventKey={item.key}
              title={<h5>{item.title}</h5>}
            >
              {alertError && <AlertMessage type="danger" message={errorMsg} />}
              {alertSuccess && (
                <AlertMessage type="success" message={successMsg} />
              )}
              {item.component}
            </Tab>
          ))}
        </Tabs>
      );
    } else {
      return (
        <Tabs
          activeKey={activeKey}
          onSelect={changeActiveKey}
          className="tabBackgroundThick contentHolyCentered"
        >
          {tabItems.map((item) => (
            <Tab
              key={item.key}
              eventKey={item.key}
              title={<h5>{item.title}</h5>}
            >
              {alertError && <AlertMessage type="danger" message={errorMsg} />}
              {alertSuccess && (
                <AlertMessage type="success" message={successMsg} />
              )}
              {item.component}
            </Tab>
          ))}
        </Tabs>
      );
    }
  };
  
  return (
    <Container fluid className="home-container user-dashboard">
      <ReviewsContext.Provider value={{ reviewsVersion, refreshReviews }}>
        {dashBoardContent()}
      </ReviewsContext.Provider>
    </Container>
  );
};

export default UserDashboard;
