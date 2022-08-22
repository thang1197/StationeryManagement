import { combineReducers } from 'redux';
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import  CategoriesReducer from './category/category.reducer';
import EmployeeReducer from './epmloyee/employee.reducer';
import handleCart from './cart/cart.reducer';
import OrderReducer from './order/order.reducer';
import ProductReducer from './product/product.reducer';
import RoleReducer from './role/role.reducer';
import userReducer from './user/user.reducer';
import ProfileReducer from './profile/profile.reducer';
import OrderItemReducer from './orderItem/orderItem.reducer';
import NotificationReducer from './notification/notification.reducer';


const persistConfig = {
    key: "root",
    storage,
    whitelist: ["user","products","categories","employees","roles","cart","orders","profile","orderItem","notifications"],
  };
  
  const rootReducer = combineReducers({
    categories: CategoriesReducer,
    user: userReducer,
    products: ProductReducer,
    employees: EmployeeReducer,
    roles: RoleReducer,
    cart: handleCart,
    orders: OrderReducer,
    profile: ProfileReducer,
    orderItem: OrderItemReducer,
    notifications: NotificationReducer,
  });
  export default persistReducer(persistConfig, rootReducer);