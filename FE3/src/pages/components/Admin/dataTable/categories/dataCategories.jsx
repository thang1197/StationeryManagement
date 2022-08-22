import "./datacategories.scss"
import { DataGrid } from '@mui/x-data-grid';

import { useNavigate } from 'react-router-dom';
import http from "../../../../../api/client";
import api from "../../../../../api/api";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CategoriesGetAll } from "../../../../../redux/category/category.action";
import { ProductGetAll } from "../../../../../redux/product/product.action";
import EditCategory from "../../../../Admin/edit/categories/editCategory";
import { Button, Container } from "react-bootstrap";
import { Alert, AlertTitle, CircularProgress, Dialog, DialogTitle, Grid } from "@mui/material";
import DeleteSuccesDialog from "../../dialog/deleteSuccess";


const Datacategories = () => {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const [id, setId] = useState("");
  const [isDelete, setIsDelete] = useState(false);
  const [success, setSuccess] = useState(false);

  //#region Loading compomnent
  const sta = useSelector((state) => state.categories.status)
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
          columns={categoryColumns.concat(actionColumn)}
          pageSize={5}
          rowsPerPageOptions={[9]}
        />
      )
    }
  }
  //#endregion

  //#region  Delete Dialog Component
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

  //#region call api category
  const GetAllCategory = async () => {
    try {
      const response = await http.get(api.GetAllCategory);
      dispatch(CategoriesGetAll(response.data));
    } catch (err) {
      navigate("/")
    }
  }
  const getAllProduct = async () => {
    const res = await http.get(api.GetAllProduct);
    dispatch(ProductGetAll(res.data))
  }
  useEffect(() => {
    getAllProduct();
    GetAllCategory();
  }, [])
  const products = useSelector((state) => state.products.products);
  const categories = useSelector((state) => state.categories.categories);
  //#endregion

  //#region check use role
  const chekUseRole = (id) => {
    let cate = categories.find(e => e.idParent === id);
    let pro = products.find(e => e.categoryId === id);
    if (cate !== undefined) {
      return true;
    } else if (pro !== undefined) {
      return true;
    }
    return false;
  }
  //#endregion

  //Ham Handle
  const handleDelete = async (id) => {
    await http.delete(api.DeleteCategory + id);
    GetAllCategory();
    setSuccess(true);
  }


  const categoryColumns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "categoryName", headerName: "Category Name", width: 600, },
    { field: "IdParent", headerName: "IdParent", width: 400 },
  ]

  const categoryRows =
    categories.map(categories => (
      {
        id: categories.categotyId,
        categoryName: categories.categotyName,
        IdParent: categories.idParent,
      }
    ))
  const actionColumn = [
    {
      field: "action", headerName: "Action", width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <EditCategory className="editButton" category={params.row} />
            {chekUseRole(params.row.id) ?
              null
              :<Button className="deleteButton" variant="outlined" onClick={() => {
                setId(params.row.id)
                setIsDelete(true)
              }}>Delete</Button>
            }
          </div>
        )
      }
    }
  ]

  return (
    <div className="datatablecategory">
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

export default Datacategories