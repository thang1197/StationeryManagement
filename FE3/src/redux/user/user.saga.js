import { all, call, put, takeLatest } from "redux-saga/effects";
import api from "../../api/client";
import { signInFailure, signInProcessing, signInSuccess } from "./user.action";
import UserActionTypes from "./user.type";

/*
   Saga là một middleware :
      - Được config đẻ bắt action và có các xử lý tương ứng.
      - Dispatch các action vào store thông qua các function mà lib cung cấp.
*/

const callAPILogin = async (loginInfo) => {
  try {
    const res = api.post("/api/Login/Login", loginInfo.payload);
    return res;
  } catch (error) {
    throw new Error(error.message);
  }
};

export function* login(loginInfo) {
  try {
    yield put(signInProcessing());
    const res = yield call(callAPILogin, loginInfo);
    localStorage.setItem("name", res.data.employeeName)
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("refreshToken", res.data.refreshToken);
    yield put(signInSuccess(res.data));
  } catch (error) {
    yield put(signInFailure(error));
  }
}

// Khai báo hàm để bắt action dựa trên action type. dựa vào action type để có xử lý tương ứng.
export function* onSignInStart() {
  yield takeLatest(UserActionTypes.EMAIL_SIGN_IN_START, login);
}

// Call hàm bắt action
export function* userSaga() {
  yield all([call(onSignInStart)]);
}
