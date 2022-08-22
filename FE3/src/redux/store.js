import { applyMiddleware, compose, createStore } from "redux";
import { persistStore } from "redux-persist";
import createSagaMiddleware from "redux-saga";

import logger from "redux-logger";
import rootSaga from "./root-saga";
import rootReducer from "./root-reducer";

const composeEnhancers =
  process.env.NODE_ENV !== "production" &&
  typeof window === "object" &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        shouldHotReload: false,
      })
    : compose;

const sagaMiddleWare = createSagaMiddleware();
const middlewares = [sagaMiddleWare];

if (process.env.NODE_ENV === "development") {
  middlewares.push(logger);
}

const enhancers = [applyMiddleware(...middlewares)];

export const store = createStore(rootReducer, composeEnhancers(...enhancers));
sagaMiddleWare.run(rootSaga);
export const persistor = persistStore(store);
