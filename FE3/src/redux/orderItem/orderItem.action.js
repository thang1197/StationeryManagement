import OrderItemActionType from "./orderItem.type" ;

export const GetAllOrderItem = (orderItems) => {
    return {
        type: OrderItemActionType.GetAllOrderItem,
        payload: orderItems
    }
}