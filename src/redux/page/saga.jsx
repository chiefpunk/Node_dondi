import { all, takeLatest, call, put, fork, select } from "redux-saga/effects";

// import { toast } from "react-toastify";

import actions from "./actions";

import Web3 from "web3";
import {
  DEV_API_PREFIX,
  PROD_API_PREFIX,
  DEV_ABI,
  PROD_ABI,
  DEV_SMARTCONTRACT_ADDRESS,
  PROD_SMARTCONTRACT_ADDRESS,
  DEV_WEB3_WEBSOCKET_PROVIDER,
  PROD_WEB3_WEBSOCKET_PROVIDER,
} from "../../helpers/constant";

import { getUserAddress } from "../../helpers/utility";

const { REACT_APP_BUILD_MODE } = process.env;
var apiPrefix = "";

if (REACT_APP_BUILD_MODE === "development") {
  apiPrefix = DEV_API_PREFIX;
} else if (REACT_APP_BUILD_MODE === "production") {
  apiPrefix = PROD_API_PREFIX;
}

/**
 * Get Partners From Filter
 */
export function* getPartnersFilterRequest() {
  yield takeLatest(actions.PARTNERS_FILTER_REQUEST, function* ({ payload }) {
    const { filterProgram, filterSlot, filterId, page } = payload;
    const userProfile = yield select((state) => state.Auth.profile);

    try {
      const response = yield call(
        fetch,
        apiPrefix +
          `/partners?address=${userProfile.address}&matrix=${filterProgram}&level=${filterSlot}&search=${filterId}&page=${page}`
      );

      const data = yield call([response, response.json]);

      if (data.code === "200") {
        yield put({
          type: actions.PARTNERS_FILTER_SUCCESS,
          partners: data.value,
        });
      } else {
        yield put({
          type: actions.PARTNERS_FILTER_ERROR,
          msg: "Failed to load partners list. Try again!",
        });
      }
    } catch (e) {
      yield put({ type: actions.PARTNERS_FILTER_ERROR, msg: e });
      return null;
    }
  });
}

/**
 * Get Statistics From Filter
 */
export function* getStatisticsFilterRequest() {
  yield takeLatest(actions.STATISTICS_FILTER_REQUEST, function* ({ payload }) {
    const {
      filterProgram,
      filterSlot,
      filterDirection,
      filterType,
      filterHash,
      page,
    } = payload;

    const userProfile = yield select((state) => state.Auth.profile);

    try {
      const response = yield call(
        fetch,
        apiPrefix +
          `/statistics?address=${userProfile.address}&matrix=${filterProgram}&level=${filterSlot}&direction=${filterDirection}&type=${filterType}&tx=${filterHash}&page=${page}`
      );

      const data = yield call([response, response.json]);

      if (data.code === "200") {
        yield put({
          type: actions.STATISTICS_FILTER_SUCCESS,
          statistics: data.value,
        });
      } else {
        yield put({
          type: actions.STATISTICS_FILTER_ERROR,
          msg: "Failed to load statistics list. Try again!",
        });
      }
    } catch (e) {
      yield put({ type: actions.STATISTICS_FILTER_ERROR, msg: e });
      return null;
    }
  });
}

/**
 * Get Slot Detail
 */
export function* slotDetailRequest() {
  yield takeLatest(actions.SLOT_DETAIL_REQUEST, function* ({ payload }) {
    const { address, matrix, level } = payload;

    let userAddress;
    if (address) {
      userAddress = yield call(getUserAddress, address);
    } else {
      const userProfile = yield select((state) => state.Auth.profile);
      userAddress = userProfile.address;
    }

    try {
      const response = yield call(
        fetch,
        apiPrefix +
          `/slotdetail?address=${userAddress}&matrix=${matrix}&level=${level}`
      );

      const data = yield call([response, response.json]);

      if (data.code === "200") {
        yield put({
          type: actions.SLOT_DETAIL_SUCCESS,
          program: { matrix: matrix === 1 ? "x3" : "x4", level },
          slotDetail: data.value,
        });
      } else {
        yield put({
          type: actions.SLOT_DETAIL_ERROR,
          msg: "Failed to load statistics list. Try again!",
        });
      }
    } catch (e) {
      yield put({ type: actions.SLOT_DETAIL_ERROR, msg: e });
      return null;
    }
  });
}

/**
 * Get notification messsages
 */
