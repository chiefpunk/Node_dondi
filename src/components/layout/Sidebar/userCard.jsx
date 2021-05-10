import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useCookies } from "react-cookie";

import pageActions from "../../../redux/page/actions";

const classNames = require("classnames");

export default function UserCard() {
  const dispatch = useDispatch();
  const userProfile = useSelector((state) => state.Auth.profile);

  const iProfile = useSelector((state) => state.Page.iProfile);

  const currency = useSelector((state) => state.Page.currency);
  const currencyRates = useSelector((state) => state.Page.currencyRate);

  const [totalBalance, setTotalBalance] = useState(0);

  const currencySign = { USD: "$", EUR: "€", GBP: "£" };

  //eslint-disable-next-line
  const [cookies, setCookie] = useCookies(["private"]);

  // const onHandleUserPrivate = () => {
  //   let value = "false";
  //   if (cookies.private === "false") {
  //     value = "true";
  //   }
  //   setCookie("private", value, { path: "/" });
  // };

  useEffect(() => {
    dispatch(pageActions.getCurrencyRateRequest());

    dispatch({ type: pageActions.GET_USER_PROFILE_SUCCESS, iProfile: null });

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (userProfile) {
      setTotalBalance(
        Number(userProfile.x3Balance) + Number(userProfile.x6Balance)
      );
    }
  }, [userProfile]);

  const toFixedConverter = (number, precision) => {
    if (userProfile && userProfile.id === "1") {
      number /= 10;
    }
    if (!isNaN(number)) {
      number = parseFloat(number);
    }
    return number.toFixed(precision);
  };

  return (
    <>
      <div className="aside__block block">
        <div className="block__head">
          <div className="eth">
            <div className="eth__wrap row">
              <div className="eth__icon">
                <img
                  src={require("../../../assets/upload/eth.svg")}
                  alt="ethereum"
                />
              </div>
              <div className="eth__list">
                {userProfile && (
                  <div className="eth__item">
                    ID{" "}
                    {cookies.private === "false" || !cookies.private
                      ? userProfile.id
                      : "***"}
                    {/*userProfile ? userProfile.id : ""*/}
                    {iProfile && iProfile.id !== userProfile.id
                      ? `(${iProfile.id})`
                      : ""}
                    {/* (cookies.private === "false" || !cookies.private)
                    ? userProfile.id
                    : "***"} */}
                  </div>
                )}
                <div className="eth__item">
                  <i className="icon icon-partners-blue icon_md"></i>
                  <var>{userProfile ? userProfile.partnersCount : ""}</var>
                </div>
                <div className="eth__item color-yellow">
                  {currencySign[currency]}{" "}
                  {currencyRates
                    ? toFixedConverter(
                        totalBalance * currencyRates[currency],
                        0
                      )
                    : 0}
                </div>
              </div>
            </div>
            <div className="eth__btn-wrap">
              <div className="eth__btn btn btn_bg-pink btn_md btn_radius btn_fz-lg">
                <u>
                  <i className="icon icon-alert-white"></i>
                  <i className="icon icon-alert-violet"></i>
                </u>{" "}
                <span>{toFixedConverter(totalBalance, 3)} eth</span>
              </div>
              <div className="eth__btn-toltip toltip">
                In order not to miss out on profits, please upgrade to the next
                level
              </div>
            </div>
          </div>
        </div>
        <div className="block__body">
          <div className="currents">
            <div className="currents__list">
              <div
                className={classNames("currents__item", {
                  currents__item_current: currency === "USD",
                })}
                onClick={() => dispatch(pageActions.getCurrency("USD"))}
              >
                USD
              </div>
              <div
                className={classNames("currents__item", {
                  currents__item_current: currency === "EUR",
                })}
                onClick={() => dispatch(pageActions.getCurrency("EUR"))}
              >
                EUR
              </div>
              <div
                className={classNames("currents__item", {
                  currents__item_current: currency === "GBP",
                })}
                onClick={() => dispatch(pageActions.getCurrency("GBP"))}
              >
                GBP
              </div>
            </div>
          </div>
          <div className="balance">
            <div className="balance__list">
              <div className="balance__item">
                <div className="balance__head">
                  <div className="balance__logo">
                    <img
                      src={require("../../../assets/images/Dondi_X3.png")}
                      alt="dondi x3"
                    />
                  </div>
                </div>
                <div className="balance__body">
                  <div className="balance__eth">
                    {userProfile
                      ? toFixedConverter(userProfile.x3Balance, 3)
                      : ""}{" "}
                    ETH
                  </div>
                  <div className="balance__count">
                    {currencyRates && userProfile
                      ? toFixedConverter(
                          userProfile.x3Balance * currencyRates[currency],
                          0
                        )
                      : 0}{" "}
                    {currency}
                  </div>
                </div>
              </div>
              <div className="balance__item">
                <div className="balance__head">
                  <div className="balance__logo">
                    <img
                      src={require("../../../assets/images/Dondi_X6.png")}
                      alt="dondi x6"
                    />
                  </div>
                </div>
                <div className="balance__body">
                  <div className="balance__eth">
                    {userProfile
                      ? toFixedConverter(userProfile.x6Balance, 3)
                      : ""}{" "}
                    ETH
                  </div>
                  <div className="balance__count">
                    {currencyRates && userProfile
                      ? toFixedConverter(
                          userProfile.x6Balance * currencyRates[currency],
                          0
                        )
                      : 0}{" "}
                    {currency}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <a
            className="toggle-notice btn btn_bg-violet btn_md btn_radius btn_hover-bg-gray"
            href="/t.me/@dondiBOT"
          >
            <u>
              <i className="icon icon-telegram-white icon_sm"></i>
              <i className="icon icon-telegram icon-telegram-gray icon_sm"></i>
            </u>
            Enable notifications
          </a> */}
        </div>
      </div>
    </>
  );
}
