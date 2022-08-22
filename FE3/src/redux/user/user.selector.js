import { createSelector } from "reselect";

// Khai báo funtion để lấy một state trong store.
// state.user là lấy state của user trong store. user chính là key được khai báo trong function combineReducers của file root-reducer.js
const selectUser = (state) => state.user;

// Tiếp tục lấy những thông tin cần lấy của state user. (User có thể có nhiều thông tin, nhưng chỉ cần lấy một thông tin cụ thể nào đó )
export const selectCurrentUser = createSelector(
  [selectUser],
  (user) => user.currentUser
);
export const selectLoginStatus = createSelector(
  [selectUser],
  (user) => user.status
);
