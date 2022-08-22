import AdminNavbars from "../../../components/Admin/navbar/AdminNavbar";
import AdminSidebar from "../../../components/Admin/sidebar/AdminSidebar";
import "./createcategories.scss";
import ErrorIcon from '@mui/icons-material/Error';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Container, FormControl, FormHelperText, Grid, InputAdornment, InputLabel, MenuItem, OutlinedInput, Paper, Select, TextField } from '@mui/material';
import { Button } from '@mui/material';
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { green } from "@mui/material/colors";
import validate from "validate.js";
import { useDispatch, useSelector } from "react-redux";
import api from "../../../../api/api";
import http from "../../../../api/client";
import { CategoriesGetAll } from "../../../../redux/category/category.action";
import SuccessDialog from "../../../components/Admin/dialog/createSuccess";

const CreateCategory = () => {
    let navigate = useNavigate();
    const [success, setSuccess] = useState(false);
    const [checkName, setCheckName] = useState(false);
    const dispatch = useDispatch();
    const date = new Date();
    const [category, setCategory] = useState({
        categotyName: "",
        idParent: 0,
        createdAt: date,
    })

    //#region  call api categories
    const getAllCategories = async () => {
        try {
            const response = await http.get(api.GetAllCategory);
            dispatch(CategoriesGetAll(response.data));
          } catch (err) {
            navigate("/")
        }
    }
    useEffect(() => {
        getAllCategories();
    }, [])

    const categories = useSelector((state) => state.categories.categories);
    //#endregion
    
    //#region  Validation
    const [validation, setValidation] = useState({
        touched: {},
        errors: {},
        isvalid: false,
    });

    useEffect(() => {
        const schema = {
            categotyName: {
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
        let catename = categories.find(e => e.categotyName === category.categotyName && e.idParent == category.idParent);
        if(catename === undefined){
            setCheckName(false);
        }else{
            setCheckName(true);
        }
        check();
    }, [category.categotyName, validation])
    const check = () => {
        if (validation.isvalid === false) {
            return true;
        }else if(checkName === true){
            return true;
        }
        return false;
    }
    //#endregion

    const handleCreate = async () => {
        try {
            await http.post(api.CreateCategory,category);
            setSuccess(true);
        } catch (err) {
            navigate("/")
        }
    }
    return (
        <div className="home">
            <AdminSidebar id={1} />
            <div className="homeContainer">
                <AdminNavbars title="Create Categories" />
                <div className="create">
                    <Container>
                    {success === true?
                        <SuccessDialog page="categories" success={true}/>
                        :
                        <Paper>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={12} sx={{ margin: 0.5 }}>
                                    <TextField
                                        fullWidth size="small"
                                        label="Create Category"
                                        id="outlined-start-adornment"
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">
                                                {hasError("categotyName") ?
                                                    <CloseIcon className="icon-close" fontSize="medium" style={{ color: 'red' }} />
                                                    :
                                                    <CheckIcon className="icon-check" fontSize="medium" style={{ color: green[500] }} />}
                                            </InputAdornment>,
                                        }}
                                        name="categotyName"
                                        onChange={handleChange}
                                    />
                                    {hasError("categotyName") ?
                                        (
                                            <FormHelperText id="outlined-weight-helper-text" className="text">
                                                <ErrorIcon fontSize="small" />
                                                {validation.errors.categotyName[0]}
                                            </FormHelperText>
                                        )
                                        :
                                        (checkName === true? 
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
                                <Grid item xs={12} md={12} sx={{ margin: 0.5 }}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel id="demo-simple-select-label">Category Parent</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={category.idParent}
                                            name="idParent"
                                            label="Category Parent"
                                            onChange={handleChange}
                                        >
                                            <MenuItem value={0}>None</MenuItem>
                                            {categories.map(cate =>
                                                <MenuItem value={cate.categotyId} key={cate.categotyId}>{cate.categotyName}</MenuItem>
                                            )}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={12} sx={{ margin: 0.5 }}>
                                    <Button className="btn-create-cate" variant="contained" disabled={check()} onClick={handleCreate}>Create</Button>
                                    <Button className="btn-back-cate" variant="contained" color="error"
                                        onClick={() => { navigate("/admin/categories") }} >Back</Button>
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

export default CreateCategory

