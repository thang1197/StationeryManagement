import React, { useEffect, useState } from "react";
import "./editproduct.scss";
import {
    Dialog,
    DialogTitle,
    TextField,
    Grid,
    Button,
    RadioGroup,
    FormLabel,
    MenuItem,
    FormControlLabel,
    InputLabel,
    Radio,
    FormControl,
    Select,
    Stack,
    FormHelperText,
    InputAdornment
} from "@mui/material";
import ErrorIcon from '@mui/icons-material/Error';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import http from "../../../../api/client";
import api from "../../../../api/api";
import { useDispatch, useSelector } from "react-redux";
import validate from "validate.js";
import { green } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import { ProductGetAll } from "../../../../redux/product/product.action";
import UpdateSuccessDialog from "../../../components/Admin/dialog/updateSuccess";

function EditProduct(props) {
    let navigate = useNavigate();
    const dispatch = useDispatch();
    const [checkName, setCheckName] = useState(false);
    const [success, setSuccess] = useState(false);
    //Selector category
    const category = useSelector((state) => state.categories.categories);
    //Selector category
    const rol = useSelector((state) => state.roles.roles);
     //Selector products
     const products = useSelector((state) => state.products.products);

    //#region Tao product state de update
    const date = new Date();

    const [product, setProduct] = useState({
        ProductId: props.item.id,
        ProductName: props.item.name,
        Quantity: props.item.quantity,
        Price: props.item.price,
        CategoryId: props.item.cateId,
        ProductEnable: props.item.status,
        RoleId: props.item.roleId,
        CreateAt: props.item.CreateAt,
        UpdatedAt: date,
        FeatureImgPath: props.item.featureImgPath,
        images: "",
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
            ProductName: {
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
            Quantity: {
                presence: { allowEmpty: false, message: "^Quantity is required" },
                numericality: {
                    onlyInteger: false,
                    greaterThan: 0,
                    lessThanOrEqualTo: 1000,
                    message: "^Quantity must be > 0 < 1000",
                },
            },
            Price: {
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
        if (product.ProductName !== props.item.name ) {
            let proname = products.find(e => e.productName === product.ProductName);
            if (proname === undefined) {
                setCheckName(false);
            } else {
                setCheckName(true);
            }
        }
        check();
    }, [product.ProductName, validation])
    const check = () => {
        if (validation.isvalid === false) {
            return true;
        } else if (checkName === true) {
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

    //#region  api update product
    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    };

    let formData = new FormData();
    const obj = {
        productId: product.ProductId,
        productName: product.ProductName,
        quantity: product.Quantity,
        price: product.Price,
        featureImgPath: product.FeatureImgPath,
        categoryId: product.CategoryId,
        productEnable: product.ProductEnable,
        roleId: product.RoleId,
        createdAt: product.CreateAt,
        updatedAt: product.UpdatedAt,
    }

    formData.append("productJson", JSON.stringify(obj));
    formData.append("files", product.images);
    //#endregion

    //#region Hame handle
    const handleEdit = async () => {
        try {
            await http.put(api.EditProduct, formData, config);
            setSuccess(true);
        } catch (err) {
            navigate("/")
        }  
    }
    //Call API GetAllProduct
    const getAllProduct = async () => {
        const res = await http.get(api.GetAllProduct);
        dispatch(ProductGetAll(res.data))
    }
    

    const [isOpen, setOpenDialog] = useState(false);

    const handleOpen = () => {
        setOpenDialog(true)
    }

    const handleClose = () => {
        setProduct((preItem) => ({
            ...preItem,
            ProductId: props.item.id,
            ProductName: props.item.name,
            Quantity: props.item.quantity,
            Price: props.item.price,
            CategoryId: props.item.cateId,
            ProductEnable: props.item.status,
            RoleId: props.item.roleId,
            UpdatedAt: date,
            images: "",
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
                <DialogTitle textAlign="center">Edit Product</DialogTitle>
                <Grid
                    container
                    p={4}
                    spacing={2}
                >
                    {/* product id */}
                    <Grid item md={4}>
                        <TextField label="Product ID" variant="outlined" className="InputField" fullWidth
                            defaultValue={product.ProductId} name="ProductId" inputProps={{ readOnly: true }} disabled></TextField>
                    </Grid>

                    {/* product name */}
                    <Grid item md={4}>
                        <TextField
                            fullWidth
                            className="InputField"
                            label="Product Name"
                            id="outlined-start-adornment"
                            InputProps={{
                                startAdornment: <InputAdornment position="start">
                                    {hasError("ProductName") ?

                                        <CloseIcon className="icon-close" fontSize="medium" style={{ color: 'red' }} />
                                        :
                                        <CheckIcon className="icon-check" fontSize="medium" style={{ color: green[500] }} />
                                    }
                                </InputAdornment>,
                            }}
                            value={product.ProductName}
                            error={hasError("productName")}
                            name="ProductName"
                            placeholder="Product Name"
                            onChange={handleChange}
                        />
                        {hasError("ProductName") ?
                            (
                                <FormHelperText id="outlined-weight-helper-text" className="text">
                                    <ErrorIcon fontSize="small" />
                                    {validation.errors.ProductName[0]}
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
                    <Grid item md={4}>
                        <TextField
                            fullWidth
                            label="Quantity"
                            id="outlined-start-adornment"
                            InputProps={{
                                startAdornment: <InputAdornment position="start">
                                    {hasError("Quantity") ?

                                        <CloseIcon className="icon-close" fontSize="medium" style={{ color: 'red' }} />
                                        :
                                        <CheckIcon className="icon-check" fontSize="medium" style={{ color: green[500] }} />
                                    }
                                </InputAdornment>,
                            }}
                            value={product.Quantity}
                            type="number"
                            error={hasError("Quantity")}
                            name="Quantity"
                            onChange={handleChange}
                            placeholder="0"
                        />
                        {hasError("Quantity") ?
                            (
                                <FormHelperText id="outlined-weight-helper-text" className="text">
                                    <ErrorIcon fontSize="small" />
                                    {validation.errors.Quantity[0]}
                                </FormHelperText>
                            )
                            :
                            null
                        }
                    </Grid>

                    {/* price */}
                    <Grid item md={4}>
                        <TextField
                            fullWidth
                            label="Price"
                            id="outlined-start-adornment"
                            InputProps={{
                                startAdornment: <InputAdornment position="start">
                                    {hasError("Price") ?

                                        <CloseIcon className="icon-close" fontSize="medium" style={{ color: 'red' }} />
                                        :
                                        <CheckIcon className="icon-check" fontSize="medium" style={{ color: green[500] }} />
                                    }
                                </InputAdornment>,
                            }}
                            value={product.Price}
                            error={hasError("Price")}
                            type="number"
                            name="Price"
                            onChange={handleChange}
                        />
                        {hasError("Price") ?
                            (
                                <FormHelperText className="text">
                                    <ErrorIcon fontSize="small" />
                                    {validation.errors.Price[0]}
                                </FormHelperText>
                            )
                            :
                            null
                        }
                    </Grid>
                    {/* status */}
                    <Grid item md={4}>
                        <FormLabel id="demo-controlled-radio-buttons-group">Status</FormLabel>
                        <RadioGroup
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            defaultValue={props.item.status}
                            onChange={handleChange}
                            row
                            name="ProductEnable"
                        >
                            <FormControlLabel value={true} control={<Radio />} label="True" />
                            <FormControlLabel value={false} control={<Radio />} label="False" />
                        </RadioGroup>
                    </Grid>

                    {/* category */}
                    <Grid item md={4}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Category</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={product.CategoryId}
                                label="Category"
                                name="CategoryId"
                                onChange={handleChange}
                            >
                                {category.map((item) =>
                                    <MenuItem value={item.categotyId} key={item.categotyId}>{item.categotyName}</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Role */}
                    <Grid item md={4}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Role</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={product.RoleId}
                                label="Role"
                                name="RoleId"
                                onChange={handleChange}
                            >
                                {rol.map((item) =>
                                    <MenuItem value={item.roleId} key={item.roleId}>{item.roleName}</MenuItem>
                                )}
                            </Select>
                        </FormControl>
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
                        <img src={product.images ? URL.createObjectURL(product.images) : props.item.productImage} alt="" />
                    </Grid>

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

export default EditProduct;