import { useState } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../auth/AuthService";

const NavBar = () => {
  const beforeLogin = localStorage.getItem("TOKEN") === null;
  
const [isAdmin, setIsAdmin] = useState(false);
const checkIfAdmin = () => {
  const isAdminJson = localStorage.getItem("IS_ADMIN");
  setIsAdmin(isAdminJson ? JSON.parse(isAdminJson) : false);
}
  const navigate = useNavigate();
  const navigateHome = () => {
    setIsAdmin(false);
    navigate("/");
  };
  const loginId = localStorage.getItem("LOGIN_ID");

  window.addEventListener("loginEvt", checkIfAdmin);
  window.addEventListener("logoutEvt", navigateHome);

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
            <Nav.Link to={"/doctors"} as={Link}>
              비누 종류
            </Nav.Link>
            {isAdmin && (
              <Nav.Link to={`/dashboard/admin`} as={Link}>
                관리자
              </Nav.Link>
            )}
          </Nav>
          <Nav>
            <NavDropdown title="계정" id="basic-nav-dropdown">
              {beforeLogin ? (
                <>
                  <NavDropdown.Item to={"/login"} as={Link}>
                    로그인
                  </NavDropdown.Item>
                </>) : (
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
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
