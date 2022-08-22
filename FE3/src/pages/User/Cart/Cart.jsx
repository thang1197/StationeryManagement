import React, { useEffect, useState } from "react";
import "./cart.scss";
import { useSelector, useDispatch } from "react-redux";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from "react-router-dom";
import { addCart, delCart, delAllCart, Clear } from "../../../redux/cart/cart.action";
import http from "../../../api/client";
import api from "../../../api/api";
import { GetProfile } from "../../../redux/profile/profile.action";

import baseURL from "../../../baseurl";
import { useSelect } from "@mui/base";

const Cart = () => {
  
  const state = useSelector((state) => state.cart);
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);
  console.log(user)
  let status = "Waiting for approval";

  if(user.userRoles === 2){
    status = "Acceptance"
  }

  const date = new Date()
  const cart = {
      EmployeeId: user.employeeID,
      Status: status,
      CreatedAt: date.toISOString(),
      Products: state.map(item => ({
        ProductId: item.productId,
        Quantity: item.qty
      })
      )
  }


  //#region Call API Role
  const roles = useSelector((state) => state.roles.roles);
  //#endregion
  let sum = 0;
  state.map((product) => {
    sum = sum + product.qty * product.price
  })

  const [total, setTotal] = useState(sum);
  const categories = useSelector(state => state.categories.categories);

  const getProfile = async () => {
    const resEmp = await http.get(api.GetProfileByIdEmp + user.employeeID);
    dispatch(GetProfile(resEmp.data));
  }
  

  const handleAdd = (item) => {
    dispatch(addCart(item));
    const product = state.find(e => e.productId === item.productId)
    sum = sum + product.price
    setTotal(sum);
  };


  const handleDel = (item) => {
    dispatch(delCart(item));
    const product = state.find(e => e.productId === item.productId)
    sum = sum - product.price
    setTotal(sum);
  };

  const handleDelAll = (item) => {
    dispatch(delAllCart(item));
    sum = sum - (item.qty * item.price)
    setTotal(sum);
  };

  useEffect(() => {
    
    getProfile();
    
  }, []);

  const profiles = useSelector((state) => state.profile.profile);

  const handleOrder = async () => {
    await http.post(api.CreateOrderDetails,cart);
    dispatch(Clear());
  }

  const handleBack = () =>{
    navigate("/");
  }


  return (
    <section className="h-100 h-custom" style={{ backgroundColor: '#d2c9ff' }}>
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12">
            <div className="card card-registration card-registration-2" style={{ borderRadius: '15px' }}>
              <div className="card-body p-0">
                <div className="row g-0">
                  <div className="col-lg-8">
                    <div className="p-5">
                      <div className="d-flex justify-content-between align-items-center mb-5">
                        <h1 className="fw-bold mb-0 text-black">Shopping Cart</h1>
                        <h6 className="mb-0 text-muted">{state.length} items</h6>
                      </div>
                      {state.length === 0 ?
                        (
                          <div className="px-4 my-5 bg-light rounded-3 py-5">
                            <div className="container py-4">
                              <div className="row">
                                <h3>Your Cart is Empty</h3>
                              </div>
                            </div>
                          </div>
                        )
                        :
                        (state.map(product => (
                          <div key={product.productId}>
                            <div className="row mb-4 d-flex justify-content-between align-items-center">
                              <div className="col-md-2 col-lg-2 col-xl-2">
                                <img src={baseURL + product.featureImgPath} className="img-fluid rounded-3" alt="Cotton T-shirt" />
                              </div>
                              <div className="col-md-3 col-lg-3 col-xl-3">
                                <h6 className="text-black mb-0">{product.productName}</h6>
                              </div>
                              <div className="col-md-3 col-lg-3 col-xl-2 d-flex">
                                <button className="btn btn-link px-2" onClick={() => handleDel(product)}>
                                  <RemoveIcon />
                                </button>
                                <div className="qty">
                                  <div>
                                    {product.qty}
                                  </div>
                                </div>
                                <button className="btn btn-link px-2" onClick={() => handleAdd(product)}>
                                  <AddIcon />
                                </button>
                              </div>
                              <div className="col-md-3 col-lg-2 col-xl-2 offset-lg-1 close">
                                <div>
                                  <h6 className="mb-0">${product.qty * product.price}</h6>
                                </div>
                                <div>
                                  <button className="btn btn-link px-2" onClick={() => handleDelAll(product)}>
                                    <CloseIcon color="error" />
                                  </button>
                                </div>
                              </div>

                              <div className="col-md-1 col-lg-1 col-xl-1 text-end">
                                <a href="#!" className="text-muted"><i className="fas fa-times" /></a>
                              </div>
                            </div>
                            <hr className="my-4" />
                          </div>
                        ))
                        )
                      }
                      <div className="pt-5">
                        <h6 className="mb-0 back"><a onClick={handleBack} className="text-body"><i className="fas fa-long-arrow-alt-left me-2" />Back to shop</a></h6>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 bg-grey">
                    <div className="p-5">
                      <h3 className="fw-bold mb-5 mt-2 pt-1">Summary</h3>
                      <hr className="my-4" />
                      <div className="d-flex justify-content-between mb-4">
                        <h5 className="text-uppercase">Max Budget</h5>
                        <h5>{profiles.budget} $</h5>
                      </div>
                      <div className="d-flex justify-content-between mb-4">
                        <h5 className="text-uppercase">Items {state.length}</h5>
                        <h5>{total} $</h5>
                      </div>
                      <hr className="my-4" />
                      <div className="d-flex justify-content-between mb-5">
                        <h5 className="text-uppercase">Total price</h5>
                        <h5>{total} $</h5>
                      </div>
                      {profiles.budget > total ?
                        <button type="button" className="btn btn-dark btn-block btn-lg" data-mdb-ripple-color="dark" onClick={handleOrder}>Order</button>
                        :
                        <h3 className="fw-bold mb-5 mt-2 pt-1" style={{color: "orangered"}}>Balance is not enough</h3>
                      }
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Cart;
