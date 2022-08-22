import React from 'react'
import './Navbar.scss';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { GetAllNotifications } from "../../../../redux/notification/notification.action";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import Popover from '@mui/material/Popover';
import Badge from '@mui/material/Badge';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LogoutIcon from '@mui/icons-material/Logout';
import http from "../../../../api/client";
import api from "../../../../api/api";
const UserNavbars = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;


  //Call API
  const dispatch = useDispatch()

  const getAllNotifications = async() => {
      const res = await http.get(api.GetAllNotifications);
      dispatch(GetAllNotifications(res.data))
  }

  useEffect(() => {
      getAllNotifications()
  }, [])

  //Selector
  const noties = useSelector(state => state.notifications.notifications)
  const user = useSelector((state)=>state.user);
  
  let notifications = [];


  if(noties.length != 0){
    notifications = noties.filter(noti => noti.receiveId === user.currentUser.employeeID)
  }

  const hanldeDeleteNoti = async(id) => {
    await http.delete(api.DeleteNotifications+id)
    getAllNotifications()
  }
  const state = useSelector((state)=> state.cart)
  
  const handleLogOut = () =>{
      localStorage.clear();
      window.location.reload();
  }
  const navigate = useNavigate();
  return (
    <Navbar className="navbar" collapseOnSelect expand="lg" bg="light" variant="light">
      <Container className="con" px={3} md={2}>
        <Navbar.Brand onClick={()=>navigate("/")}>Stationery</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto" mb={2} mb-lg={0} ms-lg={4}>
            <Nav.Link onClick={()=>navigate("/")}>Home</Nav.Link>
          </Nav>
          <Nav>
            
              <Button  className="me-2 btn-shopping-cart" type="submit" onClick={()=>{navigate("/cart")}}>
               <ShoppingCartIcon fontSize="small"/>
               <div className="title">
                  Cart
               </div>
               <span className="quantity" ms={1}>{state.length}</span>
              </Button>
              <div className='notifi'>
                  <Badge color="error" badgeContent={notifications.length} onClick={handleClick} className="notiIcon">
                    <NotificationsNoneOutlinedIcon className="icon" />
                  </Badge>           
              </div>  
                <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                >
                   {notifications.map(item => {
                    return (
                      <div key={item.id} className="notifiItem">
                        <Typography>{item.message}</Typography>
                        <Button variant="contained" size="small" sx={{width: "150px"}} onClick={()=>{hanldeDeleteNoti(item.id)}}>Mark as read</Button>
                      </div>
                    )
                   })}
                </Popover>
            
            <NavDropdown title={user.currentUser.employeeName} id="collasible-nav-dropdown">
              <NavDropdown.Item  onClick={()=>navigate("/admin")}>
              <AdminPanelSettingsIcon fontSize="medium"/> Admin
              </NavDropdown.Item>
              <NavDropdown.Item onClick={()=>navigate("/profile")}>
               <AccountBoxIcon fontSize="medium"/> Profile
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogOut}>
                <LogoutIcon fontSize="medium"/> Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
export default UserNavbars;