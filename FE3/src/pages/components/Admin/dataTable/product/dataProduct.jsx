import "./dataproduct.scss";
import { DataGrid } from "@mui/x-data-grid";
import http from "../../../../../api/client";
import api from "../../../../../api/api";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ProductGetAll } from "../../../../../redux/product/product.action";
import { CategoriesGetAll } from "../../../../../redux/category/category.action";
import { GetAllOrder } from "../../../../../redux/order/order.action";
import { GetAllOrderItem} from "../../../../../redux/orderItem/orderItem.action";
import { Button, Container } from "react-bootstrap";
import EditProduct from "../../../../Admin/edit/products/editProduct";
import { RoleGetAll } from "../../../../../redux/role/role.action";
import { Alert, AlertTitle, CircularProgress, Dialog, DialogTitle, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteSuccesDialog from "../../dialog/deleteSuccess";
import baseURL from "../../../../../baseurl";


const DataProduct = () => {
  const [success, setSuccess] = useState(false);
  const [id, setId] = useState("");
  const [isDelete, setIsDelete] = useState(false);

  const dispatch = useDispatch();
  let navigate = useNavigate();

  //#region Loading compomnent
  const sta = useSelector((state) => state.products.status)

  const Render = (props) => {
    if (props.status === "loading") {
      return (
        <Container className="loadingContainer">
          <div className="loading">
            <CircularProgress color="secondary" size={200} />
          </div>
        </Container>
      )
    } else if (props.status === "done") {
      return (
        <DataGrid
          rows={categoryRows}
          columns={categoryColumns}
          pageSize={10}
          rowsPerPageOptions={[10]}

        />
      )
    }
  }
  //#endregion

  //#region Delete Dialog Component 
  const DeleteDialog = (props) => {
    return (
      <div>
        <Dialog open={isDelete} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Alert severity="warning" variant="filled" >
              <AlertTitle>Delete!</AlertTitle>
              Are you sure <strong>to delete?</strong>
            </Alert>
          </DialogTitle>
          <Grid container item md={12} direction="row" justifyContent="center" alignItems="center" sx={{ margin: "10px 0px" }}>
            <Button variant="contained" sx={{ marginRight: "20px", width: "250px" }} color="error" onClick={() => {
              handleDelete(props.Id)
              setIsDelete(false)
            }}>Delete</Button>
            <Button variant="outlined" sx={{ width: "250px" }} onClick={() => { setIsDelete(false) }} color="error">Cancle</Button>
          </Grid>
        </Dialog>
      </div>
    )
  }
  //#endregion

  //#region Call API
  // Call API GetAllCategory
  const getAllCategory = async () => {
    try {
      const res = await http.get(api.GetAllCategory);
      dispatch(CategoriesGetAll(res.data))
    } catch (err) {
      navigate("/")
    }
  }
  //Call API GetAllProduct
  const getAllProduct = async () => {
    const res = await http.get(api.GetAllProduct);
    dispatch(ProductGetAll(res.data))
  }
  // api Roles
  const getAllRole = async () => {
    const resRoles = await http.get(api.GetAllRoles);
    dispatch(RoleGetAll(resRoles.data));
  }
  // api Order
  const getAllOrder = async () => {
    const resOrders = await http.get(api.GetAllOrder);
    dispatch(GetAllOrder(resOrders.data));
  }
  // api OrderItem
  const getAllOrderItem = async () => {
    const resOrders = await http.get(api.GetAllOrderItem);
    dispatch(GetAllOrderItem(resOrders.data));
  }

  useEffect(() => {
    getAllCategory();
    getAllProduct();
    getAllRole();
    getAllOrder();
    getAllOrderItem();
  }, [])

  //Selector product
  const items = useSelector((state) => state.products.products);
  //Selector category
  const cate = useSelector((state) => state.categories.categories);
  //Selector roles
  const roles = useSelector((state) => state.roles.roles);
   //Selector orders
   const orders = useSelector((state) => state.orders.orders);
   //Selector orders
   const orderItem = useSelector((state) => state.orderItem.orderItem);
  //#endregion
 
   //#region check use product
   const chekUseProduct = (id) => {
    let orItem = orderItem.find(e=>e.productId == id);
    if(orItem !== undefined){
      return true;
    }
    return false;
  }
  //#endregion

  const handleDelete = async (id) => {
    await http.delete(api.DeleteProduct + id);
    getAllProduct();
    setSuccess(true);
  }

  
  const categoryColumns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "name", headerName: "Product Name", width: 300, },
    { field: "quantity", headerName: "Quanity", width: 100 },
    { field: "price", headerName: "Price", width: 100 },
    {
      field: 'productImage', headerName: 'Images', width: 200,


      renderCell: (params) => {

        return (
          <div className="cellWithImg">
            {params.row.productImage != null ?
              (
                <img className="cellImg" src={params.row.productImage} alt="avatar" />
              )
              :
              null}
          </div>

        )
      }


    },
    { field: "category", headerName: "Category", width: 100 },
    { field: "role", headerName: "Role", width: 100 },
    { field: "status", headerName: "Status", width: 100 },
    {
      field: "action", headerName: "Action", width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <EditProduct className="editButton" item={params.row} />
            {chekUseProduct(params.row.id) ?
              null
              :<Button className="deleteButton" variant="outlined" onClick={() => {
                {
                  setId(params.row.id)
                  setIsDelete(true)
                }
              }}>Delete</Button>
            }
            
          </div>
        )
      }
    }
  ]


  const dataRow = items.map((item) => {
    let rol = roles.find(e => e.roleId === item.roleId);
    if (rol === undefined) {
      rol = {
        roleName: ""
      }
    }
    let cateName = cate.find(e => e.categotyId === item.categoryId);
    if (cateName === undefined) {
      cateName = {
        categotyName: ""
      }
    }
    let image = null;
    if (item.featureImgPath !== null) {
      image = baseURL + item.featureImgPath;
    }
    return {
      id: item.productId,
      name: item.productName,
      quantity: item.quantity,
      price: item.price,
      productImage: image,
      category: cateName.categotyName,
      role: rol.roleName,
      status: item.productEnable,
      cateId: item.categoryId,
      roleId: item.roleId,
      featureImgPath: item.featureImgPath,
    }
  })

  const categoryRows = [...dataRow]
  return (
    <div className="datatableproduct">
      {success === true ?
          <DeleteSuccesDialog success={true}/>
          :
          <>
          <DeleteDialog Id={id} />
          <Render status={sta} />
          </>
      }
    </div>
  )
}

export default DataProduct