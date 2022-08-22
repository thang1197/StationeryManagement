import { Button, Container, FormHelperText, Grid, Paper, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { signInStart } from "./../../../redux/user/user.action";
import { createStructuredSelector } from "reselect";
import LinearProgress from "@mui/material/LinearProgress";
import {
  selectCurrentUser,
  selectLoginStatus,
} from "./../../../redux/user/user.selector";
import UserActionTypes from "./../../../redux/user/user.type";
import ErrorIcon from '@mui/icons-material/Error';
import { useNavigate } from "react-router-dom";

const Login = ({ user, login, status }) => {
  let navigate = useNavigate();
  const [userLogin, setUserLogin] = useState({
    employeeID: "",
    password: "",
  });
  
  // Tạo hàm xử lý input của người dùng. khi người dùng input thì cập nhật lại state cục bộ đã khai ở trên.
  const handleChange = (event) => {
    setUserLogin((preState) => ({
      ...preState,
      [event.target.name]:
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value,
    }));
  };
  // Tạo hàm xử lý khi user nhấn nút login.
  const handleLogin = () => {
    // login chỗ này chính là prop ở trên. khi call login này thì chính là
    try{
      login(userLogin);
    } catch (err) {
      navigate("/")
    }
  };


  return (
    <Container>
      <Paper sx={{ padding: "20px" }} elevation={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Typography align="center" variant="h3">
              Login
            </Typography>
          </Grid>
            {status === UserActionTypes.SIGN_IN_FAILURE ?
              (<Grid item xs={12} md={12}>
                <FormHelperText id="outlined-weight-helper-text" style={{color: "red"}}>
                  <ErrorIcon fontSize="large" style={{color: "red"}} />
                  User or password incorrect !
                </FormHelperText>
              </Grid>) : null}
            <Grid item md={12} xs={12}>
              <TextField
                label="User Name"
                fullWidth
                size="small"
                color="primary"
                name="employeeID"
                value={userLogin.employeeID}
                onChange={handleChange}
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <TextField
                label="Password"
                type="password"
                fullWidth
                size="small"
                color="secondary"
                variant="outlined"
                name="password"
                value={userLogin.password}
                onChange={handleChange}
              ></TextField>
            </Grid>
            <Grid item md={12} xs={12}>
              <Button
                variant="contained"
                sx={{ marginRight: "10px" }}
                disabled={status === UserActionTypes.EMAIL_SIGN_IN_PROCESSING}
                onClick={handleLogin}
              >
                Login
              </Button>
            </Grid>
            {status === UserActionTypes.EMAIL_SIGN_IN_PROCESSING ? (
              <Grid item md={12} xs={12}>
                <LinearProgress />
              </Grid>
            ) : null}
          </Grid>
      </Paper>
    </Container>
  );
};


const mapStateToProp = createStructuredSelector({
  user: selectCurrentUser,
  status: selectLoginStatus,
});

const mapDispatchToProp = (dispatch) => ({
  login: (loginInfo) => dispatch(signInStart(loginInfo)),
});
export default connect(mapStateToProp, mapDispatchToProp)(Login);
