import OrderActionType from "./order.type";

const INITIAL_STATE = {
  orders: [
    {
      orderId: 0,
      employeeId: "",
      status: "",
      createdAt: "",
    },
  ],
  status: "loading",
};

const OrderReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case OrderActionType.GetAllOrder:
      return {
        ...state,
        orders: [...action.payload],
        status: "done",
      };
    default:
      return { ...state };
  }
};

export default OrderReducer
