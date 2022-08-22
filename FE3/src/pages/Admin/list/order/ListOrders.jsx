import "./listorders.scss"
import AdminSidebar from "../../../components/Admin/sidebar/AdminSidebar";
import AdminNavbars from "../../../components/Admin/navbar/AdminNavbar";
import DataOrders from "../../../components/Admin/dataTable/orders/dataOrders";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
const ListOrders = () => {
  return (
    <div className="Orderhome">
           <AdminSidebar id = {4}/>
           <div className="OrderhomeContainer">
                <AdminNavbars title="List Order"/>
                <DataOrders/>    
           </div>
        </div>
  )
}

export default ListOrders        