import "./listemployees.scss"
import AdminNavbars from "../../../components/Admin/navbar/AdminNavbar";
import AdminSidebar from "../../../components/Admin/sidebar/AdminSidebar";
import DataEmployees from "../../../components/Admin/dataTable/employees/dataEmployees";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
const ListEmployees = () => {
  return (
    <div className="Emphome">
           <AdminSidebar id = {3}/>
           <div className="EmphomeContainer">
                <AdminNavbars title="List Employees"/>
                
                  <div className="btn-create-emp sm md"> 
                    <Link to="/admin/employees/create" style={{ textDecoration: "none" }}>           
                    <Button variant="outlined">Create</Button>
                    </Link>
                  </div>
                
                <DataEmployees/>    
           </div>
        </div>
  )
}

export default ListEmployees         