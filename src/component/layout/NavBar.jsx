import React, { useState } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../auth/AuthService";

const NavBar = () => {
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const beforeLogin = localStorage.getItem("token") === null;
  const userRoles = localStorage.getItem("userRoles") || [];

  const handleLogin = () => {
    setUserId(localStorage.getItem("userId"));
  };

  const navigate = useNavigate();
  const handleLogout = () => {
    setUserId(null);
    navigate("/");
  };

  window.addEventListener("logoutEvt", handleLogout);
  window.addEventListener("loginEvt", handleLogin);

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
            <Nav.Link to={"/admin-dashboard"} as={Link}>
              관리자
            </Nav.Link>
          </Nav>
          <Nav>
            <NavDropdown title="계정" id="basic-nav-dropdown">
              {beforeLogin ? (
                <>
                  <NavDropdown.Item to={"/register_user"} as={Link}>
                    등록
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item to={"/login"} as={Link}>
                    로그인
                  </NavDropdown.Item>
                </>) : (
                <>
                  <NavDropdown.Item to={`/dashboard/user`} as={Link}>
                    나의 대시보드
                  </NavDropdown.Item>
                  {userRoles.includes("ROLE_ADMIN") && (
                    <>
                      <NavDropdown.Divider />
                      <NavDropdown.Item to={"/admin-dashboard"} as={Link}>
                        관리자 대시보드
                      </NavDropdown.Item>
                    </>
                  )}
                  <NavDropdown.Divider />
                  <NavDropdown.Item to={"#"} as={Link} onClick={logoutUser}>
                    로그아웃
                  </NavDropdown.Item>
                </>
              )}
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
