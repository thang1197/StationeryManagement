import NotificationActionType from "./notification.type";

export const GetAllNotifications = (noti) => {
    return {
        type: NotificationActionType.GetAllNotifications,
        payload: noti
    }
}