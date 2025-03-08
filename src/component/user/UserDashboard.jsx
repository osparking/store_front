import React, { useState } from "react";
import { Container, Tab, Tabs } from "react-bootstrap";
import UserProfile from "./UserProfile";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const { userId } = useParams();

  useEffect(() => {
    const getUser = async () => {
      try {
        const result = await getUserById(userId);
        setUser(result.data);
      } catch (error) {
        setErrorMsg(error.response.data.message);
        setShowErrorAlert(true);
      }
    };
    getUser();
  }, []);
  
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
