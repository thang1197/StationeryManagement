import React, { useEffect, useState } from "react";
import {
  Dialog,
  Grid,
  Button,
} from "@mui/material";
import api from "../../../../api/api";
import http from "../../../../api/client";
import { GetAllOrderItem } from "../../../../redux/orderItem/orderItem.action";
import { useDispatch, useSelector } from "react-redux";
import { ProductGetAll } from "../../../../redux/product/product.action";
import baseURL from "../../../../baseurl";

function DetailsOrder(props) {
  const [isOpen, setOpenDialog] = useState(false);
  const dispatch = useDispatch();
  const getOrderItem = async () => {
    const resEmp = await http.get(api.GetAllOrderItem);
    dispatch(GetAllOrderItem(resEmp.data));
  }
  const getAllProduct = async () => {
    const res = await http.get(api.GetAllProduct);
    dispatch(ProductGetAll(res.data))
  }
  useEffect(() => {
    getOrderItem();
    getAllProduct();
  }, [])
  const user = useSelector((state) => state.user.currentUser);
  const products = useSelector((state) => state.products.products);
  const orderItem = useSelector((state) => state.orderItem.orderItem);
  const itemList = orderItem.filter(item => item.orderId === props.orders.orderId)
  const [total, setTotal] = useState(0);
  const orderItems = itemList.map(item => {
        const product = products.find(e => e.productId === item.productId)
        return {
            id: item.productId,
            name: product.productName,
            quantity: item.quantity,
            price: product.price,
            featureImgPath: product.featureImgPath,
        }
    })
    useEffect(() => {
        let sum = 0;
        orderItems.map((product) => {
          sum = sum + product.quantity * product.price
        })
        setTotal(sum);
      });
  const handleOpen = () => {
    setOpenDialog(true)
  }

  const handleClose = () => {
    setOpenDialog(false)
  }

  return (
    <div>
      <Button className="editButton" variant="outlined" onClick={handleOpen}>View</Button>
      <Dialog open={isOpen} maxWidth="md" fullWidth>
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-lg-10 col-xl-8">
              <div className="card" style={{ borderRadius: '10px' }}>
                <div className="card-header px-4 py-5">
                  <h5 className="text-muted mb-0">Employee: {user.employeeName}</h5>
                </div>
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <p className="lead fw-normal mb-0" style={{ color: '#a8729a' }}>Order Id</p>
                    <p className="small text-muted mb-0">{}</p>
                  </div>
                  {orderItems.map(produc=>
                  <div className="card shadow-0 border mb-4" key={produc.id}>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-2">
                          <img src={baseURL+produc.featureImgPath} className="img-fluid" alt="Phone" />
                        </div>
                        <div className="col-md-2 text-center d-flex justify-content-center align-items-center">
                          <p className="text-muted mb-0">{produc.name}</p>
                        </div>
                        <div className="col-md-2 text-center d-flex justify-content-center align-items-center">
                          <p className="text-muted mb-0 small">Qty:{produc.quantity}</p>
                        </div>
                        <div className="col-md-2 text-center d-flex justify-content-center align-items-center">
                          <p className="text-muted mb-0 small">${produc.price}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  )}
                  <div className="d-flex justify-content-between pt-2">
                    <p className="fw-bold mb-0">Order Details</p>
                    <p className="text-muted mb-0"><span className="fw-bold me-4">Total</span> ${total}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Grid container item md={12} direction="row" justifyContent="center" alignItems="center">
          <Button variant="outlined" sx={{ width: "250px" , margin: "5px"}} onClick={handleClose}>Close</Button>
        </Grid>
      </Dialog>
    </div>
  )
}

export default DetailsOrder;