import EmployeeActionType from "./employee.type";

export const GetAllEmployee = (employees) => {
    return {
        type: EmployeeActionType.GetAllEmployee,
        payload: employees
    }
}