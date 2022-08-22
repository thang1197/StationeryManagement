import { Alert, AlertTitle, Button, Dialog, DialogTitle } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const SuccessDialog = (props) => {

    const navigate = useNavigate();

    return (
        <div>
        <Dialog open={props.success} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Alert severity="success" variant="filled" >
                <AlertTitle>Success</AlertTitle>
                Updated Successfully <strong>check it out!</strong>
                </Alert>
            </DialogTitle>                            
            <Button variant="outlined" sx={{width: "250px", margin:"20px auto"}} color="success" onClick={()=>navigate("/admin/"+props.page)}>OK</Button>
        </Dialog>
        </div>
    )
}

export default SuccessDialog