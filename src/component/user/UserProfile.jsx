import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import ImageUp from "../modal/ImageUp";

const UserProfile = ({ user }) => {
  const [showImageUp, setShowImageUp] = useState(false);

  const handleShowImageUp = () => setShowImageUp(true);
  const handleCloseImageUp = () => setShowImageUp(false);

  return (
    <Container>
      <React.Fragment>
        <Row>
          <Col>
            <Card>
              <div>
                <ImageUp user={user} />
              </div>
            </Card>
          </Col>
        </Row>
      </React.Fragment>
    </Container>
  );
};

export default UserProfile;
