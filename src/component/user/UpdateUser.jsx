import React, { useEffect, useId, useState } from 'react'
import BsAlertHook from '../hook/BsAlertHook';
import { useParams } from 'react-router-dom';
import { Card, Col, Container, Form, Row } from 'react-bootstrap';
import WorkerDeptSelector from '../worker/WorkerDeptSelector';
import { getUserById, getUserDtoById } from './UserService';

const UserUpdate = () => {
  const [user, setUser] = useState({
    fullName: "",
    mbPhone: "",
    email: "",
    password: "",
    userType: "",
    dept: "",
  });

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

  const { userId } = useParams();

  useEffect(() => {
    const getUser = async () => {
      try {
        const result = await getUserDtoById(userId);
        setUser(result.data);
      } catch (error) {
        setErrorMsg(error.response.data.message);
        setShowErrorAlert(true);
      }
    };
    getUser();
  }, [userId]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleCheckChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.checked });
  };

  return (
    <Container md={6} className="d-flex justify-content-center mt-5">
      <Col md={6}>
        <Form className="mb-5">
          <Card className="shadow">
            <Card.Header className="text-center mb-2 h3">
              유저 정보 갱신
            </Card.Header>
            <Card.Body className="mb-3">
              <Row>
                <Col>
                  <Form.Label className="legend">성명</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    placeholder="(성명)"
                    value={user.fullName}
                    onChange={handleInputChange}
                  />
                </Col>
                <Col>
                  <Form.Label className="legend">계정 상태</Form.Label>
                  <Form.Check
                    type="switch"
                    name="enabled"
                    checked={user.enabled}
                    onChange={handleCheckChange}
                    label="활성화"
                  />
                </Col>
              </Row>

              </fieldset>

              {/* 계정 유형 - 비활성 */}
              <Form.Group as={Col} controlId="user-type" className="mb-2">
                <Form.Label>계정 유형</Form.Label>
                <Form.Control
                  type="text"
                  name="userType"
                  value={user.userType}
                  disabled
                />
              </Form.Group>              
              
              {user.userType === "노동자" && (
                <fieldset className="field-set mb-2 mt-2">
                  <Form.Label className="legend">소속 부서</Form.Label>
                  <Form.Group
                    as={Col}
                    controlId="deptAndPhoto"
                    className="mb-2 d-flex"
                  >
                    <WorkerDeptSelector
                      workerDept={user.dept}
                      onChange={handleInputChange}
                    />
                    <Form.Group as={Row} className='ms-3'>
                      <Form.Label column style={{"textAlign": "right"}} >사진 유무: </Form.Label>
                      <Col >
                      <Form.Control
                        className='ms-0'
                        type="text"
                        name="photoYN"
                        value={`${user.photoId ? "유" : "무"}`}
                      /></Col>
                    </Form.Group>
                  </Form.Group>
                </fieldset>)}
              <Form.Group as={Col} controlId="user-type" className="mb-2">
                <Form.Label>계정 활성화 상태 </Form.Label>
                <Form.Check
                  type="switch"
                  name="enabled"
                  checked={user.enabled}
                  onChange={handleCheckChange}
                />
              </Form.Group> 
            </Card.Body>
          </Card>
        </Form>
      </Col>
    </Container>
  );
}

export default UserUpdate