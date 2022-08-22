import "./listroles.scss"
import DataRoles from "../../../components/Admin/dataTable/role/dataRole";
import AdminNavbars from "../../../components/Admin/navbar/AdminNavbar";
import AdminSidebar from "../../../components/Admin/sidebar/AdminSidebar";
import { RoleGetAll } from "../../../../redux/role/role.action";
import http from "../../../../api/client";
import api from "../../../../api/api";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { Alert, AlertTitle, Dialog, DialogTitle, Grid, TextField, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
const ListRoles = () => {

  //#region  Call API Role
  const dispatch = useDispatch()
  const getAllRoles = async () => {
    const res = await http.get(api.GetAllRoles)
    dispatch(RoleGetAll(res.data))
  }
  //#endregion

  //#region SetUpBudget Dialog
  const roles = useSelector((state) => state.roles.roles)

  const [isOpen, setIsOpen] = useState(false)

  const SetUpBudget = (props) => {


    const [listRole, setListRole] = useState([...roles])


    const handleChangeBudget = (event, id) => {

      const listChange = [...listRole];

      listChange.forEach((e, i) => {
        if (e.roleId === id) {
          listChange[i] = { ...listChange[i], budget: parseInt(event.target.value) }
        }
      })

      setListRole([...listChange])
    }

    const handleSetUp = async () => {
      await http.post(api.setBudget, listRole)
      getAllRoles()
      setIsOpen(false)
      setIsSuccess(true)
    }
    return (
      <div>
        <Dialog open={isOpen} maxWidth="sm" fullWidth>
          <DialogTitle textAlign="center">Set Up Budget</DialogTitle>
          <Grid
            container
            p={4}
            spacing={2}
          >
            {roles.map((role) => (
              <Grid item container md={12} xs={12} key={role.roleId}>
                <Grid item md={6} xs={6}>
                  <Typography>{role.roleName}</Typography>
                </Grid>
                <Grid item md={6} xs={6}>
                  <TextField name="Budget" roleid={role.roleId} type="number" label="Budget" defaultValue={role.budget}
                    onChange={(event) => {
                      handleChangeBudget(event, role.roleId)
                    }}></TextField>
                </Grid>
              </Grid>
            ))}
            <Grid container item md={12} direction="row" justifyContent="center" alignItems="center">
              <Button variant="contained" sx={{ marginRight: "20px", width: "250px" }} onClick={handleSetUp}>Set Up</Button>
              <Button variant="outlined" sx={{ width: "250px" }} onClick={() => { setIsOpen(false) }}>Cancle</Button>
            </Grid>

          </Grid>
        </Dialog>
      </div>
    )
  }
  //#endregion

  //#region Set Up Successfully Dialog
  const [isSuccess, setIsSuccess] = useState(false)
  const SetUpSuccessDialog = () => {
    return (
      <div>
        <Dialog open={isSuccess} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Alert severity="success" variant="filled" >
              <AlertTitle>Success</AlertTitle>
              Set Up Successfully <strong>check it out!</strong>
            </Alert>
          </DialogTitle>
          <Button variant="outlined" sx={{ width: "250px", margin: "20px auto" }} color="success" onClick={() => { setIsSuccess(false) }}>OK</Button>
        </Dialog>
      </div>
    )
  }
  //#endregion

  return (
    <div className="Rolehome">
      <AdminSidebar id={5} />
      <div className="RolehomeContainer">
        <AdminNavbars title="List Roles" />
        <SetUpSuccessDialog/>
        <SetUpBudget />
        <div className="btn-create-role sm md">
          <Link to="/admin/roles/create" style={{ textDecoration: "none" }}>
            <Button variant="outlined">Create</Button>
          </Link>
          <Button variant="outlined" sx={{ marginLeft: "20px" }} color="secondary" onClick={() => { setIsOpen(true) }}>Set Up Budget</Button>
        </div>
        <DataRoles />
      </div>
    </div>
  )
}

export default ListRoles         