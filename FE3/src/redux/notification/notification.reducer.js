import NotificationActionType from "./notification.type";

const INITIAL_STATE = {
    notifications: []
}

const NotificationReducer = (state = INITIAL_STATE, action) => {
    switch(action.type){
        case NotificationActionType.GetAllNotifications:
            return {
                ...state,
                notifications: [...action.payload]
            }
        default:
            return {...state}
    }
}

export default NotificationReducer;