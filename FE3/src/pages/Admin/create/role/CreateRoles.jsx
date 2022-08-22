import AdminNavbars from "../../../components/Admin/navbar/AdminNavbar";
import AdminSidebar from "../../../components/Admin/sidebar/AdminSidebar";
import "./createrole.scss";
import { Container, FormHelperText, Grid, InputAdornment, Paper } from '@mui/material';
import { TextField } from '@mui/material';
import { Button } from '@mui/material';
import { useNavigate } from "react-router";
import http from "../../../../api/client";
import api from "../../../../api/api";
import { useEffect, useState } from "react";
import { RoleGetAll } from "../../../../redux/role/role.action";
import validate from "validate.js";
import { green } from "@mui/material/colors";
import ErrorIcon from '@mui/icons-material/Error';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from "react-redux";
import SuccessDialog from "../../../components/Admin/dialog/createSuccess";

const CreateRole = () => {
    let navigate = useNavigate();
    const [success, setSuccess] = useState(false);
    const [checkName, setCheckName] = useState(false);
    const dispatch = useDispatch();

    const date = new Date();
    const [role, setRole] = useState({
        roleName: "",
        createdAt: date,
    })

    //#region call api roles
    const getAllRoles = async () => {
        try {
            const res = await http.get(api.GetAllRoles);
            dispatch(RoleGetAll(res.data));
        } catch (err) {
            navigate("/")
        }
    }

    useEffect(() => {
        getAllRoles();
    }, [])
    const roles = useSelector((state) => state.roles.roles);
    //#endregion

    //#region  Validation
    const [validation, setValidation] = useState({
        touched: {},
        errors: {},
        isvalid: false,
    });

    useEffect(() => {
        const schema = {
            roleName: {
                presence: {
                    allowEmpty: false,
                    message: "^Role name is required",
                },
                length: {
                    maximum: 50,
                    minimum: 5,
                    message: "^Role name must be from 5 to 50 characters",
                },
            },
        };
        const errors = validate.validate(role, schema);
        setValidation((pre) => ({
            ...pre,
            isvalid: errors ? false : true,
            errors: errors || {},
        }));
    }, [role])
    const handleChange = (event) => {
        setRole((preState) => ({
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

    useEffect(() => {
        let rolname = roles.find(e => e.roleName === role.roleName);
        if (rolname === undefined) {
            setCheckName(false);
        } else {
            setCheckName(true);
        }
        check();
    }, [role.roleName, validation])
    const check = () => {
        if (validation.isvalid === false) {
            return true;
        } else if (checkName === true) {
            return true;
        }
        return false;
    }
    //#endregion

    //#region  call api create role
    const handleCreate = async () => {
        try {
            await http.post(api.CreateRole, role);
            setSuccess(true);
        } catch (err) {
            navigate("/")
        }
    }
    //#endregion
    return (
        <div className="role">
            <AdminSidebar id={5} />
            <div className="roleContainer">
                <AdminNavbars title="Create Role" />
                <div className="create sm md">
                    <Container>
                        {success === true ?
                            <SuccessDialog page="roles" success={true} />
                            :
                            <Paper>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={12} sx={{ margin: 0.5 }}>
                                        <TextField
                                            fullWidth size="small"
                                            id="outlined-start-adornment"
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">
                                                    {hasError("roleName") ?
                                                        <CloseIcon className="icon-close" fontSize="medium" style={{ color: 'red' }} />
                                                        :
                                                        <CheckIcon className="icon-check" fontSize="medium" style={{ color: green[500] }} />}
                                                </InputAdornment>,
                                            }}
                                            value={role.roleName}
                                            label="Role Name"
                                            name="roleName"
                                            onChange={handleChange}
                                        />
                                        {hasError("roleName") ?
                                            (
                                                <FormHelperText id="outlined-weight-helper-text" className="text">
                                                    <ErrorIcon fontSize="small" />
                                                    {validation.errors.roleName[0]}
                                                </FormHelperText>
                                            )
                                            :
                                            (checkName === true ?
                                                (
                                                    <FormHelperText id="outlined-weight-helper-text" className="text">
                                                        <ErrorIcon fontSize="small" />
                                                        This name already exists
                                                    </FormHelperText>
                                                )
                                                :
                                                null
                                            )
                                        }
                                    </Grid>
                                    <Grid item>
                                        <Button sx={{ marginLeft: 60, marginBottom: 1 }} variant="contained" disabled={check()} onClick={handleCreate}>Create</Button>
                                        <Button sx={{ marginLeft: 1, marginBottom: 1 }} variant="contained" color="error"
                                            onClick={() => { navigate("/admin/roles") }} >Back</Button>
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

export default CreateRole

