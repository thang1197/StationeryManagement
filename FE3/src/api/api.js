const api = {
    GetAllCategory: "api/Categories/Categories",
    CreateCategory: "api/Categories/CreateCategory",
    EditCategory: "api/Categories/UpdateCategory",
    DeleteCategory: "api/Categories/CategoryId?id=",

    GetAllProduct: "api/Products/Products",
    EditProduct: "api/Products/UpdateProduct",
    DeleteProduct: "api/Products/ProductId?id=",
    CreateProduct: "api/Products/CreateProduct",

    GetAllEmployee: "api/Employees/Employees",
    CreateEmployee: "api/Employees/CreateEmployee",
    DeleteEmployee: "api/Employees/EmployeeId?id=",
    EditEmployee: "/api/Employees/UpdateEmployee",

    GetAllRoles: "api/Roles/Roles",
    EditRoles: "api/Roles/UpdateRole",
    DeleteRole: "api/Roles/RoleId?id=",
    CreateRole: "api/Roles/CreateRole",
    setBudget: "/api/Roles/SetUpBudget",

    CreateOrderDetails: "api/OrderItems/CreateOrderItem",
    GetAllOrder: "api/Orders/Orders",
    DeleteOrder: "api/Orders/OrderId?id=",
    EditOrder : "api/Orders/UpdateOrder",

    GetProfileByIdEmp: "api/Employees/Employee?id=",

    GetAllOrderItem: "api/OrderItems/OrderItems",

    ChekPass: "api/Employees/ChangePassword",

    GetAllNotifications: "api/Notifications/Notifications",
    DeleteNotifications: "api/Notifications/NotificationId?id="
}

export default api;