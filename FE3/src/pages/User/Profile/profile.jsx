import React, { useEffect } from "react";
import UserNavbars from "../../components/User/Navbar/Navbar";
import "./profile.scss"
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Container from 'react-bootstrap/Container';
import Information from "./Tab/Information";
import { GetProfile } from "../../../redux/profile/profile.action";
import http from "../../../api/client";
import api from "../../../api/api";
import { useDispatch, useSelector } from "react-redux";
import DetailsEmployee from "../../Admin/details/employees/DeatailEmployee";
import ChangePassword from "./Tab/changePassword";
import InformationOrders from "./Tab/InformationOrders";


const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);
// API employees
const getProfile = async () => {
  const resEmp = await http.get(api.GetProfileByIdEmp + user.employeeID);
  dispatch(GetProfile(resEmp.data));
}
useEffect(() => {
  getProfile();
}, [])
const profiles = useSelector((state) => state.profile.profile);

  return (
    <div className="profile">
      <UserNavbars />
      <div className="profile-bottom">
        <Container className="profile-a">
          <div className="tabs">
            <Tab.Container id="left-tabs-example" defaultActiveKey="Profile">
              <Row>
                <Col sm={3}>
                  <Nav variant="pills" className="flex-column">
                    <Nav.Item>
                      <Nav.Link eventKey="Profile">Profile</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="ChangePassword">Change Password</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="Orders">Orders</Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Col>
                <Col sm={9}>
                  <Tab.Content>
                    <Tab.Pane eventKey="Profile">
                      <Information/>
                    </Tab.Pane>
                    <Tab.Pane eventKey="ChangePassword">
                        <ChangePassword  pro={profiles}/>
                    </Tab.Pane>
                    <Tab.Pane eventKey="Orders">
                      <InformationOrders />
                    </Tab.Pane>
                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Profile;