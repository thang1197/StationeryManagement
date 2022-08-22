import UserActionTypes from "./user.type";

/*
    Reducer bao gồm: 
      - Một state cụ thể nào đó cần lưu trong store (một state chung được combine từ nhiều state của nhiều reducer).
      - Nhận action: dựa vào action type, và data nhận vào từ action để thay đổi state cụ thể này.
*/
const INITIAL_STATE = {
  currentUser: {
    token: "",
    refreshToken: "",
    employeeName: "",
    employeeID: "",
    roles: [],
    isAdmin: false,
  },
  err: null,
  status: "",
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UserActionTypes.SIGN_IN_SUCCESS:
      return {
        ...state,
        currentUser: action.payload,
        status: UserActionTypes.SIGN_IN_SUCCESS,
      };
    case UserActionTypes.EMAIL_SIGN_IN_PROCESSING:
      return {
        ...state,
        status: UserActionTypes.EMAIL_SIGN_IN_PROCESSING,
      };
    case UserActionTypes.SIGN_IN_FAILURE:
      return {
        ...state,
        currentUser: INITIAL_STATE.currentUser,
        err: action.payload,
        status: UserActionTypes.SIGN_IN_FAILURE,
      };

    default:
      return state ;
  }
};
export default userReducer;
