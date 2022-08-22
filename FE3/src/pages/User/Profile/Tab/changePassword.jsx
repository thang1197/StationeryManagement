import AdminNavbars from "../../../components/Admin/navbar/AdminNavbar";
import AdminSidebar from "../../../components/Admin/sidebar/AdminSidebar";
import ErrorIcon from '@mui/icons-material/Error';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Container, FormControl, FormHelperText, Grid, InputAdornment, InputLabel, MenuItem, OutlinedInput, Paper, Select, TextField } from '@mui/material';
import { Button } from '@mui/material';
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { green } from "@mui/material/colors";
import validate, { async } from "validate.js";
import { useDispatch, useSelector } from "react-redux";
import api from "../../../../api/api";
import http from "../../../../api/client";
import SuccessDialog from "../../../components/Admin/dialog/createSuccess";
import "./Information.scss";
import { Card, Col } from "react-bootstrap";

const ChangePassword = (props) => {
  let navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [checkOldPass, setCheckOldPass] = useState(false);
  const [checkNewPass, setCheckNewPass] = useState(false);
  const [next, setNext] = useState(false);
  const dispatch = useDispatch();
  const date = new Date();
  const user = useSelector((state) => state.user.currentUser);
  const [login, setLogin] = useState({
    EmployeeID: user.employeeID,
    Password: "",
  });
  const [employee, setEmployee] = useState({
    employeeId: "",
    employeeName: "",
    email: "",
    address: "",
    phone: "",
    gender: "Female",
    birthday: "",
    password: "",
    department: "",
    superiors: "",
    isAdmin: false,
    roleId: "",
    superiors: "",
    createdAt: "",
    updatedAt: date,
    confirmPassword: "",
  });

  //#region  Validation
  const [validation, setValidation] = useState({
    touched: {},
    errors: {},
    isvalid: false,
  });

  useEffect(() => {
    const schema = {
      password: {
        presence: {
          allowEmpty: false,
          message: "^Password's  is required",
        },
        length: {
          maximum: 24,
          minimum: 8,
          message: "^Password must be from 8 to 24 characters",
        },
      },
      confirmPassword: {
        presence: {
          allowEmpty: false,
          message: "^Password's  is required",
        },
      },
    };
    const errors = validate.validate(employee, schema);
    setValidation((pre) => ({
      ...pre,
      isvalid: errors ? false : true,
      errors: errors || {},
    }));
  }, [employee])
  const handleChange = (event) => {
    setEmployee((preState) => ({
      ...preState,
      [event.target.name]:
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value,
    }));
    setValidation((pre) => ({
      ...pre,
      touched: {
        ...pre.touched,
        [event.target.name]: true,
      },
    }));
  };

  const handleLogin = (event) => {
    setLogin((preState) => ({
      ...preState,
      [event.target.name]:
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value,
    }));
  }

  const hasError = (field) => {
    return validation.touched[field] && validation.errors[field] ? true : false;
  };

  useEffect(() => {
    if (employee.confirmPassword === employee.password) {
      setCheckNewPass(false);
    } else {
      setCheckNewPass(true);
    }
    check();
  }, [employee.roleId, validation, employee.employeeId])
  const check = () => {
    if (validation.isvalid === false) {
      return true;
    } else if (employee.confirmPassword !== employee.password) {
      return true;
    }
    return false;
  }
  //#endregion
  const handleNext = async () => {
    setEmployee(
      {
        ...employee,
        employeeId: props.pro.employeeId,
        employeeName: props.pro.employeeName,
        email: props.pro.email,
        address: props.pro.address,
        phone: props.pro.phone,
        gender: props.pro.gender,
        birthday: props.pro.birthday,
        department: props.pro.department,
        superiors: props.pro.superiors,
        roleId: props.pro.roleId,
        isAdmin: props.pro.isAdmin,
        budget: props.pro.budget,
        createdAt: props.pro.createAt,
        updatedAt: date,
      }
    );
    try {
      await http.post(api.ChekPass, login);
      setNext(true);
      //await http.post(api.CreateCategory, category);
    } catch (err) {
      setCheckOldPass(true);
    }
  }

  const handleEdit = async () => {
    try {
      await http.put(api.EditEmployee, employee);
      setSuccess(true);
    } catch (err) {
      navigate("/");
    }
  }
  return (
    <div >
      <Container>
        <Col md={12}>
          <Card md={4}>
            <Card.Body>
              {success === true ?
                <SuccessDialog page="categories" success={true} />
                :
                next === false ?
                  <div>
                    <Grid container spacing={2}>
                      {/* password  */}
                      <Grid item xs={12} md={12} sx={{ margin: 0.5 }}>
                        <TextField
                          fullWidth size="small"
                          label="Old Password"
                          name="Password"
                          type={"password"}
                          onChange={handleLogin}
                        />
                        {checkOldPass === true ?
                          (
                            <FormHelperText id="outlined-weight-helper-text" className="text">
                              <ErrorIcon fontSize="small" />
                              Old password is not correct
                            </FormHelperText>
                          )
                          :
                          null
                        }
                      </Grid>
                      <Grid item xs={12} md={12} sx={{ margin: 0.5 }} >
                        <Button className="btn-create" variant="contained" onClick={handleNext}>Next</Button>
                      </Grid>
                    </Grid>
                  </div>
                  : <div>
                    <Grid container spacing={2}>
                      {/* password  */}
                      <Grid item xs={12} md={12} sx={{ margin: 0.5 }}>
                        <TextField
                          fullWidth size="small"
                          InputProps={{
                            startAdornment: <InputAdornment position="start">
                              {hasError("password") ?

                                <CloseIcon className="icon-close" fontSize="medium" style={{ color: 'red' }} />
                                :
                                <CheckIcon className="icon-check" fontSize="medium" style={{ color: green[500] }} />
                              }
                            </InputAdornment>,
                          }}
                          value={employee.password}
                          label="Password"
                          error={hasError("password")}
                          name="password"
                          type={"password"}
                          onChange={handleChange}
                        />
                        {hasError("password") ?
                          (
                            <FormHelperText id="outlined-weight-helper-text" className="text">
                              <ErrorIcon fontSize="small" />
                              {validation.errors.password[0]}
                            </FormHelperText>
                          )
                          :
                          null
                        }
                      </Grid>
                      {/* confirm password  */}
                      <Grid item xs={12} md={12} sx={{ margin: 0.5 }}>
                        <TextField
                          fullWidth size="small"
                          InputProps={{
                            startAdornment: <InputAdornment position="start">
                              {hasError("confirmPassword") ?

                                <CloseIcon className="icon-close" fontSize="medium" style={{ color: 'red' }} />
                                :
                                <CheckIcon className="icon-check" fontSize="medium" style={{ color: green[500] }} />
                              }
                            </InputAdornment>,
                          }}
                          label="Confirm Password"
                          error={hasError("confirmPassword")}
                          name="confirmPassword"
                          type={"password"}
                          placeholder="confirmPassword"
                          onChange={handleChange}
                        />
                        {hasError("confirmPassword") ?
                          (
                            <FormHelperText id="outlined-weight-helper-text" className="text">
                              <ErrorIcon fontSize="small" />
                              {validation.errors.confirmPassword[0]}
                            </FormHelperText>
                          )
                          :
                          checkNewPass === true ?
                            (
                              <FormHelperText id="outlined-weight-helper-text" className="text">
                                <ErrorIcon fontSize="small" />
                                Password re-entered is incorrect
                              </FormHelperText>
                            )
                            :
                            null
                        }
                      </Grid>
                      <Grid item xs={12} md={12} sx={{ margin: 0.5 }}>
                        <Button className="btn-create" variant="contained" disabled={check()} onClick={handleEdit}>Update</Button>
                      </Grid>
                    </Grid>
                  </div>
              }
            </Card.Body>
          </Card>
        </Col>
      </Container>
    </div >
  )
}

export default ChangePassword

