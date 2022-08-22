//Sidebar
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import StoreIcon from "@mui/icons-material/Store";
import ListAltIcon from "@mui/icons-material/ListAlt";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import CategoryIcon from "@mui/icons-material/Category";
export const SidebarData = [
    {
      icon: DashboardIcon,
      heading: "Dashboard",
      link: "/admin",
      role: [{id:1},{id:2},{id:5}]
    },
    {
      icon: CategoryIcon,
      heading: "Categories",
      link: "/admin/categories",
      role: [{id:1}],
    },
    {
      icon: StoreIcon,
      heading: "Products",
      link: "/admin/products",
      role: [{id:1},{id:5}],
    },
    {
      icon: PersonIcon,
      heading: "Employees",
      link: "/admin/employees",
      role: [{id:1},{id:2},{id:5}],
    },
    {
      icon: ListAltIcon,
      heading: "Orders",
      link: "/admin/orders",
      role: [{id:1},{id:2},{id:5}],
    },
    {
      icon: HowToRegIcon,
      heading: "Roles",
      link: "/admin/roles",
      role: [{id:1}],
    },
];
  
