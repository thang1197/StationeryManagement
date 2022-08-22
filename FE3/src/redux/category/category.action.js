import CategoriesActionTypes from "./category.type";


export const CategoriesGetAll=(categories)=>({
    type: CategoriesActionTypes.GET_CATEGORIES_ALL,
    payload: categories
})
