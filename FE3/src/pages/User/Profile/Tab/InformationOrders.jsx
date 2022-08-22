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
import { GetAllOrderItem } from "../../../../redux/orderItem/orderItem.action";
import { Table } from "react-bootstrap";
import Moment from 'moment';
import DetailsOrder from "./DetailsOrder";
import { GetAllOrder } from "../../../../redux/order/order.action";
const InformationOrders = () => {

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);
  // API Order
  const getAllOrder = async () => {
    const resOrders = await http.get(api.GetAllOrder);
    dispatch(GetAllOrder(resOrders.data));
  }
  // API employees
  useEffect(() => {
    getAllOrder();
  }, []);

  //select orders
  const orders = useSelector((state) => state.orders.orders);
  const orList = orders.filter(emp => emp.employeeId === user.employeeID)
  return (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Status</th>
            <th>Date Order</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {orList.map(or =>
            <tr>
              <td>{or.orderId}</td>
              <td>{or.status}</td>
              <td>{Moment(or.createdAt).format("L")}</td>
              <td><DetailsOrder orders={or} /></td>
            </tr>
          )}
        </tbody>
      </Table>
    </div >
  )
}

export default InformationOrders;