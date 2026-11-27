import { useEffect, useState } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import toast from "react-hot-toast";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from "../auth/AuthService";
import { useAuthContext } from "../common/AuthContext";
import "./navBar.css";
import { useRoot } from "./RootContext";

const naviAskedIds = new Set();

const NavBar = () => {
  const { userVersion } = useRoot();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isWorker, setIsWorker] = useState(false);

  const { authState, identity, meInfo } = useAuthContext();
  const loggedIn = authState === "authenticated";
  const setIsEmployee = (isAdmin, isWorker) => {
    setIsAdmin(isAdmin);
    setIsWorker(isWorker);
  };

  const clearLoginInfo = () => {
    setIsEmployee(false, false);
    setLoginId("");
  };

  const navigate = useNavigate();
  const [loginId, setLoginId] = useState("");

  useEffect(() => {
    const readEmployeeStatus = () => {
      try {
        setIsEmployee(meInfo.admin, meInfo.worker);
        setLoginId(meInfo.id);
      } catch (e) {
        clearLoginInfo();
      }
    };

    // 인증된 상태에서만 호출
    if (loggedIn) {
      readEmployeeStatus();
    } else {
      clearLoginInfo();
    }

    const handleLogin = () => readEmployeeStatus();

    const handleLogout = (event) => {
      const nowTimeId = Math.floor(Date.now() / 1000);
      if (!naviAskedIds.has(nowTimeId)) {
        const { path, message } = event?.detail || { path: "", message: "" };

        clearLoginInfo();
        if (message) {
          navigate(path, { state: { success: false, message, id: nowTimeId } });
        } else {
          navigate(path);
        }
        naviAskedIds.add(nowTimeId);
      }
    };

    window.addEventListener("loginEvt", handleLogin);
    window.addEventListener("logoutEvt", handleLogout);

    return () => {
      window.removeEventListener("logoutEvt", handleLogout);
      window.removeEventListener("loginEvt", handleLogin);
    };
  }, [loggedIn]); // ← 의존성 배열에 loggedIn 추가

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

  const handleRegisterClick = (e) => {
    e.preventDefault(); // 기본 이동 막음

    if (loginId) {
      const confirmed = window.confirm("로그아웃하고 계정을 등록할까요?");
      if (confirmed) {
        // 로그아웃 처리 (예: 상태 초기화, localStorage 제거 등)
        const result = logoutUser({ path: "/register_user", message: "" });
      } else {
        // 아무것도 하지 않음 (현재 페이지 유지)
        return;
      }
    } else {
      // 이미 로그아웃 상태거나 관리자면 바로 등록 페이지로
      navigate("/register_user");
    }
  };

  const logoutNavBar = async () => {
    try {
      const result = await logoutUser(); // 1

      toast.success(result?.message);
    } catch (e) {
      toast.error(e.response.data.message);
    }
  };

  return (
    <Navbar expand="lg" sticky="top" className="nav-bg start-0 end-0">
      <Container className="navbar">
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
              className="pb-0"
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
            {loggedIn && isAdmin && (
              <Nav.Link
                to={`/dashboard/admin`}
                as={NavLink}
                activeclassname="active-link"
              >
                관리 업무
              </Nav.Link>
            )}
            {loggedIn && (isAdmin || isWorker) && (
              <Nav.Link
                to={"/work_item"}
                as={NavLink}
                activeclassname="active-link"
              >
                직원 직무
              </Nav.Link>
            )}
          </Nav>
          <Nav className="me-2 userTitle">
            <span className={loggedIn ? "bumsoap-color-dark" : ""}>
              {loggedIn ? `${identity}` : "(로그인 전)"}
            </span>
            {loggedIn && <span className="narrow-left-space">님</span>}
          </Nav>
          <Nav>
            <NavDropdown
              title="계정"
              style={{ fontWeight: "bold" }}
              id="basic-nav-dropdown"
              className="me-2"
            >
              {loggedIn ? (
                <>
                  <NavDropdown.Item to={"#"} as={Link} onClick={logoutNavBar}>
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
              ) : (
                <>
                  <NavDropdown.Item to={"/login"} as={Link}>
                    로그인
                  </NavDropdown.Item>
                </>
              )}
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleRegisterClick} as="button">
                등록
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          {!meInfo?.admin && (
            <Nav.Link to={"/question"} as={Link}>
              <span style={{ fontWeight: "bold" }}>질문 등록</span>
            </Nav.Link>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
