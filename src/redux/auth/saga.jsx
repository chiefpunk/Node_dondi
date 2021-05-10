import {
  all,
  takeEvery,
  takeLatest,
  call,
  put,
  fork,
} from "redux-saga/effects";
import { push } from "react-router-redux";
import Web3 from "web3";

import { toast } from "react-toastify";

import { getToken, clearToken, getUserAddress } from "../../helpers/utility";
import axios from "axios";
import actions from "./actions";
import {
  DEV_ABI,
  PROD_ABI,
  DEV_API_PREFIX,
  PROD_API_PREFIX,
  DEV_SMARTCONTRACT_ADDRESS,
  PROD_SMARTCONTRACT_ADDRESS,
} from "../../helpers/constant";

// const DEFAULT_GASPRICE = 39145;
// const GASPRICE = 144 * 1e9;

const { REACT_APP_BUILD_MODE } = process.env;
var apiPrefix = "";

if (REACT_APP_BUILD_MODE === "development") {
  apiPrefix = DEV_API_PREFIX;
} else if (REACT_APP_BUILD_MODE === "production") {
  apiPrefix = PROD_API_PREFIX;
}

/**
 * Load Web3.js
 */
const getWeb3 = () =>
  new Promise(async (resolve, reject) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    // window.addEventListener("load", async () => {
    // Modern dapp browsers...
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        // Request account access if needed
        await window.ethereum.enable();
        // Acccounts now exposed
        resolve(web3);
      } catch (error) {
        reject(error);
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      // Use Mist/MetaMask's provider.
      const web3 = window.web3;
      // console.log("Injected web3 detected.");
      resolve(web3);
    }
    // Fallback to localhost; use dev console port by default...
    else {
      const provider = new Web3.providers.HttpProvider("http://127.0.0.1:8545");
      const web3 = new Web3(provider);
      // console.log("No web3 instance injected, using Local web3.");
      resolve(web3);
    }
  });
// const getWeb3 = (callback, err) => {
//   if (!window.ethereum && !window.web3) {
//     console.log('notDetectedWallet');
//     return false;
//   }

//   if (!window.web3.eth.coinbase) {
//     console.log('unlockWallet');
//   }

//   let i = 0;
//   let id = setInterval(() => {
//     if (i > 1800 || window.web3.eth.coinbase) {
//       clearInterval(id);
//       if (window.web3.eth.coinbase) {
//         startApp();
//         callback(window.web3, true);
//       }
//     } else if (++i === 1) {
//       // Modern dapp browsers...
//       if (window.ethereum) {
//         if (window.ethereum.autoRefreshOnNetworkChange) {
//           window.ethereum.autoRefreshOnNetworkChange = false;
//         }

//         window.web3 = new Web3(window.ethereum);
//         try {
//           window.ethereum.enable();
//           startApp();
//         } catch (error) {
//           console.log(error.message);
//           return false;
//         }
//       }

//       // Legacy dapp browsers...
//       else if (window.web3) {
//         window.web3 = new Web3(window.web3.currentProvider);
//         startApp();
//       }
//       else {

//       }
//     }
//   }, 100);
// };

// function startApp() {
//   window.web3.version.getNetwork(function(err, netId) {
//     if (netId !== "1") {
//       // net Id must be 1, show message
//     }

//     switch (netId) {
//       case "1":
//         break;
//       case "2":
//         break;
//       case "3":
//         break;
//       case "4":
//         break;
//       case "42":
//         break;
//       default:
//     }
//   });

//   initData();
// }

// function initData() {
//   document.body.classList.add('web3' in window ? 'web3' : 'noweb3');
// }

// setTimeout(function () {
//   if (!window.ethereum) {
//     return false;
//   }

//   window.ethereum.on('accountChanged', function (accounts) {
//     // logout
//   });

//   window.ethereum.on('networkChanged', function (netId) {});
// }, 1000);

/**
 * Login Request
 */
