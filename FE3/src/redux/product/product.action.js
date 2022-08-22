import ProductActionTypes from "./product.type";

export const ProductGetAll = (products) => ({
  type: ProductActionTypes.GET_PRODUCT_ALL,
  payload: products,
});

export const createProductStart = (productInfo) => ({
  type: ProductActionTypes.CREATE_PRODUCT,
  payload: productInfo,
});

