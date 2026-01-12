import { useEffect, useState } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../auth/AuthService";
import "./navBar.css";

const NavBar = () => {
  const beforeLogin = localStorage.getItem("TOKEN") === null;

  const [isAdmin, setIsAdmin] = useState(false);
  const [isWorker, setIsWorker] = useState(false);

  const [identity, setIdentity] = useState();
  const checkIfAdmin = () => {
    const isAdminJson = localStorage.getItem("IS_ADMIN");
    setIsAdmin(isAdminJson ? JSON.parse(isAdminJson) : false);

    const isWorkerJson = localStorage.getItem("IS_WORKER");
    setIsWorker(isWorkerJson ? JSON.parse(isWorkerJson) : false);

    const userJson = localStorage.getItem("USER");
    const user = JSON.parse(userJson);
    if (user) {
      if (user.loginMethod === "이메일") {
        setIdentity(user.fullName);
      } else {
        setIdentity("(" + user.loginMethod + ")");
      }
    }
  };
  const navigate = useNavigate();
  const navigateHome = () => {
    setIsAdmin(false);
    navigate("/");
  };
  const loginId = localStorage.getItem("LOGIN_ID");

  window.addEventListener("loginEvt", checkIfAdmin);
  window.addEventListener("logoutEvt", navigateHome);

  useEffect(() => {
    checkIfAdmin();
  }, []);

  return (
    <Navbar expand="lg" sticky="top" className="nav-bg">
      <Container>
        <Navbar.Brand
          to={"/"}
          as={Link}
          className="nav-home bumsoap-color-dark"
        >
          범이비누
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link to={"/soap_intro"} as={Link} className="bold">
              비누 소개
            </Nav.Link>
            <Nav.Link to={"/buy_soap"} as={Link} className="bold serif">
              <span style={{ color: "deeppink" }}> 비누 주문</span>
            </Nav.Link>
            {isAdmin && (
              <Nav.Link to={`/dashboard/admin`} as={Link}>
                관리자
              </Nav.Link>
            )}
            {(isAdmin || isWorker) && (
              <Nav.Link to={"/work_item"} as={Link} className="bold">
                직원 직무
              </Nav.Link>
            )}
          </Nav>
          <Nav className="me-2 identity">
            {beforeLogin ? "(로그인 전)" : `${identity}`}
          </Nav>
          <Nav>
            <NavDropdown title="계정" id="basic-nav-dropdown" className="me-2">
              {beforeLogin ? (
                <>
                  <NavDropdown.Item to={"/login"} as={Link}>
                    로그인
                  </NavDropdown.Item>
                </>
              ) : (
                <>
                  <NavDropdown.Item to={"#"} as={Link} onClick={logoutUser}>
                    로그아웃
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item to={`/dashboard/${loginId}/user`} as={Link}>
                    대시보드
                  </NavDropdown.Item>
                  {isAdmin && (
                    <>
                      <NavDropdown.Divider />
                      <NavDropdown.Item to={`/dashboard/admin`} as={Link}>
                        관리자
                      </NavDropdown.Item>
                    </>
                  )}
                  <NavDropdown.Divider />
                  <NavDropdown.Item to={`/user/${loginId}/update`} as={Link}>
                    내 정보 수정
                  </NavDropdown.Item>
                </>
              )}
              <NavDropdown.Divider />
              <NavDropdown.Item to={"/register_user"} as={Link}>
                등록
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav.Link className="identity" to={"/question"} as={Link}>
            <span
              style={{ fontSize: "0.9em", color: "blue", fontWeight: "bold" }}
            >
              질문하기
            </span>
          </Nav.Link>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
