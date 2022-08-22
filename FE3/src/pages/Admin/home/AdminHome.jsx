import "./adminhome.scss";
import Sidebar from "../../components/Admin/sidebar/AdminSidebar";
import Navbars from "../../components/Admin/navbar/AdminNavbar";
import Widget from "../../components/Admin/widget/Widget";
import Featured from "../../components/Admin/featured/Featured";
import Chart from "../../components/Admin/chart/Chart";
import http from "../../../api/client";
import api from "../../../api/api";
import { useDispatch, useSelector } from "react-redux";
import { GetAllEmployee } from "../../../redux/epmloyee/employee.action";
import { GetAllOrder } from "../../../redux/order/order.action";
import { GetAllOrderItem } from "../../../redux/orderItem/orderItem.action";
import { ProductGetAll } from "../../../redux/product/product.action";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Grid } from "@mui/material";

const AdminHome = () => {

    //Call API
    let navigate = useNavigate();
    const dispatch = useDispatch();

    const getAllEmployee = async () => {
        try {
            const resEmp = await http.get(api.GetAllEmployee);
            dispatch(GetAllEmployee(resEmp.data));
        } catch (err) {
            navigate("/")
        }
    }

    const getAllProduct = async () => {
        const res = await http.get(api.GetAllProduct);
        dispatch(ProductGetAll(res.data))
    }


    const getAllOrderDetail = async () => {
        const res = await http.get(api.GetAllOrderItem);
        dispatch(GetAllOrderItem(res.data))
    }

    const getAllOrder = async () => {
        const resOrders = await http.get(api.GetAllOrder);
        dispatch(GetAllOrder(resOrders.data));
    }
    useEffect(() => {
        getAllEmployee()
        getAllOrder()
        getAllProduct()
        getAllOrderDetail()
    }, [])

    const orderDetails = useSelector(state => state.orderItem.orderItem)
    const orders = useSelector(state => state.orders.orders)
    const employees = useSelector(state => state.employees.employees)
    const products = useSelector(state => state.products.products)

    let cost = 0;

    //loc order
    const orderList = orders.filter(item => item.status === "Acceptance")

    orderList.forEach(order => {
        orderDetails.forEach(orderItem => {
            if(order.orderId === orderItem.orderId){
                products.forEach(product => {
                    if (orderItem.productId === product.productId) {
                        cost = cost + (orderItem.quantity * product.price)
                    }
                })
            }
        })
    })

    const orderItems = [];
    orderList.forEach(order => {
        orderDetails.forEach(item => {
            if(order.orderId === item.orderId){
                if (orderItems.length === 0) {
                    orderItems.push(item)
                } else {
                    let check = orderItems.find(e => e.productId === item.productId)
                    if (check === undefined) {
                        orderItems.push(item)
                    } else {
                        check = { ...check, quantity: check.quantity + item.quantity }
                        const index = orderItems.findIndex(o => o.productId === check.productId)
                        orderItems[index] = { ...check }
                    }
                }
            }
        })
    })
    
    return (
        <div className="homeAdmin">
            <Sidebar id={0} />
            <div className="homeAdminContainer">
                <Navbars title="Home" />
                <div className="widgets">
                    <Widget type="user" amount={employees.length} link="/admin/employees"/>
                    <Widget type="order" amount={orders.length} link="/admin/orders"/>
                    <Widget type="orderRate" amount={orderList.length+"/"+orders.length} link="/admin/orders"/>
                    <Widget type="cost" amount={cost} />
                </div>
                <div className="charts">
                    <Grid container spacing={2}>
                        {orderItems.map(orderItem => {
                            if(orderItem.productId != 0)
                            {
                                const productName = products.find(e => e.productId === orderItem.productId)
                                let rate = (productName.price * orderItem.quantity) / cost * 100
                                const x = parseInt(rate)
                                const y = rate - x
                                if (y >= 0.5) {
                                    rate = Math.ceil(rate)
                                } else {
                                    rate = Math.floor(rate)
                                }
                                const costs = productName.price * orderItem.quantity
                                return (
                                    <Grid item md={3} xs={4} key={orderItem.id}>
                                        <Featured key={orderItem.id} title={productName.productName} rate={rate} cost={costs} />
                                    </Grid>
                                )
                            }                         
                        })
                        }
                    </Grid>
                </div>
            </div>
        </div>
    )
}

export default AdminHome