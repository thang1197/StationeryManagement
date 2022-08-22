import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
//user
import UserHome from "./pages/User/Home/UserHome";
import Cart from "./pages/User/Cart/Cart";
//import { useGridSelector } from "@mui/x-data-grid";
import React, { useEffect } from "react";
// Admin
import AdminHome from "./pages/Admin/home/AdminHome";
import ListProduct from "./pages/Admin/list/product/ListProduct";
import ListCategories from "./pages/Admin/list/categories/ListCategories";
import ListOrders from "./pages/Admin/list/order/ListOrders";
import ListEmployees from "./pages/Admin/list/employees/ListEmployees";
import CreateCategory from "./pages/Admin/create/categories/CreateCategories";
import CreateProduct from "./pages/Admin/create/products/CreateProducts";
import CreateEmployee from "./pages/Admin/create/employees/CreateEmployee";
import api from "./api/api";
import http from "./api/client";
import Login from "./pages/User/Login/Login";
import { selectCurrentUser } from "./redux/user/user.selector";
import { connect, useDispatch, useSelector } from "react-redux";
import { createStructuredSelector } from "reselect";
import ListRoles from "./pages/Admin/list/role/ListRoles";
import CreateRole from "./pages/Admin/create/role/CreateRoles";
import Profile from "./pages/User/Profile/profile";
import { RoleGetAll } from "./redux/role/role.action";
const App = ({ user }) => {
  const dispatch = useDispatch();
  const getAllRoles = async () => {
    const res = await http.get(api.GetAllRoles);
    dispatch(RoleGetAll(res.data));
  };
  useEffect(() => {
    getAllRoles();
  }, []);
  const roles = useSelector((state) => state.roles.roles);
  return (
    <BrowserRouter>
      <Routes>
        {localStorage.getItem("name") ? (
          <Route
            path="/"
            element={
              user.employeeName === localStorage.getItem("name") ? (
                <UserHome />
              ) : (
                <Login />
              )
            }
          />
        ) : (
          <Route path="/" element={<Login />} />
        )}
        {/* admin */}
        {user.employeeName === localStorage.getItem("name") ? (
          <Route path="/">
            {user.isAdmin ? (
              <Route path="admin/">
                <Route index element={<AdminHome />} />
                {user.userRoles === 1 || user.userRoles === 5 ? (
                  <Route path="products/">
                    <Route index element={<ListProduct />} />
                    <Route path="create" element={<CreateProduct />} />
                  </Route>
                ) : null}
                {user.userRoles === 1 || user.userRoles === 5 ? (
                <Route path="categories/">
                  <Route index element={<ListCategories />} />
                  <Route path="create" element={<CreateCategory />} />
                </Route>) : null}
                {user.userRoles === 1 || user.userRoles === 5   || user.userRoles === 2 ? 
                (
                  <>
                    <Route path="orders/">
                      <Route index element={<ListOrders />} />
                    </Route>
                    <Route path="employees/">
                      <Route index element={<ListEmployees />} />
                      <Route path="create" element={<CreateEmployee />} />
                    </Route>
                  </>
                ):null}
                 {user.userRoles === 1 ? (
                  <Route path="roles/">
                    <Route index element={<ListRoles />} />
                    <Route path="create" element={<CreateRole />} />
                  </Route>):null}
              </Route>
            ) : (
              <Route path="*" element={<Navigate to="/" />} />
            )}
            {/* home */}
            <Route path="home/">
              <Route index element={<UserHome />} />
            </Route>
            <Route path="/cart" element={<Cart />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </BrowserRouter>
  );
};

const mapStateToProp = createStructuredSelector({
  user: selectCurrentUser,
});
export default connect(mapStateToProp)(App);