export function* getNotificationRequest() {
  yield takeLatest(actions.GET_NOTIFICATION_REQUEST, function* () {
    let abi;
    let instance;
    let web3;

    let latestNotifications; // 50 latest
    let notificationMessages = [];

    const options = {
      timeout: 30000, //ms

      clientConfig: {
        maxReceivedFrameSize: 100000000,
        maxReceivedMessageSize: 100000000,
      },

      reconnect: {
        auto: true,
        delay: 5000, //ms
        maxAttempts: 5,
        onTimeout: false,
      },
    };

    if (REACT_APP_BUILD_MODE === "development") {
      web3 = new Web3(
        new Web3.providers.WebsocketProvider(
          DEV_WEB3_WEBSOCKET_PROVIDER,
          options
        )
      );

      abi = JSON.parse(DEV_ABI);
      instance = new web3.eth.Contract(abi, DEV_SMARTCONTRACT_ADDRESS);
    } else if (REACT_APP_BUILD_MODE === "production") {
      web3 = new Web3(
        new Web3.providers.WebsocketProvider(
          PROD_WEB3_WEBSOCKET_PROVIDER,
          options
        )
      );

      abi = JSON.parse(PROD_ABI);
      instance = new web3.eth.Contract(abi, PROD_SMARTCONTRACT_ADDRESS);
    }

    instance.getPastEvents(
      "allEvents",
      {
        fromBlock: 8306015,
        toBlock: "latest",
      },
      function* (err, data) {
        latestNotifications = data.slice(0, 10);
        const length = latestNotifications.length;

        let count = 0;
        for (let i = 0; i < length; i++) {
          let res = false;
          res = yield call(returnMessage, latestNotifications[i]);

          if (res) count++;
        }
        if (count === length) {
          yield put({
            type: actions.GET_NOTIFICATION_SUCCESS,
            notificationMessages,
          });
        }
      }
    );

    const returnMessage = async (notificationObject) => {
      console.log(notificationObject);

      let matrix = "x3";
      if (notificationObject.returnValues.matrix === "1") {
        matrix = "x6";
      }
      let { level } = notificationObject;

      switch (notificationObject.event) {
        case "Upgrade":
          fetch(
            apiPrefix + "/users?address=" + notificationObject.returnValues.user
          )
            .then((res) => res.json)
            .then((res) => {
              if (notificationMessages.length < 10) {
                notificationMessages.push(
                  `ID: ${res.value.id} buy slot ${level} in ${matrix}`
                );
                return true;
              }
            });
          break;
        case "Registration":
          fetch(
            apiPrefix + "/users?address=" + notificationObject.returnValues.user
          )
            .then((res) => res.json)
            .then((res) => {
              if (notificationMessages.length < 10) {
                notificationMessages.push(
                  `New user ID: ${res.value.id} Welcome to Dondi`
                );
                return true;
              }
            });
          break;
        case "MissedEthReceive":
          fetch(
            apiPrefix +
              "/users?address=" +
              notificationObject.returnValues.receiver
          )
            .then((res) => res.json)
            .then((res) => {
              if (notificationMessages.length < 10) {
                notificationMessages.push(
                  `Receiver ID: ${res.value.id} missed profit ${
                    0.025 * Math.pow(2, level - 1)
                  } ETH. You must perform the upgrade in ${matrix}`
                );
                return true;
              }
            });
          break;
        case "SentExtraEthDividends":
          fetch(
            apiPrefix +
              "/users?address=" +
              notificationObject.returnValues.receiver
          )
            .then((res) => res.json)
            .then((res) => {
              if (notificationMessages.length < 10) {
                notificationMessages.push(
                  `ID: ${res.value.id} received a bonus ${
                    0.025 * Math.pow(2, level - 1)
                  } ETH`
                );
                return true;
              }
            });

          break;
        case "NewUserPlace":
          fetch(
            apiPrefix +
              "/users?address=" +
              notificationObject.returnValues.referrer
          )
            .then((res) => res.json)
            .then((res) => {
              if (notificationMessages.length < 10) {
                notificationMessages.push(
                  `ID: ${res.value.id} earned ${
                    0.025 * Math.pow(2, level - 1)
                  } ETH in the ${matrix}`
                );
                return true;
              }
            });

          break;
        case "Reinvest":
          fetch(
            apiPrefix + "/users?address=" + notificationObject.returnValues.user
          )
            .then((res) => res.json)
            .then((res) => {
              if (notificationMessages.length < 10) {
                notificationMessages.push(`ID: ${res.value.id} reinvests`);
                return true;
              }
            });

          break;
        default:
          return "";
      }
    };

    if (latestNotifications) {
      const length = latestNotifications.length;

      let count = 0;
      for (let i = 0; i < length; i++) {
        let res = false;
        res = yield call(returnMessage, latestNotifications[i]);
        if (res) count++;
      }
      if (count === length) {
        yield put({
          type: actions.GET_NOTIFICATION_SUCCESS,
          notificationMessages,
        });
      }
    }

    // alert
    let alertData;
    let message = "";

    instance.events.allEvents({ fromBlock: "latest" }, function (err, data) {
      if (err) {
        console.log(err);
      }

      alertData = data;
    });

    if (alertData) {
      let user, referrer, receiver;
      const { matrix, level } = alertData.returnValues;
      let matrixStr = matrix === "1" ? "x3" : "x6";

      if (alertData.returnValues.user) {
        const res = yield call(
          fetch,
          apiPrefix + "/users?address=" + alertData.returnValues.user
        );

        const resData = yield call([res, res.json]);

        if (resData.code === "200") {
          user = resData.value.id;
        }
      }

      if (alertData.returnValues.referrer) {
        const res = yield call(
          fetch,
          apiPrefix + "/users?address=" + alertData.returnValues.referrer
        );

        const resData = yield call([res, res.json]);

        if (resData.code === "200") {
          referrer = resData.value.id;
        }
      }

      if (alertData.returnValues.receiver) {
        const res = yield call(
          fetch,
          apiPrefix + "/users?address=" + alertData.returnValues.receiver
        );

        const resData = yield call([res, res.json]);

        if (resData.code === "200") {
          receiver = resData.value.id;
        }
      }

      if (alertData.event === "NewUserPlace") {
        if (
          alertData.returnValues.matrix === "1" &&
          alertData.returnValues.place < 3
        ) {
          if (referrer)
            message = `ID: ${referrer} earned ${
              0.025 * Math.pow(2, level - 1)
            } ETH in the X3`;
        } else if (
          alertData.returnValues.matrix === "2" &&
          alertData.returnValues.place > 2 &&
          alertData.returnValues < 6
        ) {
          if (referrer)
            message = `ID: ${referrer} earned ${
              0.025 * Math.pow(2, level - 1)
            } ETH in the X6`;
        }
      } else if (alertData.event === "Upgrade") {
        if (user && referrer)
          message = `ID: ${user} buy ${level} in ${matrixStr} from ReferrerID: ${referrer}`;
      } else if (alertData.event === "Registration") {
        if (user) message = `New user ID: ${user} Welcome to Dondi`;
      } else if (alertData.event === "Reinvest") {
        if (user) message = `ID: ${user} reinvests`;
      } else if (alertData.event === "MissedEthReceive") {
        if (receiver)
          message = `Receiver ID: ${receiver} missed profit ${
            0.025 * Math.pow(2, level - 1)
          } ETH. You must perform the upgrade in ${matrixStr}`;
      } else if (alertData.event === "SentExtraEthDividends") {
        if (receiver)
          message = `ID: ${receiver} received a bonus ${
            0.025 * Math.pow(2, level - 1)
          } ETH`;
      }

      yield put({
        type: actions.GET_ALERT_MESSAGE_SUCCESS,
        alertMessage: message,
      });
    }
  });
}

