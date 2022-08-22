//#region Cart
const cart = [];

const handleCart = (state = cart, action) => {
  const product = action.payload;
  switch (action.type) {
    case "ADDITEM":
      // check if the product is already exists
      const exist = state.find((x) => x.productId === product.productId);
      if (exist) {
        // Increase of quantity
        return state.map((x) =>
          x.productId === product.productId ? { ...x, qty: x.qty + 1 } : x
        );
      } else {
        const product = action.payload;
        return [
          ...state,
          {
            ...product,
            qty: 1,
          },
        ];
      }
      break;

    case "DELITEM":
      const exist1 = state.find((x) => x.productId === product.productId);
      if (exist1.qty === 1) {
        return state.filter((x) => x.productId !== exist1.productId);
      } else {
        return state.map((x) =>
          x.productId === product.productId ? { ...x, qty: x.qty - 1 } : x
        );
      }
      break;

    case "DELALL":
      // check if the product is already exists
      const cartAl = state.find((x) => x.productId === product.productId);
      if (cartAl) {
        // Increase of quantity
        return state.filter((x) => x.productId !== cartAl.productId);
      }
      break;
      case "CLEAR":
      // check if the product is already exists
        return [];
      break;
    default:
      return state;
      break;
  }
};

export default handleCart
//#endregion
