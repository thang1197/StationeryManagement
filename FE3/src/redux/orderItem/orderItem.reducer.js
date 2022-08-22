import OrderItemActionType from "./orderItem.type";

const INITIAL_STATE = {
  orderItem: [
    {
      orderItemId:0,
      orderId: 0,
      productId: 0,
      quantity: 0,
    },
  ],
  status: "loading",
};

const OrderItemReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case OrderItemActionType.GetAllOrderItem:
      return {
        ...state,
        orderItem: [...action.payload],
        status: "done",
      };
    default:
      return { ...state };
  }
};

export default OrderItemReducer
