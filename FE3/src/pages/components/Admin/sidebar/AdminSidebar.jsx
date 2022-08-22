import React from "react";
import { SidebarData } from "../../../Data/Data";
import LogoutIcon from "@mui/icons-material/Logout";
import "./adminsidebar.scss";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "bootstrap";
const AdminSidebar = (prop) => {
    const user = useSelector((state) => state.user.currentUser);
    return (
        <div className="Adminsidebar">
            <div className="top">
                <span className="logo">Admin</span>
            </div>
            <div className="center">

                {SidebarData.map((item, index) => {
                    return (      
                        item.role.map((role=>
                            role.id === user.userRoles ?
                            <Link to={item.link} style={{ textDecoration: "none" }} key={index}>
                            <div className={index === prop.id ? "menuItem active" : "menuItem"}
                            >
                                <div className="icon">
                                    <item.icon />
                                </div>
                                <span>{item.heading}</span>
                            </div>
                            </Link>
                            :
                            null             
                        ))
                       
                    );
                })}

                <div className="menuItem">
                    <Link to={"/"} style={{ textDecoration: "none" }} >
                        <div className="icon">
                            <LogoutIcon />  <span >Logout</span>
                        </div>           
                    </Link>
                </div>
            </div>
            <div className="bottom">
                <div className="colorOption"></div>
                <div className="colorOption"></div>
                <div className="colorOption"></div>
            </div>
        </div>
    )
}

export default AdminSidebar