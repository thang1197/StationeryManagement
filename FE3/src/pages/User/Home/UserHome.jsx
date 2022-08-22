import React, { useEffect, useState } from 'react'
import UserNavbars from '../../components/User/Navbar/Navbar';
import Products from '../../components/User/Product/Products';
import { Col, Row } from "react-bootstrap";
import "./userhome.scss";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import http from "../../../api/client";
import api from "../../../api/api";
import { ProductGetAll } from "../../../redux/product/product.action";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { CategoriesGetAll } from '../../../redux/category/category.action';

const UserHome = () => {
  let navigate = useNavigate();
  const [cateId,setCateId] = useState(0);

  const dispatch = useDispatch();
  //#region call api

  // API product
  const getAllProduct = async () => {
    try {
      const res = await http.get(api.GetAllProduct);
      dispatch(ProductGetAll(res.data))
    } catch (err) {
      window.location.reload();
    }
  }
  const getAllCategory = async () => {
    try {
      const response = await http.get(api.GetAllCategory);
      dispatch(CategoriesGetAll(response.data));
    } catch (err) {
      navigate("/")
    }
  }
  const user = useSelector((state) => state.user.currentUser);
  // API employees
  useEffect(() => {
    getAllProduct();
    getAllCategory();
  }, [])
  const categories = useSelector((state) => state.categories.categories);
  //#endregion
  return (
    <div className="userhome">
      <UserNavbars />
      <div className="userhome-bottom">
        <Col md={2} sm={2}>
          <div className="categories">
            <div className="sidebar">
              <div className="top">
                <span className="logo">Categories</span>
              </div>
              <div className="center">
                <ul>
                  <li onClick={()=>setCateId(0)}><ArrowRightIcon className="icon" /><span>All</span></li>
                  {categories.map(cate=>
                    <li key={cate.categotyId} onClick={()=>setCateId(cate.categotyId)}><ArrowRightIcon className="icon" /><span>{cate.categotyName}</span></li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </Col>
        <div className="products">
          <Products cate={cateId}/>
        </div>
      </div>
    </div>
  )
}
export default UserHome;