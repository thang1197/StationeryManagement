import OrderActionType from "./order.type" ;

export const GetAllOrder = (orders) => {
    return {
        type: OrderActionType.GetAllOrder,
        payload: orders
    }
}