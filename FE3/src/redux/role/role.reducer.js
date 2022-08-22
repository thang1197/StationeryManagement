import RoleActionType from "./role.type";

const INITIAL_STATE = {
    roles: [{
        roleId: "",
        roleName: "",
    }],
    status: "loading",
}

const RoleReducer = (state = INITIAL_STATE, action) => {
    switch(action.type){
        case RoleActionType.ROLE_GET_ALL:
            return {
                ...state,
                roles: action.payload,
                status: "done"
            }
        default:
            return {...state}
    }
}

export default RoleReducer;