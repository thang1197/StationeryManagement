import "./dataroles.scss"
import { DataGrid } from '@mui/x-data-grid';
import api from "../../../../../api/api";
import http from "../../../../../api/client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RoleGetAll } from "../../../../../redux/role/role.action";
import { Button } from "react-bootstrap";
import { Alert, AlertTitle, CircularProgress, Container, Dialog, DialogTitle, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import EditRole from "../../../../Admin/edit/role/editRole";
import { GetAllEmployee } from "../../../../../redux/epmloyee/employee.action";
import { ProductGetAll } from "../../../../../redux/product/product.action";
import DeleteSuccesDialog from "../../dialog/deleteSuccess";

const DataRoles = () => {

  const dispatch = useDispatch();
  let navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  //#region  Loading compomnent
  const sta = useSelector((state) => state.roles.status)

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

  const [id, setId] = useState("")

  const [isDelete, setIsDelete] = useState(false)

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

  //#region call api roles
  const getAllRoles = async () => {
    try {
      const res = await http.get(api.GetAllRoles);
      dispatch(RoleGetAll(res.data));
    } catch (err) {
      navigate("/")
    }
  }
  const getAllEmployee = async () => {
    const resEmp = await http.get(api.GetAllEmployee);
    dispatch(GetAllEmployee(resEmp.data));
  }
  const getAllProduct = async () => {
    const res = await http.get(api.GetAllProduct);
    dispatch(ProductGetAll(res.data))
  }

  useEffect(() => {
    getAllRoles();
    getAllEmployee();
    getAllProduct();
  }, [])
  const roles = useSelector((state) => state.roles.roles);
  const employees = useSelector((state) => state.employees.employees);
  const products = useSelector((state) => state.products.products);
  //#endregion

  //#region check use role
  const chekUseRole = (id) => {
    let emp = employees.find(e => e.roleId === id);
    let pro = products.find(e => e.roleId === id);
    if (emp !== undefined) {
      return true;
    } else if (pro !== undefined) {
      return true;
    }
    return false;
  }
  //#endregion
  const handleDelete = async (id) => {
    await http.delete(api.DeleteRole + id);
    getAllRoles();
    setSuccess(true);
  }



  const categoryColumns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "name", headerName: "Role", width: 400, },
    {
      field: "action", headerName: "Action", width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <EditRole role={params.row} />
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


  const dataRow = roles.map((item) => {
    return {
      id: item.roleId,
      name: item.roleName,

    }
  })
  const categoryRows = [...dataRow]
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

export default DataRoles