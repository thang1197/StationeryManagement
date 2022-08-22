import ProfileActionType from "./profile.type";


const INITIAL_STATE = {
  profile:
    {
      employeeId: "",
      employeeName: "",
      email: "",
      address: "",
      phone: "",
      gender: "",
      birthday: "",
      password: "",
      department: "",
      superiors: "",
      roleId: "",
      isAdmin: "",
      budget:"",
      createdAt:"",
  },
status: "loading",
};

const ProfileReducer = (state = INITIAL_STATE, action) => {
  switch(action.type){
      case ProfileActionType.GetProfileEmp:
          return {
              ...state,
              profile: action.payload,
              status: "done",
          }
      default:
          return {...state}
  }
}

export default ProfileReducer;
