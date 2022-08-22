import "./dataemployees.scss"
import { DataGrid } from '@mui/x-data-grid';
import http from "../../../../../api/client";
import api from "../../../../../api/api";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetAllEmployee } from "../../../../../redux/epmloyee/employee.action";
import { RoleGetAll } from "../../../../../redux/role/role.action";
import { Button, Container } from "react-bootstrap";
import EditEmployee from "../../../../Admin/edit/employees/editEmployee";
import DetailsEmployee from "../../../../Admin/details/employees/DeatailEmployee";
import { Alert, AlertTitle, CircularProgress, Dialog, DialogTitle, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteSuccesDialog from "../../dialog/deleteSuccess";


const DataEmployees = () => {
  const [id, setId] = useState("");
  const [isDelete, setIsDelete] = useState(false);
  const [success, setSuccess] = useState(false);
  const sta = useSelector((state) => state.roles.status);
  let navigate = useNavigate();
  const dispatch = useDispatch();
 //Selector user
 const user = useSelector((state) => state.user.currentUser);
  //#region loading...
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
          rows={user.userRoles === 1? categoryRowsAll: categoryRows }
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
  //Api Employee
  const getAllEmployee = async () => {
    try {
      const resEmp = await http.get(api.GetAllEmployee);
      dispatch(GetAllEmployee(resEmp.data));
    } catch (err) {
      navigate("/")
    }
  }
  //API Role
  const getAllRole = async () => {
    const resRoles = await http.get(api.GetAllRoles);
    dispatch(RoleGetAll(resRoles.data));
  }

  useEffect(() => {
    getAllRole();
    getAllEmployee();
  }, [])

  //Selector Employee
  const employee = useSelector((state) => state.employees.employees);
  //Selector Roles
  const roles = useSelector((state) => state.roles.roles);
  //#endregion

//#region check use Employee
const chekUseRole = (id) => {
  if (user.employeeID === id) {
    
    return true;
  }
  return false;
}
//#endregion

//Loc Employee

  const empList = employee.filter(emp => emp.superiors === user.employeeID)



  //Ham Handle
  const handleDelete = async (id) => {
    await http.delete(api.DeleteEmployee + id);
    getAllEmployee();
    setSuccess(true);
  }

  const categoryColumns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "name", headerName: "Name", width: 300, },
    { field: "email", headerName: "Email", width: 200, },
    { field: "phone", headerName: "Phone", width: 200, },
    { field: "department", headerName: "Department", width: 100, },
    { field: "role", headerName: "Role", width: 100, },
    {
      field: "action", headerName: "Action", width: 300,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <DetailsEmployee employee={params.row} />
            {chekUseRole(params.row.id) === false?
              <>
              <EditEmployee employee={params.row} />
              <Button className="deleteButton" variant="outlined" onClick={() => {
                setIsDelete(true)
                setId(params.row.id)
              }
              }>Delete</Button>
              </>
              :
              null
            }
            
          </div>
        )
      }
    }
  ]


  const dataRow = empList.map((item) => {
    let rol = roles.find(e => e.roleId === item.roleId);
    if (rol === undefined) {
      rol = {
        roleName: ""
      }
    }
    return {
      id: item.employeeId,
      name: item.employeeName,
      email: item.email,
      phone: item.phone,
      department: item.department,
      gender: item.gender,
      address: item.address,
      superiors: item.superiors,
      birthday: item.birthday,
      role: rol.roleName,
      idRole: item.roleId,
      isAdmin: item.isAdmin,
      pass: item.password,
      budget: item.budget,
      createAt: item.createdAt,
    }
  })

  const dataRowAll = employee.map((item) => {
    let rol = roles.find(e => e.roleId === item.roleId);
    if (rol === undefined) {
      rol = {
        roleName: ""
      }
    }
    return {
      id: item.employeeId,
      name: item.employeeName,
      email: item.email,
      phone: item.phone,
      department: item.department,
      gender: item.gender,
      address: item.address,
      superiors: item.superiors,
      birthday: item.birthday,
      role: rol.roleName,
      idRole: item.roleId,
      isAdmin: item.isAdmin,
      pass: item.password,
      budget: item.budget,
      createAt: item.createdAt,
    }
  })

  const categoryRows = [...dataRow]
  const categoryRowsAll=[...dataRowAll]


  return (
    <div className="datatableEmployee">
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

export default DataEmployees