export function* loginRequest() {
  yield takeEvery(actions.LOGIN_REQUEST, function* ({ payload }) {
    // user View mode
    const { token } = payload;

    if (token) {
      const userAddress = yield call(getUserAddress, token);

      if (userAddress === "0x0000000000000000000000000000000000000000") {
        yield put({
          type: actions.LOGIN_ERROR,
          payload: {
            type: "warn",
            msg: "User doesn't exist!",
            description:
              "The specified user is not registered in the project, in case of an error, please contact us",
          },
        });
        return;
      }

      try {
        const response = yield call(
          fetch,
          apiPrefix + "/isuserexists?address=" + userAddress
        );

        const data = yield call([response, response.json]);

        if (data.code === "200") {
          if (data.value === true) {
            yield put({
              type: actions.LOGIN_SUCCESS,
              token: { id: userAddress, mode: "view" },
              isLoading: true,
            });
            yield put({
              type: actions.CHECK_AUTHORIZATION,
              token: { id: userAddress, mode: "view" },
            });
            yield put(push("/"));
          } else {
            yield put({
              type: actions.LOGIN_ERROR,
              payload: {
                type: "warn",
                msg: "User doesn't exist!",
                description:
                  "The specified user is not registered in the project, in case of an error, please contact us",
              },
            });
          }
        } else {
          yield put({
            type: actions.LOGIN_ERROR,
            payload: {
              type: "red",
              msg: "Login error!",
              description:
                "Something went wrong while getting user infomation, in case of an error, please contact us",
            },
          });
        }
      } catch (e) {
        yield put({
          type: actions.LOGIN_ERROR,
          payload: {
            type: "red",
            msg: "User request error!",
            description:
              "Something went wrong while getting user infomation, in case of an error, please contact us",
          },
        });
        return null;
      }
      return;
    }

    // user Auth mode
    let web3;
    let accounts;
    try {
      web3 = yield call(getWeb3);
      accounts = yield call(web3.eth.getAccounts);
    } catch (e) {
      yield put({ type: actions.SHOW_DIALOG });
      return;
    }

    try {
      const response = yield call(
        fetch,
        apiPrefix + "/isuserexists?address=" + accounts[0]
      );

      const data = yield call([response, response.json]);
      if (data.code === "200") {
        if (data.value === true) {
          // yield put({
          //   type: actions.LOGIN_SUCCESS,
          //   token: { id: accounts[0], mode: "auth" },
          //   isLoading: true,
          // });
          yield put({
            type: actions.UPDATE_ERROR_MESSAGE,
            errorMessage: {
              type: "success",
              message: "Login Success!",
              description: "Wait for a second ...",
            },
          });
          yield put({
            type: actions.CHECK_AUTHORIZATION,
            token: { id: accounts[0], mode: "auth" },
          });
        } else {
          yield put({
            type: actions.LOGIN_ERROR,
            payload: {
              type: "warn",
              msg: "You should register!",
              description:
                "The specified user is not registered in the project, in case of an error, please contact us",
            },
          });
          yield put(push("/register"));
        }
      } else {
        yield put({
          type: actions.LOGIN_ERROR,
          payload: {
            type: "red",
            msg: "Login error!",
            description:
              "Something went wrong while getting user infomation, in case of an error, please contact us",
          },
        });
      }
    } catch (e) {
      yield put({
        type: actions.LOGIN_ERROR,
        payload: {
          type: "red",
          msg: "User request error!",
          description:
            "Something went wrong while getting user infomation, in case of an error, please contact us",
        },
      });
      return null;
    }
  });
}

export function* loginSuccess() {
  yield takeEvery(actions.LOGIN_SUCCESS, function* (payload) {
    yield localStorage.setItem("id_token", JSON.stringify(payload.token));
  });
}

export function* loginError() {
  yield takeEvery(actions.LOGIN_ERROR, function* ({ payload }) {
    const { type, msg, description } = payload;
    clearToken();
    if (msg) {
      // yield toast(msg, { type: toast.TYPE.ERROR });
      yield put({
        type: actions.UPDATE_ERROR_MESSAGE,
        errorMessage: { type, message: msg, description },
      });
    }
  });
}

export function* logout() {
  yield takeEvery(actions.LOGOUT, function* () {
    clearToken();
    yield put(push("/"));
  });
}

