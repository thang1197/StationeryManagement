import "./dataorders.scss"
import { DataGrid } from '@mui/x-data-grid';
import { Link, useNavigate } from "react-router-dom";
import http from "../../../../../api/client";
import api from "../../../../../api/api";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Alert, AlertTitle, CircularProgress, Container, Dialog, DialogTitle, Grid } from "@mui/material";
import { GetAllOrder } from "../../../../../redux/order/order.action";
import { GetAllEmployee } from "../../../../../redux/epmloyee/employee.action";
import { Button } from "react-bootstrap";
import DeleteSuccesDialog from "../../dialog/deleteSuccess";
import EditOrder from "../../../../Admin/edit/orders/editOrder";
import DetailsOrder from "../../../../Admin/details/orders/DeatailOrder";
import { RoleGetAll } from "../../../../../redux/role/role.action";
import { GetProfile } from "../../../../../redux/profile/profile.action";

const DataOrders = () => {
  const [success, setSuccess] = useState(false);
  const [id, setId] = useState("");
  const [isDelete, setIsDelete] = useState(false);
  const sta = useSelector((state) => state.orders.status);
  let navigate = useNavigate();
  const dispatch = useDispatch();

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
          rows={orderRows}
          columns={orderColumns}
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

  //#region Call API Orders

  //API Orders
  const getAllOrder = async () => {
    const resOrders = await http.get(api.GetAllOrder);
    dispatch(GetAllOrder(resOrders.data));
  }
  // API employees
  const getAllEmployee = async () => {
    const resEmployee = await http.get(api.GetAllEmployee);
    dispatch(GetAllEmployee(resEmployee.data));
  }
  //api role
  const getAllRole = async () => {
    const resRoles = await http.get(api.GetAllRoles);
    dispatch(RoleGetAll(resRoles.data));
  }
  // API profile
  const getProfile = async () => {
  const resEmp = await http.get(api.GetProfileByIdEmp + user.employeeID);
    dispatch(GetProfile(resEmp.data));
  }

  useEffect(() => {
    getAllOrder()
    getAllEmployee()
    getAllRole()
  }, []);

  const user = useSelector((state) => state.user.currentUser);
  //Selector Roles
  const roles = useSelector((state) => state.roles.roles);
  //select orders
  const orders = useSelector((state) => state.orders.orders);
  //select employees
  const employees = useSelector((state) => state.employees.employees);
  //select profile
  
  //#endregion



  //Ham Handle
  const handleDelete = async (id) => {
    await http.delete(api.DeleteOrder + id);
    getAllOrder();
    setSuccess(true);
  }

  const orderColumns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "employee", headerName: "Employee", width: 300, },
    { field: "status", headerName: "Status", width: 200, },
    { field: "create", headerName: "Order date", width: 200, },
    {
      field: "action", headerName: "Action", width: 400,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            {user.userRoles === 2 && params.row.status == "Approved" ?
              <EditOrder orders={params.row} statusApp="Acceptance" statusRee="Disagree" />
              :
              null
            }
            {user.userRoles === 2 && params.row.status == "Waiting for approval" ?
              <EditOrder orders={params.row} statusApp="Acceptance" statusRee="Disagree" />
              :
              null
            }
            {user.userRoles === 5 && params.row.status == "Waiting for approval" ?
              <EditOrder orders={params.row} statusApp="Approved" statusRee="Rejected" />
              :
              null
            }
            {user.userRoles === 1 && params.row.status === "Rejected" ? 
              <Button className="deleteButton" variant="outlined" onClick={() => {
                setIsDelete(true)
                setId(params.row.id)
              }
              }>Delete</Button> : null}
            {user.userRoles === 1 && params.row.status === "Disagree" ? 
              <Button className="deleteButton" variant="outlined" onClick={() => {
                setIsDelete(true)
                setId(params.row.id)
              }
              }>Delete</Button> : null}
            <DetailsOrder orders={params.row} />
          </div>


        )
      }
    }
  ]

  //Loc order
  let Orlist = [];

  const empList = employees.filter(emp => emp.superiors === user.employeeID)

  let empList2 = [];

  empList.forEach(sup => {
    employees.forEach(emp => {
      if(emp.superiors === sup.employeeId){
        empList2.push(emp)
      }
    })
  })

  console.log(empList2)
  
  
  empList.forEach(emp => {
    orders.forEach(order => {
      if(order.employeeId === emp.employeeId){
        Orlist.push(order)
      }
    })
  })
 
  empList2.forEach(emp => {
    orders.forEach(order => {
      if(order.employeeId === emp.employeeId && order.status === "Approved"){
        Orlist.push(order)
      }
    })
  })

  if(user.userRoles === 1){
    Orlist = [...orders]
  }

  const orderRows = Orlist.map((order) => {
    let name = employees.find(e => e.employeeId === order.employeeId)
    if (name === undefined) {
      name = {
        employeeName: ""
      }
    }
    return {
      id: order.orderId,
      employee: name.employeeName,
      status: order.status,
      create: order.createdAt.substr(0, 10),
      empId: order.employeeId,
    }
  })
  return (
    <div className="datatableorder">
      {success === true ?
        <DeleteSuccesDialog success={true} />
        :
        <>
          <DeleteDialog Id={id} />
          <Render status={sta} />
        </>
      }
    </div>
  )
}

export default DataOrders