import ProductActionTypes from "./product.type";

/*
    Reducer bao gồm: 
      - Một state cụ thể nào đó cần lưu trong store (một state chung được combine từ nhiều state của nhiều reducer).
      - Nhận action: dựa vào action type, và data nhận vào từ action để thay đổi state cụ thể này.
*/
const INITIAL_STATE = {
  products: [
    {
      productId: "",
      productName: "",
      quantity: 0,
      price: 0,
      featureImgPath: "",
      categoryId: "",
      productEnable: "",
    },
  ],

  status: "loading",
};

const ProductReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ProductActionTypes.GET_PRODUCT_ALL:
      return {
        ...state,
        products: [...action.payload],
        status: "done",
      };
    case ProductActionTypes.CREATE_PRODUCT:
      return {
        ...state,
        products: [...action.payload],
        status: "done",
      };
    default:
      return state;
  }
};
export default ProductReducer;