export function* getCurrencyRateRequest() {
  yield takeLatest(actions.GET_CURRENCY_RATE_REQUEST, function* () {
    try {
      const response = yield call(
        fetch,
        `https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD,EUR,GBP`
      );

      const data = yield call([response, response.json]);

      if (data) {
        yield put({
          type: actions.GET_CURRENCY_RATE_SUCCESS,
          currencyRate: data,
        });
      }
    } catch (e) {
      console.log(e);
    }
  });
}

export function* getCurrency() {
  yield takeLatest(actions.GET_CURRENCY_REQUEST, function* ({ payload }) {
    yield put({ type: actions.UPDATE_CURRENCY, currency: payload });
  });
}

export function* getUserProfile() {
  yield takeLatest(actions.GET_USER_PROFILE_REQUEST, function* ({ payload }) {
    const userAddress = yield call(getUserAddress, payload);

    if (userAddress !== "0x0000000000000000000000000000000000000000") {
      const userRes = yield call(
        fetch,
        apiPrefix + "/profile?address=" + userAddress
      );

      const userResData = yield call([userRes, userRes.json]);

      if (userResData.code === "200") {
        // let profile = {
        //   id: userResData.value.id,
        //   address: currentUserAddress,
        //   referrerAddress: userResData.value.referrer,
        //   partnersCount: userResData.value.partnersCount,
        //   x3Balance: userResData.value.x3Balance,
        //   x6Balance: userResData.value.x6Balance,
        //   affiliateLink: userResData.value.affiliateLink,
        //   x3Matrix: userResData.value.x3Matrix,
        //   x6Matrix: userResData.value.x6Matrix,
        //   activeX3Levels: userResData.value.activeX3Levels,
        //   activeX6Levels: userResData.value.activeX6Levels,
        // };

        yield put({
          type: actions.GET_USER_PROFILE_SUCCESS,
          iProfile: userResData.value,
        });
      }
    } else {
      console.log("No user!");
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(getPartnersFilterRequest),
    fork(getStatisticsFilterRequest),
    fork(slotDetailRequest),
    fork(getNotificationRequest),
    fork(getCurrencyRateRequest),
    fork(getCurrency),
    fork(getUserProfile),
  ]);
}
