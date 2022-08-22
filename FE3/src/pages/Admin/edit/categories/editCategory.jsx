import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    TextField,
    Grid,
    Button,
    Select,
    MenuItem,
    InputLabel,
    InputAdornment,
    FormHelperText,
} from "@mui/material";
import api from "../../../../api/api";
import http from "../../../../api/client";
import validate from "validate.js";
import { useDispatch, useSelector } from "react-redux";
import ErrorIcon from '@mui/icons-material/Error';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { green } from "@mui/material/colors";
import { CategoriesGetAll } from "../../../../redux/category/category.action";
import { useNavigate } from "react-router-dom";
import UpdateSuccessDialog from "../../../components/Admin/dialog/updateSuccess";

function EditCategory(props) {
    let navigate = useNavigate();
    const dispatch = useDispatch();
    const [success, setSuccess] = useState(false);
    const [checkName, setCheckName] = useState(false);
    const [category, setCategory] = useState({
        CategotyId: props.category.id,
        CategotyName: props.category.categoryName,
        IdParent:
            (props.category.idParent === undefined ?
                0
                :
                props.category.idParent
            ),
    });

    //#region  Validation
    const [validation, setValidation] = useState({
        touched: {},
        errors: {},
        isvalid: false,
    });

    useEffect(() => {
        const schema = {
            CategotyName: {
                presence: {
                    allowEmpty: false,
                    message: "^Category name is required",
                },
                length: {
                    maximum: 50,
                    minimum: 3,
                    message: "^Category name must be from 5 to 50 characters",
                },
            },
        };
        const errors = validate.validate(category, schema);
        setValidation((pre) => ({
            ...pre,
            isvalid: errors ? false : true,
            errors: errors || {},
        }));
    }, [category])
    const handleChange = (event) => {
        setCategory((preState) => ({
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
        if (category.CategotyName !== props.category.categoryName && category.IdParent !== props.category.idParent) {
            let catename = categories.find(e => e.categotyName === category.CategotyName && e.idParent === category.IdParent);
            if (catename === undefined) {
                setCheckName(false);
            } else {
                setCheckName(true);
            }
        }
        check();
    }, [category.CategotyName, validation])
    const check = () => {
        if (validation.isvalid === false) {
            return true;
        } else if (checkName === true) {
            return true;
        }
        return false;
    }
    //#endregion

    //#region call api categories
    const handleEdit = async () => {
        setSuccess(true);
        await http.put(api.EditCategory, category);      
    }
    const categories = useSelector((state) => state.categories.categories);
    //#endregion

    //#region log
    const [isOpen, setOpenDialog] = useState(false);

    const handleOpen = () => {
        setOpenDialog(true)
    }

    const handleClose = () => {
        setCategory((preCate) => ({
            ...preCate,
            CategotyName: props.category.categoryName
        }))
        setOpenDialog(false);
    }
    //#endregion
    return (
        <div>
            <Button className="editButton" variant="outlined" onClick={handleOpen}>Edit</Button>
            {success === true ?
                <UpdateSuccessDialog success={true} />
                :              
                <Dialog open={isOpen} maxWidth="lg" fullWidth>
                    <DialogTitle textAlign="center">Eidt Category</DialogTitle>
                    <Grid
                        container
                        p={4}
                        spacing={2}
                    >
                        <Grid item md={12}>
                            <TextField label="Category ID" variant="outlined" className="InputField" fullWidth defaultValue={category.CategotyId} InputProps={{ readOnly: true }} />
                        </Grid>
                        <Grid item md={12}>
                            <TextField
                                fullWidth size="small"
                                id="outlined-start-adornment"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">
                                        {hasError("CategotyName") ?
                                            <CloseIcon className="icon-close" fontSize="medium" style={{ color: 'red' }} />
                                            :
                                            <CheckIcon className="icon-check" fontSize="medium" style={{ color: green[500] }} />}
                                    </InputAdornment>,
                                }}
                                value={category.CategotyName}
                                label="Create Category"
                                name="CategotyName"
                                onChange={handleChange}
                            />
                            {hasError("CategotyName") ?
                                (
                                    <FormHelperText id="outlined-weight-helper-text" className="text">
                                        <ErrorIcon fontSize="small" />
                                        {validation.errors.CategotyName[0]}
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
                        <Grid item md={12}>
                            <InputLabel id="demo-simple-select-label">IdParent</InputLabel>
                            <Select
                                fullWidth
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={category.IdParent}
                                label="Parent"
                                name="IdParent"
                                onChange={handleChange}
                            >
                                <MenuItem value={0} selected>None</MenuItem>
                                {categories.map(categories => (
                                    <MenuItem key={categories.categotyId} value={categories.categotyId}>{categories.categotyName}</MenuItem>
                                ))}
                            </Select>
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

export default EditCategory;