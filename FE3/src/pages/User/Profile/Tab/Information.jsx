import { GetProfile } from "../../../../redux/profile/profile.action";
import { useEffect, useState } from "react";
import http from "../../../../api/client";
import api from "../../../../api/api";
import { useDispatch, useSelector } from "react-redux";
import "./Information.scss";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/esm/Row";
import EditProfile from "../../../components/User/Edit/editProfile";
const Information = ()=> {

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
    <div>
      <Col md={12 }>
        <Card md={4}>
          <Card.Body>
            <Row>
              <Col md={3}>
                <div md={0}>ID</div>
              </Col>
              <Col md={9}>
                <div md={0}>{profiles.employeeId}</div>
              </Col>
            </Row>
            <hr />
            <Row>
              <Col md={3}>
                <div md={0}>Name</div>
              </Col>
              <Col md={9}>
                <div md={0}>{profiles.employeeName}</div>
              </Col>
            </Row>
            <hr />
            <Row>
              <Col md={3}>
                <div md={0}>Email</div>
              </Col>
              <Col md={9}>
                <div md={0}>{profiles.email}</div>
              </Col>
            </Row>
            <hr />
            <Row>
              <Col md={3}>
                <div md={0}>Address</div>
              </Col>
              <Col md={9}>
                <div md={0}>{profiles.address}</div>
              </Col>
            </Row>
            <hr />
            <Row>
              <Col md={3}>
                <div md={0}>Gender</div>
              </Col>
              <Col md={9}>
                <div md={0}>{profiles.gender}</div>
              </Col>
            </Row>
            <hr />
            <Row>
              <Col md={3}>
                <div md={0}>Phone</div>
              </Col>
              <Col md={9}>
                <div md={0}>{profiles.phone}</div>
              </Col>
            </Row>
            <hr />
            <Row>
              <Col md={3}>
                <div md={0}>Department</div>
              </Col>
              <Col md={9}>
                <div md={0}>{profiles.department}</div>
              </Col>
            </Row>
            <hr />
            <Row>
              <Col md={3}>
                <div md={0}>Budget</div>
              </Col>
              <Col md={9}>
                <div md={0}>{profiles.budget}</div>
              </Col>
            </Row>
            <hr />
          </Card.Body>
        </Card>
      </Col>
      <Col md={12} className="btn-edit-profile">
        <Col md={11}></Col>
        <Col md={1}> <EditProfile employee={profiles}/></Col>
      </Col>
    </div >
  )
}

export default Information;