export function* checkAuthorization() {
  yield takeEvery(actions.CHECK_AUTHORIZATION, function* ({ token }) {
    // current use
    let currentToken = null;

    if (token) {
      currentToken = token;
    } else {
      currentToken = getToken().get("idToken");
    }

    if (!currentToken) return;

    let currentUserAddress = yield call(getUserAddress, currentToken.id);

    if (currentUserAddress !== "0x0000000000000000000000000000000000000000") {
      try {
        const userRes = yield call(
          fetch,
          apiPrefix + "/profile?address=" + currentUserAddress
        );

        const userResData = yield call([userRes, userRes.json]);

        if (userResData.code === "200") {
          let profile = {
            id: userResData.value.id,
            address: currentUserAddress,
            referrerAddress: userResData.value.referrer,
            partnersCount: userResData.value.partnersCount,
            x3Balance: userResData.value.x3Balance,
            x6Balance: userResData.value.x6Balance,
            affiliateLink: userResData.value.affiliateLink,
            x3Matrix: userResData.value.x3Matrix,
            x6Matrix: userResData.value.x6Matrix,
            activeX3Levels: userResData.value.activeX3Levels,
            activeX6Levels: userResData.value.activeX6Levels,
          };

          yield put({
            type: actions.LOGIN_SUCCESS,
            token: { id: profile.id, mode: currentToken.mode },
            profile: profile,
            isLoading: false,
          });

          yield put({ type: actions.GET_DONDI_INFO });

          yield put(push("/"));
        }
      } catch (e) {
        console.log(e);
        yield put({
          type: actions.LOGIN_ERROR,
          payload: {
            type: "red",
            msg: "User profile doesn't exist!",
            description:
              "Something went wrong while getting user infomation. Please try again.",
          },
        });
        yield put(push("/login"));
      }
    } else {
      yield put({
        type: actions.LOGIN_ERROR,
        payload: {
          type: "warn",
          msg: "User doesn't exist!",
          description:
            "The specified user is not registered in the project, in case of an error, please contact us",
        },
      });
    }
  });
}

/**
 * Signup Request
 */
