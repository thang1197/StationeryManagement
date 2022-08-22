import React, { useEffect, useState } from "react";

import {
    Dialog,
    DialogTitle,
    TextField,
    FormControl,
    Grid,
    Button,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    FormLabel,
    FormControlLabel,
    Radio,
    Box,
    RadioGroup
} from "@mui/material";
import ErrorIcon from '@mui/icons-material/Error';
import { GetAllEmployee } from "../../../../redux/epmloyee/employee.action";
import { useDispatch, useSelector } from "react-redux";
import http from "../../../../api/client";
import api from "../../../../api/api";
import { useNavigate } from "react-router-dom";
import validate from "validate.js";
import UpdateSuccessDialog from "../../../components/Admin/dialog/updateSuccess";
function EditEmployee(props) {
    const [role, setRole] = useState(false);
    const [sup, setSupRole] = useState(false);
    let navigate = useNavigate();
    const dispatch = useDispatch();
    const [checkSup, setCheckSup] = useState(false);
    const [success, setSuccess] = useState(false);
    const date = new Date();
    //#region Tao product state de update
    const [employee, setEmployee] = useState({
        EmployeeId: props.employee.id,
        EmployeeName: props.employee.name,
        Email: props.employee.email,
        Address: props.employee.address,
        Phone: props.employee.phone,
        Gender: props.employee.gender,
        Birthday: props.employee.birthday,
        Password: props.employee.pass,
        Department: props.employee.department,
        Superiors: props.employee.superiors,
        RoleId: props.employee.idRole,
        IsAdmin: props.employee.isAdmin,
        Budget: props.employee.budget,
        CreateAt: props.employee.createAt,
        UpdatedAt: date,
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
            Superiors: {
                presence: {
                    allowEmpty: false,
                    message: "^Employee name is required",
                },
                length: {
                    minimum: 8,
                    message: "^Employee name must be greater than 8 characters",
                },
            },
        };
        const errors = validate.validate(employee, schema);
        setValidation((pre) => ({
            ...pre,
            isvalid: errors ? false : true,
            errors: errors || {},
        }));

    }, [employee]);
    const handleChange = (event) => {
        if (event.target.name != "IsAdmin") {
            setEmployee((preState) => ({
                ...preState,
                [event.target.name]:
                    event.target.type === "checkbox"
                        ? event.target.checked
                        : event.target.value,
            }));
        } else if (event.target.name === "IsAdmin") {
            let admin;
            if (event.target.value === "true") {
                admin = true;
            } else {
                admin = false;
            }
            setEmployee((preState) => ({
                ...preState,
                IsAdmin: admin
            }));
        }
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

    useEffect(() => {
        if (employee.Superiors === "") {
            setCheckSup(true);
        } else {
            setCheckSup(false);
        }
        check();
       
    }, [employee.Superiors, validation])
    const check = () => {
        if (validation.isvalid === false) {
            return true;
        } else if (checkSup === true) {
            return true;
        }
        return false;
    }
    //#endregion

    //Role Selector
    const roles = useSelector((state) => state.roles.roles)
    //#region HandleEdit
    const handleEdit = async () => {
        try {
            await http.put(api.EditEmployee, employee);
            setSuccess(true);
        } catch (err) {
            
        }
    }

    const employees = useSelector((state) => state.employees.employees);
    //#endregion

    //#region log
    const [isOpen, setOpenDialog] = useState(false);

    const handleOpen = () => {
        setOpenDialog(true)
    }

    const handleClose = () => {
        setEmployee(pre => ({
            ...pre,
            EmployeeId: props.employee.id,
            EmployeeName: props.employee.name,
            Email: props.employee.email,
            Address: props.employee.address,
            Birthday: props.employee.birthday,
            Password: props.employee.pass,
            Department: props.employee.department,
            Phone: props.employee.phone,
            Superiors: props.employee.superiors,
            RoleId: props.employee.idRole,
            IsAdmin: props.employee.isAdmin,
            Budget: props.employee.budget,
        }))
        setOpenDialog(false)
    }
    //#endregion

    //#region super
    const [superior, setSuperior] = useState([])

    const handleRoleIndex = (event) => {
        const index = roles.findIndex(e => e.roleId === event.target.value)
        if (roles[index - 1] != undefined) {
            const superiors = employees.filter(emp => emp.roleId === roles[index - 1].roleId)
            setSuperior([...superiors])
        } else {
            setSuperior([])
        }

    }

    const handleReset = () => {
        setEmployee(pre => ({
            ...pre,
            Superiors: ""
        }))
    }
    //#endregion
    return (
        <div>
            <Button className="editButton" variant="outlined" onClick={handleOpen}>Edit</Button>
            {success === true ?
                <UpdateSuccessDialog success={true} />
                :
                <Dialog open={isOpen} maxWidth="lg" fullWidth>
                    <DialogTitle textAlign="center">Update Employee</DialogTitle>
                    <Grid
                        container
                        p={4}
                        spacing={2}
                    >
                        {/* employee id */}
                        <Grid item md={4}>
                            <TextField label="Employee ID" variant="outlined" className="InputField" fullWidth
                                inputProps={{ readOnly: true }} defaultValue={employee.EmployeeId} />
                        </Grid>

                        {/* Department*/}
                        <Grid item md={4}>
                            <TextField label="Department" variant="outlined" className="InputField" fullWidth
                                name="Department" value={employee.Department} onChange={handleChange} />
                        </Grid>

                        {/* isAdmin  */}
                        <Grid item md={4}>
                            <FormControl>
                                <FormLabel >Is Admin</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-controlled-radio-buttons-group"
                                    name="IsAdmin"
                                    value={employee.IsAdmin}
                                    onChange={handleChange}>
                                    <FormControlLabel value={true} control={<Radio />} label="True" />
                                    <FormControlLabel value={false} control={<Radio />} label="False" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        {/* role  */}
                        <Grid item xs={12} md={12} sx={{ margin: 0.5 }}>
                            <Box sx={{ minWidth: 120 }}>
                                <FormControl fullWidth size="small">
                                    <InputLabel id="demo-simple-select-label">Role</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        value={employee.RoleId}
                                        name="RoleId"
                                        label="Role"
                                        onChange={(e) => {
                                            handleReset()
                                            handleChange(e)
                                            handleRoleIndex(e)
                                        }}
                                    >
                                        {roles.map(roles => (
                                            <MenuItem key={roles.roleId} value={roles.roleId}>{roles.roleName}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                            {role === true ?
                                (
                                    <FormHelperText className="text">
                                        <ErrorIcon fontSize="small" />
                                        Roles can not blank
                                    </FormHelperText>
                                )
                                :
                                null
                            }
                        </Grid>

                        {/* superior  */}
                        {superior.length !== 0 ? (
                            <Grid item xs={12} md={12} sx={{ margin: 0.5 }}>
                                <FormControl fullWidth size="small">
                                    <InputLabel id="demo-simple-select-label">Superior</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        value={employee.Superiors}
                                        name="Superiors"
                                        label="Superior"
                                        onChange={(e) => {
                                            handleChange(e)
                                        }}
                                    >
                                        {superior.map(sup => {
                                            return (
                                                <MenuItem key={sup.employeeId} value={sup.employeeId}>{sup.employeeName}</MenuItem>
                                            )
                                        })}
                                    </Select>
                                </FormControl>
                                {checkSup === true ?
                                    (
                                        <FormHelperText id="outlined-weight-helper-text" className="text">
                                            <ErrorIcon fontSize="small" />
                                            This superiors can not blank
                                        </FormHelperText>
                                    )
                                    :
                                    null
                                }
                            </Grid>
                        ) : null}
                        <Grid container item md={12} direction="row" justifyContent="center" alignItems="center">
                            <Button variant="contained" sx={{ marginRight: "20px", width: "250px" }} disabled={check()} onClick={handleEdit}>Update</Button>
                            <Button variant="outlined" sx={{ width: "250px" }} onClick={handleClose}>Cancle</Button>
                        </Grid>
                    </Grid>
                </Dialog>
            }
        </div>
    )
}


export default EditEmployee;