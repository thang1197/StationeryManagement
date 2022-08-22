import { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    TextField,
    Grid,
    Button,
    InputAdornment,
    FormHelperText,
} from "@mui/material";
import api from "../../../../api/api";
import http from "../../../../api/client";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RoleGetAll } from "../../../../redux/role/role.action";
import validate from "validate.js";
import { green } from "@mui/material/colors";
import ErrorIcon from '@mui/icons-material/Error';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import UpdateSuccessDialog from "../../../components/Admin/dialog/updateSuccess";

function EditRole(props) {
    let navigate = useNavigate();
    const dispatch = useDispatch();
    const [success, setSuccess] = useState(false);
    const [isOpen, setOpenDialog] = useState(false);
    const [checkName, setCheckName] = useState(false);

    const date = new Date();
    const [role, setRole] = useState({
        roleId: props.role.id,
        roleName: props.role.name,
        updatedAt: date,
    });

    //#region call api roles

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
        if(role.roleName !== props.role.name){
            let rolname = roles.find(e => e.roleName === role.roleName);
            if (rolname === undefined) {
                setCheckName(false);
            } else {
                setCheckName(true);
            }
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

    const handleEdit = async () => {
        setSuccess(true);
        await http.put(api.EditRoles, role);
    }


    const handleOpen = () => {
        setOpenDialog(true)
    }

    const handleClose = () => {
        setRole((preCate) => ({
            ...preCate,
            roleName: props.role.name
        }))
        setOpenDialog(false)
    }
    return (
        <div>
            <Button className="editButton" variant="outlined" onClick={handleOpen}>Edit</Button>
            {success === true ?
                <UpdateSuccessDialog success={true} />
                :
            <Dialog open={isOpen} maxWidth="sm" fullWidth>
                <DialogTitle textAlign="center">Create New Category</DialogTitle>
                <Grid
                    container
                    p={4}
                    spacing={2}
                >
                    <Grid item md={12}>
                        <TextField label="Category ID" variant="outlined" className="InputField" fullWidth defaultValue={role.roleId} InputProps={{ readOnly: true }} />
                    </Grid>
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
                    <Grid container item md={12} direction="row" justifyContent="center" alignItems="center">
                        <Button variant="contained" sx={{ marginRight: "20px", width: "250px" }} disabled={check()} onClick={handleEdit}>Edit</Button>
                        <Button variant="outlined" sx={{ width: "250px" }} onClick={handleClose}>Cancle</Button>
                    </Grid>

                </Grid>
            </Dialog>
}
        </div>
    )
}

export default EditRole;