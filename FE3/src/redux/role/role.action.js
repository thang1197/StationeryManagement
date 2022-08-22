import RoleActionType from "./role.type";

export const RoleGetAll = (roles) => {
    return {
        type: RoleActionType.ROLE_GET_ALL,
        payload: roles
    }
}

