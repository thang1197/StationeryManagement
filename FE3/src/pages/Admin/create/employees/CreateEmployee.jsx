import "./createemployee.scss"
import AdminNavbars from "../../../components/Admin/navbar/AdminNavbar";
import AdminSidebar from "../../../components/Admin/sidebar/AdminSidebar";
import http from "../../../../api/client";
import api from "../../../../api/api";
import ErrorIcon from '@mui/icons-material/Error';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';
import { Box, Button, Container, FormControl, FormControlLabel, FormHelperText, FormLabel, Grid, InputAdornment, InputLabel, MenuItem, Paper, Radio, RadioGroup, Select, Stack, TextField } from "@mui/material";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { RoleGetAll } from "../../../../redux/role/role.action";
import validate from "validate.js";
import { green } from "@mui/material/colors";
import { GetAllEmployee } from "../../../../redux/epmloyee/employee.action";
import SuccessDialog from "../../../components/Admin/dialog/createSuccess";

const CreateEmployee = () => {

    const [role, setRole] = useState(false);
    const [checkId, setCheckId] = useState(false);
    const [sup, setSupRole] = useState(false);
    const [success, setSuccess] = useState(false);
    const date = new Date();
    const dispatch = useDispatch();
    let navigate = useNavigate();

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
        superiors: "0",
        createdAt: date,

    })

    //#region call api

    // API Role
    const getAllRole = async () => {
        const resRoles = await http.get(api.GetAllRoles);
        dispatch(RoleGetAll(resRoles.data));
    }

    useEffect(() => {
        getAllRole();
    }, [])
    const roles = useSelector((state) => state.roles.roles);

    // API employees
    const getAllEmployee = async () => {
        const resEmp = await http.get(api.GetAllEmployee);
        dispatch(GetAllEmployee(resEmp.data));
    }

    useEffect(() => {
        getAllEmployee();
    }, [])

    const employees = useSelector((state) => state.employees.employees);
    //#endregion

    //#region  Validation
    const [validation, setValidation] = useState({
        touched: {},
        errors: {},
        isvalid: false,
    });
    useEffect(() => {
        const schema = {
            employeeId: {
                presence: {
                    allowEmpty: false,
                    message: "^Employee's id is required",
                },
                length: {
                    minimum: 8,
                    message: "^Employee id must be at least 8 characters",
                },
            },
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
            department: {
                presence: {
                    allowEmpty: false,
                    message: "^Department's  is required",
                },
                length: {
                    maximum: 50,
                    minimum: 5,
                    message: "^Department must be from 5 to 50 characters",
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
    useEffect(() => {
        let empname = employees.find(e => e.employeeId === employee.employeeId);
        if (empname === undefined) {
            setCheckId(false);
        } else {
            setCheckId(true);
        }
        if (employee.roleId !== undefined) {
            setRole(false);
        } else {
            setRole(true);
        }
        if (employee.superiors !== "") {
            setSupRole(false);
        } else {
            setSupRole(true);
        }
        check();
    }, [employee.roleId, validation, employee.employeeId])
    const check = () => {
        if (validation.isvalid === false) {
            return true;
        } else if (employee.roleId === undefined) {
            return true;
        } else if (checkId === true) {
            return true;
        } else if (employee.superiors === "") {
            return true;
        }
        return false;
    }
    //#endregion 

    //#region set values and validation
    const handleChange = (event) => {
        if (event.target.name != "isAdmin") {
            setEmployee((preState) => ({
                ...preState,
                [event.target.name]:
                    event.target.type === "checkbox"
                        ? event.target.checked
                        : event.target.value,
            }));
        } else if (event.target.name === "isAdmin") {
            let admin;
            if (event.target.value === "true") {
                admin = true;
            } else {
                admin = false;
            }
            setEmployee((preState) => ({
                ...preState,
                isAdmin: admin
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
    //#endregion

    //#region call api create
    const handleSubmit = async () => {
        try {
            await http.post(api.CreateEmployee, employee);
            setSuccess(true);
        } catch (err) {
            navigate("/")
        }
    }
    //#endregion

    //#region super
    const [superior, setSuperior] = useState([])

    const handleRoleIndex = (event) => {
        const index = roles.findIndex(e => e.roleId === event.target.value)
        if(index !== 1){
            if (roles[index - 1] != undefined) {
                const superiors = employees.filter(emp => emp.roleId === roles[index - 1].roleId)
                setSuperior([...superiors])
            } else {
                setSuperior([])
            }
        }else {
            setSupRole(false);
            setSuperior([])
        }
        

    }
    //#endregion
    return (
        <div className="home">
            <AdminSidebar id={3} />
            <div className="homeContainer">
                <AdminNavbars title="Create Employee" />
                <div className="create sm md">
                    <Container>
                        {success === true ?
                            <SuccessDialog page="employees" success={true} />
                            :
                            <Paper>
                                <Grid container spacing={2}>
                                    {/* employee id  */}
                                    <Grid item xs={12} md={12} sx={{ margin: 0.5 }}>
                                        <TextField
                                            fullWidth size="small"

                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">
                                                    {hasError("employeeId") ?

                                                        <CloseIcon className="icon-close" fontSize="medium" style={{ color: 'red' }} />
                                                        :
                                                        <CheckIcon className="icon-check" fontSize="medium" style={{ color: green[500] }} />
                                                    }
                                                </InputAdornment>,
                                            }}
                                            label="Employee Id"
                                            error={hasError("employeeId")}
                                            name="employeeId"
                                            placeholder="Employee id"
                                            onChange={handleChange}
                                        />
                                        {hasError("employeeId") ?
                                            (
                                                <FormHelperText id="outlined-weight-helper-text" className="text">
                                                    <ErrorIcon fontSize="small" />
                                                    {validation.errors.employeeId[0]}
                                                </FormHelperText>
                                            )
                                            :
                                            (checkId === true ?
                                                (
                                                    <FormHelperText id="outlined-weight-helper-text" className="text">
                                                        <ErrorIcon fontSize="small" />
                                                        This ID already exists
                                                    </FormHelperText>
                                                )
                                                :
                                                null
                                            )
                                        }
                                    </Grid>

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
                                            label="Password"
                                            error={hasError("password")}
                                            name="password"
                                            type={"password"}
                                            placeholder="Password"
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


                                    {/* department  */}
                                    <Grid item xs={12} md={12} sx={{ margin: 0.5 }}>
                                        <TextField
                                            fullWidth size="small"
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">
                                                    {hasError("department") ?

                                                        <CloseIcon className="icon-close" fontSize="medium" style={{ color: 'red' }} />
                                                        :
                                                        <CheckIcon className="icon-check" fontSize="medium" style={{ color: green[500] }} />
                                                    }
                                                </InputAdornment>,
                                            }}
                                            label="Department"
                                            error={hasError("department")}
                                            name="department"
                                            placeholder="Department"
                                            onChange={handleChange}
                                        />
                                        {hasError("department") ?
                                            (
                                                <FormHelperText id="outlined-weight-helper-text" className="text">
                                                    <ErrorIcon fontSize="small" />
                                                    {validation.errors.department[0]}
                                                </FormHelperText>
                                            )
                                            :
                                            null
                                        }
                                    </Grid>

                                    {/* role  */}
                                    <Grid item xs={12} md={12} sx={{ margin: 0.5 }}>
                                        <Box sx={{ minWidth: 120 }}>
                                            <FormControl fullWidth size="small">
                                                <InputLabel id="demo-simple-select-label">Role</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    value={employee.roleId}
                                                    name="roleId"
                                                    label="Role"
                                                    onChange={(e) => {
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
                                                    value={employee.superiors}
                                                    name="superiors"
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
                                            {sup === true ?
                                                (
                                                    <FormHelperText className="text">
                                                        <ErrorIcon fontSize="small" />
                                                        Superior can not blank
                                                    </FormHelperText>
                                                )
                                                :
                                                null
                                            }
                                        </Grid>
                                    ) : null}

                                    {/* gender  */}
                                    <Grid item xs={12} md={12} sx={{ margin: 0.5 }}>
                                        <FormControl>
                                            <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
                                            <RadioGroup
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
                                    {/* isAdmin  */}
                                    <Grid item md={4}>
                                        <FormControl>
                                            <FormLabel >Is Admin</FormLabel>
                                            <RadioGroup
                                                row
                                                aria-labelledby="demo-controlled-radio-buttons-group"
                                                name="isAdmin"
                                                value={employee.isAdmin}
                                                onChange={handleChange}>
                                                <FormControlLabel value={true} control={<Radio />} label="True" />
                                                <FormControlLabel value={false} control={<Radio />} label="False" />
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} md={12} sx={{ margin: 0.5 }}>
                                        <Button className="btn-create-emp" variant="contained" disabled={check()} onClick={handleSubmit}>Create</Button>
                                        <Button className="btn-back-emp" variant="contained" color="error"
                                            onClick={() => { navigate("/admin/employees") }} >Back</Button>
                                    </Grid>
                                </Grid>
                            </Paper>
                        }

                    </Container>
                </div>
            </div>
        </div>
    )
}

export default CreateEmployee