export function* signUpRequest() {
  yield takeLatest(actions.SIGNUP_REQUEST, function* ({ payload }) {
    const uplineId = payload;
    var web3;
    var accounts;

    try {
      web3 = yield call(getWeb3);
      accounts = yield call(web3.eth.getAccounts);
    } catch (e) {
      yield put({ type: actions.SHOW_DIALOG });
    }

    try {
      const response = yield call(
        fetch,
        apiPrefix + "/isuserexists?address=" + accounts[0]
      );

      const data = yield call([response, response.json]);

      if (data.code === "200" && data.value === true) {
        yield put({
          type: actions.UPDATE_ERROR_MESSAGE,
          errorMessage: {
            type: "warn",
            message: "User already exists!",
            description: "You can login dondi.",
          },
        });

        yield put(push("/login"));
        return;
      }
    } catch (e) {
      console.log(e);
      yield put({ type: actions.SIGNUP_ERROR, msg: "User check failed." });
    }

    try {
      var abi;
      var instance;
      var response;
      if (REACT_APP_BUILD_MODE === "development") {
        abi = JSON.parse(DEV_ABI);
        instance = new web3.eth.Contract(abi, DEV_SMARTCONTRACT_ADDRESS);

        response = yield call(
          fetch,
          DEV_API_PREFIX + "/idtoaddress?id=" + uplineId
        );
      } else if (REACT_APP_BUILD_MODE === "production") {
        abi = JSON.parse(PROD_ABI);
        instance = new web3.eth.Contract(abi, PROD_SMARTCONTRACT_ADDRESS);

        response = yield call(
          fetch,
          PROD_API_PREFIX + "/idtoaddress?id=" + uplineId
        );
      }

      try {
        // const gasPrice = yield call(web3.eth.getGasPrice);
        // const block = yield call(web3.eth.getBlock, "latest");

        // const gasLimit =
        //   block.gasLimit > 1000000
        //     ? 1000000
        //     : web3.eth.getBlock("latest").gasLimit;
        const registrationExtAsync = async (id) => {
          const response = await axios.get(
            "https://ethgasstation.info/json/ethgasAPI.json"
          );
          let prices = {
            low: response.data.safeLow / 10,
            medium: response.data.average / 10,
            high: response.data.fast / 10,
          };

          return await instance.methods
            .registrationExt(id)
            .send({
              from: accounts[0],
              value: web3.utils.toWei("0.05", "ether"),
              //gasLimit: gasLimit,
              gasPrice:
                (prices.high > 150
                  ? prices.medium > 150
                    ? prices.low
                    : prices.medium
                  : prices.high) * 1e9,
            })
            .then((data) => data)
            .catch((error) => error);
        };

        const data = yield call([response, response.json]);

        if (data.code === "200") {
          if (data.value !== "0x0000000000000000000000000000000000000000") {
            try {
              yield put({
                type: actions.UPDATE_ERROR_MESSAGE,
                errorMessage: {
                  type: "warn",
                  message: "Processing registration!",
                  description: "Wait for a second ...",
                },
              });
              const retTempValue = yield call(registrationExtAsync, data.value);

              let userRes;
              if (REACT_APP_BUILD_MODE === "development") {
                userRes = yield call(
                  fetch,
                  DEV_API_PREFIX + "/users?address=" + retTempValue.from
                );
              } else if (REACT_APP_BUILD_MODE === "production") {
                userRes = yield call(
                  fetch,
                  PROD_API_PREFIX + "/users?address=" + retTempValue.from
                );
              }
              const userData = yield call([userRes, userRes.json]);

              if (userData.value.id !== "0") {
                const response = yield call(
                  fetch,
                  apiPrefix + "/generatelink",
                  {
                    method: "POST",
                    headers: {
                      Accept: "application/json",
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ uid: userData.value.id }),
                  }
                );

                const affiliate = yield call([response, response.json]);

                if (affiliate.code === "200" || affiliate.code === "1001") {
                  yield put({
                    type: actions.SIGNUP_SUCCESS,
                    payload: { id: userData.value.id, mode: "auth" },
                  });

                  yield put({
                    type: actions.CHECK_AUTHORIZATION,
                    token: { id: retTempValue.from, mode: "auth" },
                  });
                }

                // yield put({
                //   type: actions.GET_AFFILIATE_REQUEST,
                //   payload: { uid: userData.value.id },
                // });
              } else {
                yield put({
                  type: actions.UPDATE_ERROR_MESSAGE,
                  errorMessage: {
                    type: "red",
                    message: "Registration error!",
                    description: "Try again.",
                  },
                });
              }
            } catch (error) {
              yield put({
                type: actions.UPDATE_ERROR_MESSAGE,
                errorMessage: {
                  type: "red",
                  message: "Registration error!",
                  description: "Try again.",
                },
              });
              yield put({
                type: actions.SIGNUP_ERROR,
                msg: error,
              });
            }
          } else {
            yield put({
              type: actions.SIGNUP_ERROR,
              msg: "Your upline is not registered",
            });
          }
        } else {
          yield put({
            type: actions.SIGNUP_ERROR,
            msg: "SignUp failed. Try again!", // upline request error
          });
          return;
        }
      } catch (e) {
        yield put({
          type: actions.UPDATE_ERROR_MESSAGE,
          errorMessage: {
            type: "red",
            message: "Registration error!",
            description: "Try again.",
          },
        });
        yield put({ type: actions.SIGNUP_ERROR, msg: e });
        return null;
      }
    } catch (e) {
      console.log(e);
      return null;
    }
  });
}

export function* signUpSuccess() {
  yield takeLatest(actions.SIGNUP_SUCCESS, function* ({ payload }) {
    yield localStorage.setItem("id_token", JSON.stringify(payload));
  });
}

export function* signUpError() {
  yield takeEvery(actions.SIGNUP_ERROR, function* ({ msg }) {
    if (msg) yield toast(msg, { type: toast.TYPE.ERROR });
    clearToken();
  });
}

export function* getAffiliateRequest() {
  yield takeLatest(actions.GET_AFFILIATE_REQUEST, function* ({ payload }) {
    try {
      const response = yield call(fetch, apiPrefix + "/generatelink", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid: payload.uid }),
      });

      const affiliate = yield call([response, response.json]);

      if (affiliate.code === "200") {
        yield put({
          type: actions.GET_AFFILIATE_SUCCESS,
          affiliate: affiliate.value,
        });
      }
    } catch (e) {
      yield toast(`Failed generating affiliate link!`, {
        type: toast.TYPE.ERROR,
      });
    }
  });
}

