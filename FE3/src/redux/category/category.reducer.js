import CategoriesActionTypes from "./category.type";

const INITIAL_STATE = {
  categories: [{
      categotyId: "",
      categotyName: "",
      idParent: "",
  }],
  status: "loading",
}

const CategoryReducer = (state = INITIAL_STATE, action) => {
  switch(action.type){
      case CategoriesActionTypes.GET_CATEGORIES_ALL:
          return {
              ...state,
              categories: action.payload,
              status: "done",
          }
      default:
          return {...state}
  }
}

export default CategoryReducer;