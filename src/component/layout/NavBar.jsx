import { useEffect, useState } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from "../auth/AuthService";
import { getStorageToken } from "../util/utilities";
import "./navBar.css";

const NavBar = () => {
  const beforeLogin = getStorageToken() === null;

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
        setIdentity("<" + user.loginMethod + ">");
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

  const [activeLinkText, setActiveLinkText] = useState("");
  const location = useLocation();

  const getActiveLinkText = (pathname) => {
    if (pathname === "/") return "홈 페이지";
    if (pathname === "/soap_intro") return "비누 소개";
    if (pathname === "/buy_soap") return "비누 주문";
    if (pathname === "/question") return "질문하기";
    if (pathname === "/register_user") return "등록";
    if (pathname.startsWith("/dashboard/admin")) return "관리 업무";
    if (pathname === "/work_item") return "직원 직무";
    if (pathname === "/login") return "로그인";
    if (pathname.startsWith("/dashboard/") && pathname.includes("/user"))
      return "대시보드";
    if (pathname.includes("/update")) return "내 정보 수정";
    return "";
  };

  useEffect(() => {
    setActiveLinkText(getActiveLinkText(location.pathname));
  }, [location]);

  return (
    <Navbar expand="lg" sticky="top" className="nav-bg start-0 end-0">
      <Container>
        <Navbar.Brand
          to={"/"}
          as={Link}
          className="nav-home bumsoap-color-dark"
        >
          범이비누
        </Navbar.Brand>

        <Navbar.Toggle id="mainHamburger" aria-controls="responsive-navbar-nav">
          <div className="active-link-text-mobile">{activeLinkText}</div>
          <span className="navbar-toggler-icon"></span>
        </Navbar.Toggle>

        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              to={"/soap_intro"}
              as={NavLink}
              activeclassname="active-link"
            >
              비누 소개
            </Nav.Link>
            <Nav.Link
              to={"/buy_soap"}
              as={NavLink}
              activeclassname="active-link"
            >
              비누 주문
            </Nav.Link>
            {isAdmin && (
              <Nav.Link
                to={`/dashboard/admin`}
                as={NavLink}
                activeclassname="active-link"
              >
                관리 업무
              </Nav.Link>
            )}
            {(isAdmin || isWorker) && (
              <Nav.Link
                to={"/work_item"}
                as={NavLink}
                activeclassname="active-link"
              >
                직원 직무
              </Nav.Link>
            )}
          </Nav>
          <Nav className="me-2 identity">
            {beforeLogin ? "(로그인 전)" : `[${identity}]`}
          </Nav>
          <Nav>
            <NavDropdown
              title="계정"
              style={{ fontWeight: "bold" }}
              id="basic-nav-dropdown"
              className="me-2"
            >
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
                        관리 업무
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
          <Nav.Link to={"/question"} as={Link}>
            <span style={{ fontWeight: "bold" }}>질문 등록</span>
          </Nav.Link>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
