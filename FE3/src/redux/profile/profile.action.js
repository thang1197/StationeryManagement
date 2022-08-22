import ProfileActionType from "./profile.type";

export const GetProfile = (profile) => ({
  type: ProfileActionType.GetProfileEmp,
  payload: profile,
});

