import AdminNavbars from "../../../components/Admin/navbar/AdminNavbar";
import AdminSidebar from "../../../components/Admin/sidebar/AdminSidebar";
import "./createproducts.scss"
import http from "../../../../api/client";
import api from "../../../../api/api";
import ErrorIcon from '@mui/icons-material/Error';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { RoleGetAll } from "../../../../redux/role/role.action";
import { useEffect, useState } from 'react';
import { ProductGetAll } from "../../../../redux/product/product.action";
import { Box, Button, Container, FormControl, FormControlLabel, FormHelperText, FormLabel, Grid, InputAdornment, InputLabel, MenuItem, Paper, Radio, RadioGroup, Select, Stack, TextField } from "@mui/material";
import { useNavigate } from "react-router";
import { green } from "@mui/material/colors";
import validate from "validate.js";
import { useDispatch, useSelector } from "react-redux";
import SuccessDialog from "../../../components/Admin/dialog/createSuccess";

const CreateProduct = () => {
    const [checkName, setCheckName] = useState(false);
    const [cate, setCate] = useState(false);
    const [img, setImg] = useState(false);
    const [role, setRole] = useState(false);
    let navigate = useNavigate();
    const dispatch = useDispatch();
    const [success, setSuccess] = useState(false);

    const date = new Date();
    const [product, setProduct] = useState({
        productName: "",
        quantity: 0,
        price: 0,
        categoryId: 0,
        ProductEnable: true,
        roleId: 0,
        createdAt: date,
        images: "",
    })

    //#region  Validation
    const [validation, setValidation] = useState({
        touched: {},
        errors: {},
        isvalid: false,
    });
    useEffect(() => {
        const schema = {
            productName: {
                presence: {
                    allowEmpty: false,
                    message: "^Product's name is required",
                },
                length: {
                    maximum: 50,
                    minimum: 5,
                    message: "^Product name must be from 5 to 50 characters",
                },
            },
            quantity: {
                presence: { allowEmpty: false, message: "^Quantity is required" },
                numericality: {
                    onlyInteger: false,
                    greaterThan: 0,
                    lessThanOrEqualTo: 1000,
                    message: "^quantity must be > 0 < 1000",
                },
            },
            price: {
                presence: { allowEmpty: false, message: "^Price is required" },
                numericality: {
                    onlyInteger: false,
                    greaterThan: 1000,
                    lessThanOrEqualTo: 100000000,
                    message: "^Price must be > 1000 < 100000000",
                },
            },
        };
        const errors = validate.validate(product, schema);
        setValidation((pre) => ({
            ...pre,
            isvalid: errors ? false : true,
            errors: errors || {},
        }));

    }, [product]);
    useEffect(() => {
        let proempname = products.find(e => e.productName === product.productName);
        if (proempname === undefined) {
            setCheckName(false);
        } else {
            setCheckName(true);
        }
        if (product.categoryId !== 0) {
            setCate(false);
        } else {
            setCate(true);
        }

        if (product.images !== "") {
            setImg(false);
        } else {
            setImg(true);
        }

        if (product.roleId !== 0) {
            setRole(false);
        } else {
            setRole(true);
        }
        check();
    }, [product.categoryId, product.images, product.roleId, validation])
    const check = () => {
        if (validation.isvalid === false) {
            return true;
        } else if (checkName === true) {
            return true;
        } else if (product.categoryId === 0) {
            return true;
        } else if (product.roleId === 0) {
            return true;
        } else if (product.images === "") {
            return true;
        }
        return false;
    }
    //#endregion 

    //#region set values and validation
    const handleChange = (event) => {
        setProduct((preState) => ({
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

    const handleImg = (event) => {
        setProduct(prePro => ({
            ...prePro,
            images: event.target.files[0]
        }))
    }

    const hasError = (field) => {
        return validation.touched[field] && validation.errors[field] ? true : false;
    };
    //#endregion

    //#region  api categories
    const categories = useSelector((state) => state.categories.categories);
    //#endregion

    //#region  api 
    const getAllProduct = async () => {
        const res = await http.get(api.GetAllProduct);
        dispatch(ProductGetAll(res.data))
    }
    const getAllRole = async () => {
        const resRoles = await http.get(api.GetAllRoles);
        dispatch(RoleGetAll(resRoles.data));
    }
    useEffect(() => {
        getAllProduct();
        getAllRole();
    }, [])
    const products = useSelector((state) => state.products.products);
    const roles = useSelector((state) => state.roles.roles);
    //#endregion

    //#region  api create product
    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    };

    let formData = new FormData();
    const obj = {
        productName: product.productName,
        quantity: product.quantity,
        price: product.price,
        categoryId: product.categoryId,
        productEnable: product.ProductEnable,
        roleId: product.roleId,
        createdAt: product.createdAt,
    }
    formData.append("productJson", JSON.stringify(obj));
    formData.append("files", product.images);
    //#endregion

    const handleSubmit = async () => {
        try {
            await http.post(api.CreateProduct, formData, config);
            setSuccess(true);
        } catch (err) {
            navigate("/")
        }
    }

    return (
        <div className="ProCrhome">
            <AdminSidebar id={2} />
            <div className="ProCrhomeContainer">
                <AdminNavbars title="Create Product" />
                <div className="create-proCr sm md">
                    <Container>
                        {success === true ?
                            <SuccessDialog page="products" success={true} />
                            :
                            <Paper>
                                <Grid container spacing={2}>
                                    {/* productName  */}
                                    <Grid item xs={12} md={12} sx={{ margin: 0.5 }}>
                                        <TextField
                                            fullWidth size="small"
                                            label="Product Name"
                                            id="outlined-start-adornment"
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">
                                                    {hasError("productName") ?

                                                        <CloseIcon className="icon-close" fontSize="medium" style={{ color: 'red' }} />
                                                        :
                                                        <CheckIcon className="icon-check" fontSize="medium" style={{ color: green[500] }} />
                                                    }
                                                </InputAdornment>,
                                            }}
                                            error={hasError("productName")}
                                            name="productName"
                                            placeholder="Product Name"
                                            onChange={handleChange}
                                        />
                                        {hasError("productName") ?
                                            (
                                                <FormHelperText id="outlined-weight-helper-text" className="text">
                                                    <ErrorIcon fontSize="small" />
                                                    {validation.errors.productName[0]}
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


                                    {/* quantity */}
                                    <Grid item xs={12} md={12} sx={{ margin: 0.5 }}>
                                        <TextField
                                            fullWidth size="small"
                                            label="Quantity"
                                            id="outlined-start-adornment"
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">
                                                    {hasError("quantity") ?

                                                        <CloseIcon className="icon-close" fontSize="medium" style={{ color: 'red' }} />
                                                        :
                                                        <CheckIcon className="icon-check" fontSize="medium" style={{ color: green[500] }} />
                                                    }
                                                </InputAdornment>,
                                            }}
                                            type="number"
                                            error={hasError("quantity")}
                                            name="quantity"
                                            onChange={handleChange}
                                            placeholder="0"
                                        />
                                        {hasError("quantity") ?
                                            (
                                                <FormHelperText id="outlined-weight-helper-text" className="text">
                                                    <ErrorIcon fontSize="small" />
                                                    {validation.errors.quantity[0]}
                                                </FormHelperText>
                                            )
                                            :
                                            null
                                        }
                                    </Grid>

                                    {/* price */}
                                    <Grid item xs={12} md={12} sx={{ margin: 0.5 }}>
                                        <TextField
                                            fullWidth size="small"
                                            label="Price"
                                            id="outlined-start-adornment"
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">
                                                    {hasError("price") ?

                                                        <CloseIcon className="icon-close" fontSize="medium" style={{ color: 'red' }} />
                                                        :
                                                        <CheckIcon className="icon-check" fontSize="medium" style={{ color: green[500] }} />
                                                    }
                                                </InputAdornment>,
                                            }}
                                            error={hasError("price")}
                                            type="number"
                                            name="price"
                                            onChange={handleChange}
                                        />
                                        {hasError("price") ?
                                            (
                                                <FormHelperText className="text">
                                                    <ErrorIcon fontSize="small" />
                                                    {validation.errors.price[0]}
                                                </FormHelperText>

                                            )
                                            :
                                            null
                                        }
                                    </Grid>

                                    {/* categories */}
                                    <Grid item xs={12} md={12} sx={{ margin: 0.5 }}>
                                        <Box sx={{ minWidth: 120 }}>
                                            <FormControl fullWidth fontSize="small">
                                                <InputLabel id="demo-simple-select-label" error={cate === true}>Category</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={product.categoryId}
                                                    label="Category"
                                                    name="categoryId"
                                                    error={cate === true}
                                                    onChange={handleChange}
                                                >
                                                    {categories.map(categories => (
                                                        <MenuItem key={categories.categotyId} value={categories.categotyId}>{categories.categotyName}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            {cate === true ?
                                                (
                                                    <FormHelperText className="text">
                                                        <ErrorIcon fontSize="small" />
                                                        categories can not blank
                                                    </FormHelperText>
                                                )
                                                :
                                                null
                                            }
                                        </Box>
                                    </Grid>

                                    {/* Roles */}
                                    <Grid item xs={12} md={12} sx={{ margin: 0.5 }}>
                                        <Box sx={{ minWidth: 120 }}>
                                            <FormControl fullWidth fontSize="small">
                                                <InputLabel id="demo-simple-select-label" error={role === true}>Roles</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={product.roleId}
                                                    label="Roles"
                                                    name="roleId"
                                                    error={role === true}
                                                    onChange={handleChange}
                                                >
                                                    {roles.map(roles => (
                                                        <MenuItem key={roles.roleId} value={roles.roleId}>{roles.roleName}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
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
                                        </Box>
                                    </Grid>


                                    {/* upload image */}
                                    <Grid item xs={12} md={12} sx={{ margin: 0.5 }} >
                                        <Stack direction="row" spacing={2} >
                                            <Button variant="contained" component="label" >
                                                Upload Images
                                                <input hidden accept="image/*" id="file" name="images" type="file" onChange={handleImg} />
                                            </Button>
                                        </Stack>
                                    </Grid>

                                    <Grid item xs={12} md={12} sx={{ margin: 0.5 }} className="image">
                                        <img src={product.images ? URL.createObjectURL(product.images) : require('../../../../assets/images/no-image-icon-0.jpg')} alt="" />
                                        {img === true ?
                                            (
                                                <FormHelperText className="text">
                                                    <ErrorIcon fontSize="small" />
                                                    image can not blank
                                                </FormHelperText>
                                            )
                                            :
                                            null
                                        }
                                    </Grid>

                                    <Grid item xs={12} md={12} sx={{ margin: 0.5 }}>
                                        <FormControl>
                                            <FormLabel id="demo-controlled-radio-buttons-group">Product Status</FormLabel>
                                            <RadioGroup
                                                aria-labelledby="demo-controlled-radio-buttons-group"
                                                name="ProductEnable"
                                                value={product.ProductEnable}
                                                onChange={handleChange}>
                                                <FormControlLabel value={true} control={<Radio />} label="Turn on" />
                                                <FormControlLabel value={false} control={<Radio />} label="Turn off" />
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} md={12} sx={{ margin: 0.5 }} >
                                        <Button className="btn-create-pro" variant="contained" onClick={handleSubmit} disabled={check()}
                                        >Create</Button>
                                        <Button className="btn-back-pro" variant="contained" color="error"
                                            onClick={() => { navigate("/admin/products") }} >Back</Button>
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

export default CreateProduct