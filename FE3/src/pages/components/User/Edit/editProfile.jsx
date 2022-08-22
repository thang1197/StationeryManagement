import React, { useEffect, useState } from "react";

import {
    Dialog,
    DialogTitle,
    TextField,
    FormControl,
    Grid,
    Button,
    FormHelperText,
    FormLabel,
    FormControlLabel,
    Radio,
    RadioGroup,
    InputAdornment,
} from "@mui/material";
import ErrorIcon from '@mui/icons-material/Error';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from "react-redux";
import http from "../../../../api/client";
import api from "../../../../api/api";
import { useNavigate } from "react-router-dom";
import validate from "validate.js";
import UpdateSuccessDialog from "../../../components/Admin/dialog/updateSuccess";
import { green } from "@mui/material/colors";
import Moment from 'moment';

function EditProfile(props) {

    let navigate = useNavigate();
    const [success, setSuccess] = useState(false);
    const date = new Date();
    //#region Tao product state de update
    const [employee, setEmployee] = useState({
        employeeId: "",
        employeeName: "",
        email: "",
        address: "",
        phone: "",
        gender: "",
        birthday: "",
        password: "",
        department: "",
        superiors: "",
        roleId: "",
        isAdmin: "",
        budget: "",
        createAt: "",
        updatedAt: date,
    });
    //#endregion

    //#region  Validation
    const [validation, setValidation] = useState({
        touched: {},
        errors: {},
        isvalid: false,
    });
    useEffect(() => {
        const schema = {
            employeeName: {
                presence: {
                    allowEmpty: false,
                    message: "^Employee's name is required",
                },
                length: {
                    maximum: 50,
                    minimum: 5,
                    message: "^Employee name must be from 5 to 50 characters",
                },
            },
            email: {
                presence: { allowEmpty: false, message: "^Email is required" },
                email: {
                    message: "^Email not a valid",
                },
            },
            address: {
                presence: {
                    allowEmpty: false,
                    message: "^Address's  is required",
                },
                length: {
                    maximum: 200,
                    minimum: 20,
                    message: "^Address must be from 20 to 200 characters",
                },
            },
            birthday: {
                presence: {
                    allowEmpty: false,
                    message: "^Birthday's  is required",
                },
            },
            phone: {
                presence: {
                    allowEmpty: false,
                    message: "^Phone number  is required",
                },
                length: {
                    maximum: 12,
                    minimum: 10,
                    message: "^Phone number not a valid, phone number must be from 10 to 12 number",
                },
                format: {
                    pattern: "[0-9]+",
                    flags: "i",
                    message: "Phone number can only numbers"
                }
            },
        };
        const errors = validate.validate(employee, schema);
        setValidation((pre) => ({
            ...pre,
            isvalid: errors ? false : true,
            errors: errors || {},
        }));

    }, [employee]);
    //#endregion 

    //#region set values and validation
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
    const hasError = (field) => {
        return validation.touched[field] && validation.errors[field] ? true : false;
    };
    //#endregion

    //#region HandleEdit
    const handleEdit = async () => {
        try {
            await http.put(api.EditEmployee, employee);
            setSuccess(true);
        } catch (err) {
            navigate("/")
        }
    }
    //#endregion

    //#region log
    const [isOpen, setOpenDialog] = useState(false);

    const handleOpen = () => {
        setEmployee(pre => ({
            ...pre,
            employeeId: props.employee.employeeId,
            employeeName: props.employee.employeeName,
            email: props.employee.email,
            address: props.employee.address,
            phone: props.employee.phone,
            gender: props.employee.gender,
            birthday: props.employee.birthday,
            password: props.employee.password,
            department: props.employee.department,
            superiors: props.employee.superiors,
            roleId: props.employee.roleId,
            isAdmin: props.employee.isAdmin,
            budget: props.employee.budget,
            createAt: props.employee.createAt,
            updatedAt: date,
        }))
        setOpenDialog(true)
    }
    const handleClose = () => {
        setEmployee(pre => ({
            ...pre,
            employeeId: props.employee.employeeId,
            employeeName: props.employee.employeeName,
            email: props.employee.email,
            address: props.employee.address,
            phone: props.employee.phone,
            gender: props.employee.gender,
            birthday: props.employee.birthday,
            password: props.employee.password,
            department: props.employee.department,
            superiors: props.employee.superiors,
            roleId: props.employee.roleId,
            isAdmin: props.employee.isAdmin,
            budget: props.employee.budget,
            createAt: props.employee.createAt,
            updatedAt: date,
        }))
        setOpenDialog(false)
    }
    //#endregion

    return (
        <div>
            <Button className="editButton" variant="outlined" onClick={handleOpen}>Edit</Button>
            {success === true ?
                <UpdateSuccessDialog success={true} />
                :
                <Dialog open={isOpen} maxWidth="lg" fullWidth>
                    <DialogTitle textAlign="center">Edit Profile</DialogTitle>
                    <Grid
                        container
                        p={4}
                        spacing={2}
                    >
                        {/* employee name  */}
                        <Grid item xs={12} md={12} sx={{ margin: 0.5 }}>
                            <TextField
                                fullWidth size="small"

                                InputProps={{
                                    startAdornment: <InputAdornment position="start">
                                        {hasError("employeeName") ?

                                            <CloseIcon className="icon-close" fontSize="medium" style={{ color: 'red' }} />
                                            :
                                            <CheckIcon className="icon-check" fontSize="medium" style={{ color: green[500] }} />
                                        }
                                    </InputAdornment>,
                                }}
                                value={employee.employeeName}
                                label="Employee Name"
                                error={hasError("employeeName")}
                                name="employeeName"
                                placeholder="Employee name"
                                onChange={handleChange}
                            />
                            {hasError("employeeName") ?
                                (
                                    <FormHelperText id="outlined-weight-helper-text" className="text">
                                        <ErrorIcon fontSize="small" />
                                        {validation.errors.employeeName[0]}
                                    </FormHelperText>
                                )
                                :
                                null
                            }
                        </Grid>

                        {/* email  */}
                        <Grid item xs={12} md={12} sx={{ margin: 0.5 }}>
                            <TextField
                                fullWidth size="small"

                                InputProps={{
                                    startAdornment: <InputAdornment position="start">
                                        {hasError("email") ?

                                            <CloseIcon className="icon-close" fontSize="medium" style={{ color: 'red' }} />
                                            :
                                            <CheckIcon className="icon-check" fontSize="medium" style={{ color: green[500] }} />
                                        }
                                    </InputAdornment>,
                                }}
                                value={employee.email}
                                label="Email"
                                error={hasError("email")}
                                name="email"
                                placeholder="Email"
                                onChange={handleChange}
                            />
                            {hasError("email") ?
                                (
                                    <FormHelperText id="outlined-weight-helper-text" className="text">
                                        <ErrorIcon fontSize="small" />
                                        {validation.errors.email[0]}
                                    </FormHelperText>
                                )
                                :
                                null
                            }
                        </Grid>

                        {/* phone  */}
                        <Grid item xs={12} md={12} sx={{ margin: 0.5 }}>
                            <TextField
                                fullWidth size="small"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">
                                        {hasError("phone") ?

                                            <CloseIcon className="icon-close" fontSize="medium" style={{ color: 'red' }} />
                                            :
                                            <CheckIcon className="icon-check" fontSize="medium" style={{ color: green[500] }} />
                                        }
                                    </InputAdornment>,
                                }}
                                value={employee.phone}
                                label="Phone number"
                                error={hasError("phone")}
                                name="phone"
                                placeholder="Phone number"
                                onChange={handleChange}
                            />
                            {hasError("phone") ?
                                (
                                    <FormHelperText id="outlined-weight-helper-text" className="text">
                                        <ErrorIcon fontSize="small" />
                                        {validation.errors.phone[0]}
                                    </FormHelperText>
                                )
                                :
                                null
                            }
                        </Grid>

                        {/* birthday  */}
                        <Grid item xs={12} md={12} sx={{ margin: 0.5 }}>
                            <TextField
                                fullWidth size="small"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">
                                        {hasError("birthday") ?

                                            <CloseIcon className="icon-close" fontSize="medium" style={{ color: 'red' }} />
                                            :
                                            <CheckIcon className="icon-check" fontSize="medium" style={{ color: green[500] }} />
                                        }
                                    </InputAdornment>,
                                }}
                                value={Moment(employee.birthday).format("yyyy-MM-DD")}
                                type="date"
                                label="Birthday"
                                error={hasError("birthday")}
                                name="birthday"
                                placeholder="Birthday"
                                onChange={handleChange}
                            />
                            {hasError("birthday") ?
                                (
                                    <FormHelperText id="outlined-weight-helper-text" className="text">
                                        <ErrorIcon fontSize="small" />
                                        {validation.errors.birthday[0]}
                                    </FormHelperText>
                                )
                                :
                                null
                            }
                        </Grid>

                        {/* address  */}
                        <Grid item xs={12} md={12} sx={{ margin: 0.5 }}>
                            <TextField
                                fullWidth size="small"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">
                                        {hasError("address") ?

                                            <CloseIcon className="icon-close" fontSize="medium" style={{ color: 'red' }} />
                                            :
                                            <CheckIcon className="icon-check" fontSize="medium" style={{ color: green[500] }} />
                                        }
                                    </InputAdornment>,
                                }}
                                value={employee.address}
                                label="Address"
                                error={hasError("address")}
                                name="address"
                                placeholder="Address"
                                onChange={handleChange}
                            />
                            {hasError("address") ?
                                (
                                    <FormHelperText id="outlined-weight-helper-text" className="text">
                                        <ErrorIcon fontSize="small" />
                                        {validation.errors.address[0]}
                                    </FormHelperText>
                                )
                                :
                                null
                            }
                        </Grid>

                        {/* gender  */}
                        <Grid item xs={12} md={12} sx={{ margin: 0.5 }}>
                            <FormControl>
                                <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    value={employee.gender}
                                    name="gender"
                                    onChange={handleChange}
                                >
                                    <FormControlLabel value="Female" control={<Radio />} label="Female" />
                                    <FormControlLabel value="Male" control={<Radio />} label="Male" />
                                    <FormControlLabel value="Other" control={<Radio />} label="Other" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid container item md={12} direction="row" justifyContent="center" alignItems="center">
                            <Button variant="contained" sx={{ marginRight: "20px", width: "250px" }} disabled={validation.isvalid === false} onClick={handleEdit}>Update</Button>
                            <Button variant="outlined" sx={{ width: "250px" }} onClick={handleClose}>Cancle</Button>
                        </Grid>
                    </Grid>
                </Dialog>
            }
        </div>
    )
}


export default EditProfile;