import { Alert, AlertTitle, Button, Dialog, DialogTitle } from "@mui/material";
import React, {useState} from "react";
import { useNavigate } from "react-router-dom";

const UpdateSuccessDialog = (props) => {


    return (
        <div>
        <Dialog open={props.success} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Alert severity="success" variant="filled" >
                <AlertTitle>Success</AlertTitle>
                Update Successfully <strong>check it out!</strong>
                </Alert>
            </DialogTitle>                            
            <Button variant="outlined" sx={{width: "250px", margin:"20px auto"}} color="success" onClick={()=>{window.location.reload()}}>OK</Button>
        </Dialog>
        </div>
    )
}

export default UpdateSuccessDialog