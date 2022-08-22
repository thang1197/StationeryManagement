import "./listcategories.scss"
import Datacategories from "../../../components/Admin/dataTable/categories/dataCategories";
import AdminNavbars from "../../../components/Admin/navbar/AdminNavbar";
import AdminSidebar from "../../../components/Admin/sidebar/AdminSidebar";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
const ListCategories = () => {
  return (
    <div className="Catehome">
      <AdminSidebar id={1} />
      <div className="CatehomeContainer">
        <AdminNavbars title="List Categories" />
        
          <div className="btn-create-cate sm md">
            <Link to="/admin/categories/create" style={{ textDecoration: "none" }}>
              <Button variant="outlined">Create</Button>
            </Link>
          </div>
        
        <Datacategories />
      </div>
    </div>
  )
}

export default ListCategories         