
import "./listproduct.scss"
import DataProduct from "../../../components/Admin/dataTable/product/dataProduct";
import AdminSidebar from "../../../components/Admin/sidebar/AdminSidebar";
import AdminNavbars from "../../../components/Admin/navbar/AdminNavbar";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const ListProduct = () => {
  return (
    <div className="Prohome">
           <AdminSidebar id = {2}/>
           <div className="ProhomeContainer">
                <AdminNavbars title="List Product"/>
                
                  <div className="btn-create-pro sm md">
                  <Link to="/admin/products/create" style={{ textDecoration: "none" }}>
                  <Button variant="outlined">Create</Button>
                  </Link>
                  </div>
                
                <DataProduct/>    
           </div>
        </div>
  )
}

export default ListProduct         