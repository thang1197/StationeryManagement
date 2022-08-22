import { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    TextField,
    Grid,
    Button,
    Stack,
} from "@mui/material";
import api from "../../../../api/api";
import http from "../../../../api/client";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import UpdateSuccessDialog from "../../../components/Admin/dialog/updateSuccess";
import { GetProfile } from "../../../../redux/profile/profile.action";
import { GetAllOrderItem } from "../../../../redux/orderItem/orderItem.action";


function EditOrder(props) {
    let navigate = useNavigate();
    const dispatch = useDispatch();
    const [success, setSuccess] = useState(false);
    const [isOpen, setOpenDialog] = useState(false);
    const [total, setTotal] = useState(0);
    const getProfile = async () => {
        const resEmp = await http.get(api.GetProfileByIdEmp + props.orders.empId);
        dispatch(GetProfile(resEmp.data));
    }
    const getOrderItem = async () => {
        const resEmp = await http.get(api.GetAllOrderItem);
        dispatch(GetAllOrderItem(resEmp.data));
    }
    useEffect(() => {
        getProfile();
        getOrderItem();
    }, [])

    const profiles = useSelector((state) => state.profile.profile);
    const orderItem = useSelector((state) => state.orderItem.orderItem);
    const orItem = orderItem.find(e => e.orderId === props.orders.id)

    const date = new Date();
    const [order, setOrder] = useState({
        orderId: props.orders.id,
        employeeId: props.orders.empId,
        status: props.orders.status,
        createdAt: props.orders.create,
        updatedAt: date.toISOString(),
    });

    const handleChange = (event) => {
        setOrder((preState) => ({
            ...preState,
            [event.target.name]:
                event.target.type === "checkbox"
                    ? event.target.checked
                    : event.target.value,
        }));
    };
    //#endregion

    const handleApproved = async () => {
         await http.put(api.EditOrder, {...order, status: props.statusApp});
         setSuccess(true);
    }

    const handleRejected = async () => {
        await http.put(api.EditOrder, {...order, status: props.statusRee});
        setSuccess(true);
    }


    const handleOpen = () => {
        setOpenDialog(true)
    }

    const handleClose = () => {
        setOrder((preCate) => ({
            ...preCate,
        }))
        setOpenDialog(false)
    }
    return (
        <div>
            <Button className="editButton" variant="outlined" onClick={handleOpen}>Updates Status</Button>
            {success === true ?
                <UpdateSuccessDialog success={true} />
                :
                <Dialog open={isOpen} maxWidth="sm" fullWidth>
                    <DialogTitle textAlign="center">Update Status</DialogTitle>
                    <Grid
                        container
                        p={4}
                        spacing={2}
                    >
                        <Grid item md={12}>
                            <TextField label="ORDER ID" variant="outlined" className="InputField" fullWidth defaultValue={order.orderId} InputProps={{ readOnly: true }} />
                        </Grid>
                        <Grid item md={12}>
                            <TextField label="EMPLOYEE ID" variant="outlined" className="InputField" fullWidth defaultValue={profiles.employeeId} InputProps={{ readOnly: true }} />
                        </Grid>
                        <Grid item md={12}>
                            <TextField label="EMPLOYEE NAME" variant="outlined" className="InputField" fullWidth defaultValue={profiles.employeeName} InputProps={{ readOnly: true }} />
                        </Grid>

                        <Grid container item md={12} direction="row" justifyContent="center" alignItems="center">
                            <Stack direction="row" spacing={2}>
                                <Button variant="contained" color="success" sx={{ width: "100px" }} onClick={handleApproved}>Approved</Button>
                                <Button variant="contained" color="error" sx={{ width: "100px" }} onClick={handleRejected}>Rejected</Button>
                                <Button variant="outlined" sx={{ width: "100px" }} onClick={handleClose}>Cancle</Button>
                            </Stack>
                        </Grid>

                    </Grid>
                </Dialog>
            }
        </div>
    )
}

export default EditOrder;