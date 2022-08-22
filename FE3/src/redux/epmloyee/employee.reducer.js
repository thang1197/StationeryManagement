import EmployeeActionType from "./employee.type";

const INITIAL_STATE = {
    employees: [{
        employeeId: "",
        employeeName: "",
        email: "",
        address: "",
        phone: "",
        gender: "",
        birthday: "",
        password: "",
        department: "",
        superiors: "",
        roleId: "",
        isAdmin: "",
        budget:""
    }],
    status: "loading",
}

const EmployeeReducer = (state = INITIAL_STATE, action) => {
    switch(action.type){
        case EmployeeActionType.GetAllEmployee:
            return {
                ...state,
                employees: action.payload,
                status: "done",
            }
        default:
            return {...state}
    }
}

export default EmployeeReducer;