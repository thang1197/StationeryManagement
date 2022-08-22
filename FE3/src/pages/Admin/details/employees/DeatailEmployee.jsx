import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  TextField,
  FormControl,
  Grid,
  Button,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import Moment from 'moment';

function DetailsEmployee(props) {
  const [isOpen, setOpenDialog] = useState(false);
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
        <DialogTitle textAlign="center">Employee: {props.employee.name}</DialogTitle>
        <Grid
          container
          p={4}
          spacing={2}

        >
          <Grid item md={4}>
            <TextField label="Employee ID" variant="outlined" className="InputField" fullWidth value={props.employee.id} InputProps={{readOnly: true}} />
          </Grid>
          <Grid item md={4}>
            <TextField label="Name" variant="outlined" className="InputField" fullWidth value={props.employee.name} InputProps={{readOnly: true}} ></TextField>
          </Grid>
          <Grid item md={4}>
            <TextField label="Email" variant="outlined" className="InputField" fullWidth value={props.employee.email} InputProps={{readOnly: true}} ></TextField>
          </Grid>
          <Grid item md={4}>
            <TextField label="Address" variant="outlined" className="InputField" fullWidth value={props.employee.address} InputProps={{readOnly: true}} ></TextField>
          </Grid>
          <Grid item md={4}>
            <TextField label="Phone" variant="outlined" className="InputField" fullWidth value={props.employee.phone} InputProps={{readOnly: true}} ></TextField>
          </Grid>
          <Grid item md={4}>
            <TextField  label="Birthday" variant="outlined" className="InputField"  fullWidth value={Moment(props.employee.birthday).format("L")} InputProps={{readOnly: true}}></TextField>
          </Grid>
          <Grid item md={4}>
            <TextField label="Phone" variant="outlined" className="InputField" fullWidth value={props.employee.phone} InputProps={{readOnly: true}} ></TextField>
          </Grid>
          <Grid item md={4}>
            <TextField  label="Birthday" variant="outlined" className="InputField"  fullWidth value={Moment(props.employee.birthday).format("L")} InputProps={{readOnly: true}}></TextField>
          </Grid>
          <Grid item md={4}>
              <TextField label="Budget" variant="outlined" className="InputField" fullWidth value={props.employee.budget} InputProps={{readOnly: true}} ></TextField>
          </Grid>
          <Grid item md={4}>
            <TextField label="Department" variant="outlined" className="InputField" fullWidth value={props.employee.department} InputProps={{readOnly: true}} ></TextField>
          </Grid>
          <Grid item md={4}>
            <TextField label="Superior" variant="outlined" className="InputField" fullWidth value={props.employee.superiors} InputProps={{readOnly: true}} ></TextField>
          </Grid>
          <Grid container item md={12} direction="row" justifyContent="center" alignItems="center">
            <Button variant="outlined" sx={{ width: "250px" }} onClick={handleClose}>Close</Button>
          </Grid>

        </Grid>
      </Dialog>
    </div>
  )
}

export default DetailsEmployee;