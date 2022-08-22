import UserActionTypes from "./user.type";

export const signInStart = (loginInfo) => ({
  type: UserActionTypes.EMAIL_SIGN_IN_START,
  payload: loginInfo,
});
export const signInProcessing = () => ({
  type: UserActionTypes.EMAIL_SIGN_IN_PROCESSING,
  payload: "",
});

export const signInSuccess = (userInfo) => ({
  type: UserActionTypes.SIGN_IN_SUCCESS,
  payload: userInfo,
});

export const signInFailure = (err) => ({
  type: UserActionTypes.SIGN_IN_FAILURE,
  payload: err,
});
