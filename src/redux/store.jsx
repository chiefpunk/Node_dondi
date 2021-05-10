import { createStore, combineReducers, applyMiddleware } from "redux";
import { createBrowserHistory } from "history";
import { connectRouter, routerMiddleware } from "connected-react-router";
import createSagaMiddleware from "redux-saga";
import thunk from "redux-thunk";

import reducers from "./reducers";
import rootSaga from "./sagas";
import { composeWithDevTools } from "redux-devtools-extension";

const history = createBrowserHistory();
const sagaMiddleware = createSagaMiddleware();
const routeMiddleware = routerMiddleware(history);

const middlewares = [thunk, sagaMiddleware, routeMiddleware];

const store = createStore(
  combineReducers({ ...reducers, router: connectRouter(history) }),
  composeWithDevTools(applyMiddleware(...middlewares))
);
sagaMiddleware.run(rootSaga);

export { store, history };
