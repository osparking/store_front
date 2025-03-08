import React, { useState } from "react";
import { Container, Tab, Tabs } from "react-bootstrap";
import UserProfile from "./UserProfile";

const UserDashboard = () => {
  const [user, setUser] = useState(null);

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
