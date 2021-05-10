import { all } from "redux-saga/effects";
import authSagas from "./auth/saga";
import pageSagas from "./page/saga";

export default function* rootSaga(getState) {
  yield all([authSagas(), pageSagas()]);
}
