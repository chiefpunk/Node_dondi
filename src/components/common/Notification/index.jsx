import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ReactTimeAgo from "react-time-ago";

import Web3 from "web3";
import {
  DEV_ABI,
  PROD_ABI,
  DEV_API_PREFIX,
  PROD_API_PREFIX,
  DEV_SMARTCONTRACT_ADDRESS,
  PROD_SMARTCONTRACT_ADDRESS,
  DEV_WEB3_WEBSOCKET_PROVIDER,
  PROD_WEB3_WEBSOCKET_PROVIDER,
} from "../../../helpers/constant";
const { REACT_APP_BUILD_MODE } = process.env;

const getIdFromAddress = async (address) => {
  let apiPrefix = "";
  if (REACT_APP_BUILD_MODE === "development") {
    apiPrefix = DEV_API_PREFIX;
  } else if (REACT_APP_BUILD_MODE === "production") {
    apiPrefix = PROD_API_PREFIX;
  }
  let response = await fetch(apiPrefix + "/users?address=" + address);
  const data = await response.json();
  if (data.code === "200") {
    return data.value.id;
  } else return 0;
};

/**
 * "alert": a message for each event
 * "notification": messages list for the latest 50 events
 */
export default function Notification() {
  const profile = useSelector((state) => state.Auth.profile);

  // const [notifications, setNotifications] = useState(null); // All notifications
  const [latestNotifications, setLatestNotifications] = useState(null); // Latest 50 notifications
  const [showNotifications, setShowNotifications] = useState(false); // Show or hide

  const [notificationMessages, setNotificationMessages] = useState([]);

  const iconClassName = {
    Upgrade: "icon-cart-yellow",
    Registration: "icon-user-add",
    MissedEthReceive: "icon-minus icon_xs",
    SentExtraEthDividends: "icon-wallet-green",
    NewUserPlace: "icon-wallet-green",
    Reinvest: "icon-wallet-green",
  };
  const [alertMessage, setAlertMessage] = useState(null); // A message

  let abi;
  let instance;
  let web3;
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
      new Web3.providers.WebsocketProvider(DEV_WEB3_WEBSOCKET_PROVIDER, options)
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

  useEffect(() => {
    instance.getPastEvents(
      "allEvents",
      {
        fromBlock: 8306015,
        toBlock: "latest",
      },
      function (err, data) {
        const len = data.length;
        if (len < 50) {
          setLatestNotifications(data);
        } else setLatestNotifications(data.slice(len - 50, len));
      }
    );

    instance.events.allEvents({ fromBlock: "latest" }, function (err, data) {
      if (err) {
        console.log(err);
      }
      // let user, referrer, receiver;
      // if (data.returnValues.user) {
      //   getIdFromAddress(data.returnValues.user).then((res) => {
      //     user = res;
      //   });
      // }
      // if (data.returnValues.referrer) {
      //   referrer = getIdFromAddress(data.returnValues.referrer).then((res) => {
      //     referrer = res;
      //   });
      // }
      // if (data.returnValues.receiver) {
      //   receiver = getIdFromAddress(data.returnValues.receiver).then((res) => {
      //     receiver = res;
      //   });
      // }

      let matrix = "x3";
      if (data.returnValues.matrix === "1") {
        matrix = "x6";
      }

      if (data.event === "NewUserPlace") {
        if (profile && profile.address !== data.returnValues.user) {
          if (data.returnValues.matrix === "1" && data.returnValues.place < 3) {
            getIdFromAddress(data.returnValues.referrer).then((res) => {
              handleAlertMessage(
                `ID: ${res} earned ${
                  0.025 * Math.pow(2, data.returnValues.level - 1)
                } ETH in the X3`
              );
            });
          } else if (
            data.returnValues.matrix === "2" &&
            data.returnValues.place > 2 &&
            data.returnValues < 6
          ) {
            getIdFromAddress(data.returnValues.referrer).then((res) => {
              handleAlertMessage(
                `ID: ${res} earned ${
                  0.025 * Math.pow(2, data.returnValues.level - 1)
                } ETH in the X6`
              );
            });
          }
        }
      } else if (data.event === "Upgrade") {
        if (profile && profile.address !== data.returnValues.user) {
          getIdFromAddress(data.returnValues.user).then((res) => {
            handleAlertMessage(
              `ID: ${res} buy slot ${data.returnValues.level} in ${matrix}` // from ReferrerID: ${referrer}`
            );
          });
        }
      } else if (data.event === "Registration") {
        getIdFromAddress(data.returnValues.user).then((res) => {
          handleAlertMessage(`New user ID: ${res} Welcome to Dondi`);
        });
      } else if (data.event === "Reinvest") {
        getIdFromAddress(data.returnValues.user).then((res) => {
          handleAlertMessage(`ID: ${res} reinvests`);
        });
      } else if (data.event === "MissedEthReceive") {
        getIdFromAddress(data.returnValues.receiver).then((res) => {
          handleAlertMessage(
            `Receiver ID: ${res} missed profit ${
              0.025 * Math.pow(2, data.returnValues.level - 1)
            } ETH. You must perform the upgrade in ${matrix}`
          );
        });
      } else if (data.event === "SentExtraEthDividends") {
        getIdFromAddress(data.returnValues.receiver).then((res) => {
          handleAlertMessage(
            `ID: ${res} received a bonus ${
              0.025 * Math.pow(2, data.returnValues.level - 1)
            } ETH`
          );
        });
      }
    });

    // eslint-disable-next-line
  }, []);

  const handleAlertMessage = (message) => {
    setAlertMessage(message);
    setTimeout(() => {
      setAlertMessage(null);
    }, 2000);
  };

  const returnMessage = (notificationObject) => {
    web3.eth.getBlock(notificationObject.blockNumber).then((result) => {
      let timestamp;
      if (result) {
        timestamp = result.timestamp;
      } else {
        timestamp = new Date().getTime() / 1000;
      }

      let matrix = "x3";
      if (notificationObject.returnValues.matrix === "1") {
        matrix = "x6";
      }

      switch (notificationObject.event) {
        case "Upgrade":
          getIdFromAddress(notificationObject.returnValues.user).then((res) => {
            if (notificationMessages.length < 50) {
              notificationMessages.push({
                event: notificationObject.event,
                message: `ID: ${res} buy slot ${notificationObject.returnValues.level} in ${matrix}`,
                timestamp,
              });
              setNotificationMessages(notificationMessages);
            }
            // return `ID: ${res} buy slot ${notificationObject.returnValues.level} in ${matrix}`; // from ReferrerID: ${referrer}`;
          });
          break;
        case "Registration":
          getIdFromAddress(notificationObject.returnValues.user).then((res) => {
            if (notificationMessages.length < 50) {
              notificationMessages.push({
                event: notificationObject.event,
                message: `New user ID: ${res} Welcome to Dondi`,
                timestamp,
              });
              setNotificationMessages(notificationMessages);
            }
            // return `New user ID: ${res} Welcome to Dondi`;
          });
          break;
        case "MissedEthReceive":
          getIdFromAddress(notificationObject.returnValues.receiver).then(
            (res) => {
              if (notificationMessages.length < 50) {
                notificationMessages.push({
                  event: notificationObject.event,
                  message: `Receiver ID: ${res} missed profit ${
                    0.025 *
                    Math.pow(2, notificationObject.returnValues.level - 1)
                  } ETH. You must perform the upgrade in ${matrix}`,
                  timestamp,
                });
                setNotificationMessages(notificationMessages);
              }
              // return `Receiver ID: ${res} missed profit ${
              //   0.025 * Math.pow(2, notificationObject.returnValues.level - 1)
              // } ETH. You must perform the upgrade in ${matrix}`;
            }
          );
          break;
        case "SentExtraEthDividends":
          getIdFromAddress(notificationObject.returnValues.receiver).then(
            (res) => {
              if (notificationMessages.length < 50) {
                notificationMessages.push({
                  event: notificationObject.event,
                  message: `ID: ${res} received a bonus ${
                    0.025 *
                    Math.pow(2, notificationObject.returnValues.level - 1)
                  } ETH`,
                  timestamp,
                });
                setNotificationMessages(notificationMessages);
              }
              // return `ID: ${res} received a bonus ${
              //   0.025 * Math.pow(2, notificationObject.returnValues.level - 1)
              // } ETH`;
            }
          );
          break;
        case "NewUserPlace":
          getIdFromAddress(notificationObject.returnValues.referrer).then(
            (res) => {
              if (notificationMessages.length < 50) {
                notificationMessages.push({
                  event: notificationObject.event,
                  message: `ID: ${res} earned ${
                    0.025 *
                    Math.pow(2, notificationObject.returnValues.level - 1)
                  } ETH in the ${matrix}`,
                  timestamp,
                });
                setNotificationMessages(notificationMessages);
              }
              // return `ID: ${res} earned ${
              //   0.025 * Math.pow(2, notificationObject.returnValues.level - 1)
              // } ETH in the ${matrix}`;
            }
          );
          break;
        case "Reinvest":
          getIdFromAddress(notificationObject.returnValues.user).then((res) => {
            if (notificationMessages.length < 50) {
              notificationMessages.push({
                event: notificationObject.event,
                message: `ID: ${res} reinvests`,
                timestamp,
              });
              setNotificationMessages(notificationMessages);
            }
            // return `ID: ${res} reinvests`;
          });
          break;
        default:
          return "";
      }
    });
  };

  useEffect(() => {
    if (latestNotifications) {
      for (let i = 0; i < latestNotifications.length; i++) {
        returnMessage(latestNotifications[i]);
      }
    }

    // eslint-disable-next-line
  }, [latestNotifications]);

  const onHandleShowNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <>
      <div className="notifications">
        <div
          className="notifications__toggle"
          onClick={() => onHandleShowNotifications()}
        >
          <i className="icon icon-bell"></i>
        </div>
        {alertMessage && (
          <div className="notifications__alert">
            <div className="notifications__item">
              <div className="notifications__icon">
                <i className="icon icon-wallet-green"></i>
              </div>
              <div className="notifications__text">
                <div className="notifications__title">{alertMessage}</div>
                <div className="notifications__desc">Just now</div>
              </div>
            </div>
          </div>
        )}
        {showNotifications && (
          <div className="notifications__wrap">
            <div className="notifications__scroll" id="notifications-scroll">
              <div className="notifications__main-title subtitle">
                50 New Events
              </div>
              <div className="notifications__list">
                {notificationMessages
                  ? notificationMessages
                      .sort((a, b) => b.timestamp - a.timestamp)
                      .map((notification, id) => {
                        return (
                          <div className="notifications__item" key={id}>
                            <div className="notifications__icon">
                              <i
                                className={`icon ${
                                  iconClassName[notification.event]
                                }`}
                              ></i>
                            </div>
                            <div className="notifications__text">
                              <div className="notifications__title">
                                {notification.message}
                              </div>
                              <div className="notifications__desc">
                                <ReactTimeAgo
                                  date={notification.timestamp * 1000}
                                />
                                {/* A minute ago */}
                              </div>
                            </div>
                          </div>
                        );
                      })
                  : ""}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