export function* getIdFromAffiliate() {
  yield takeLatest(actions.GET_ID_FROM_AFFILIATE, function* ({ payload }) {
    try {
      const response = yield call(fetch, apiPrefix + "/getidfromlink", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ link: payload }),
      });

      const uid = yield call([response, response.json]);

      if (uid.code === "200" && uid.value !== 0) {
        yield put({
          type: actions.GET_ID_FROM_SUCCESS,
          uid: uid.value,
        });
      }
    } catch (e) {
      yield toast(`Failed to get Id from affiliate link!`, {
        type: toast.TYPE.ERROR,
      });
    }
  });
}

export function* getDondiInfo() {
  yield takeLatest(actions.GET_DONDI_INFO, function* () {
    // dondiInfo has, 1: number of users, 2: joined users/24hr, 3: total earned ETH
    const dondiInfo = yield call(fetch, apiPrefix + "/dondiinfo");
    const dondiInfoResData = yield call([dondiInfo, dondiInfo.json]);
    yield put({
      type: actions.GET_DONDI_INFO_SUCCESS,
      dondiInfo: dondiInfoResData.value,
    });
  });
}

export function* buySlotRequest() {
  yield takeEvery(actions.BUY_SLOT_REQUEST, function* ({ payload }) {
    var web3;
    var accounts;
    // var gasPrice;

    const { matrix, level, price } = payload;

    try {
      web3 = yield call(getWeb3);
      accounts = yield call(web3.eth.getAccounts);

      var abi;
      var instance;

      if (REACT_APP_BUILD_MODE === "development") {
        abi = JSON.parse(DEV_ABI);
        instance = new web3.eth.Contract(abi, DEV_SMARTCONTRACT_ADDRESS);
      } else if (REACT_APP_BUILD_MODE === "production") {
        abi = JSON.parse(PROD_ABI);
        instance = new web3.eth.Contract(abi, PROD_SMARTCONTRACT_ADDRESS);
      }

      try {
        // const gasPrice = yield call(web3.eth.getGasPrice);
        // const block = yield call(web3.eth.getBlock, "latest");

        // const gasLimit =
        //   block.gasLimit > 1000000
        //     ? 1000000
        //     : web3.eth.getBlock("latest").gasLimit;
        // console.log(gasLimit);

        const buyNewLevelAsync = async (matrix, level, price) => {
          let response = await axios.get(
            "https://ethgasstation.info/json/ethgasAPI.json"
          );
          let prices = {
            low: response.data.safeLow / 10,
            medium: response.data.average / 10,
            high: response.data.fast / 10,
          };

          return await instance.methods
            .buyNewLevel(matrix, level)
            .send({
              from: accounts[0],
              value: web3.utils.toWei(price.toString(), "ether"),
              //gasLimit: gasLimit,
              gasPrice:
                (prices.high > 150
                  ? prices.medium > 150
                    ? prices.low
                    : prices.medium
                  : prices.high) * 1e9,
            })
            .then((data) => data)
            .catch((error) => error);
        };

        const retVal = yield call(buyNewLevelAsync, matrix, level, price);
        if (retVal.status) {
          yield put({
            type: actions.BUY_SLOT_SUCCESS,
            payload: { matrix, level, price },
          });
          yield toast(`You just bought a new slot successfully!`, {
            type: toast.TYPE.SUCCESS,
          });
        }
      } catch (e) {
        console.log(e);
      }
    } catch (e) {
      yield toast(`Failed buying a new slot!`, {
        type: toast.TYPE.ERROR,
      });
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(checkAuthorization),
    fork(loginRequest),
    fork(loginSuccess),
    fork(loginError),
    fork(logout),
    fork(signUpRequest),
    fork(signUpSuccess),
    fork(signUpError),
    fork(getAffiliateRequest),
    fork(getIdFromAffiliate),
    fork(buySlotRequest),
    fork(getDondiInfo),
  ]);
}
