import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useCookies } from "react-cookie";

// import Topbar from "./topbar";
import LangInput from "../../common/LangInput";

import authActions from "../../../redux/auth/actions";
import pageActions from "../../../redux/page/actions";

export default function Header() {
  const idToken = useSelector((state) => state.Auth.idToken);

  const dispatch = useDispatch();

  const [cookies, setCookie] = useCookies(["private"]);

  const onHandleUserPrivate = () => {
    let value = "false";
    if (cookies.private === "false" || !cookies.private) {
      value = "true";
    }
    setCookie("private", value, { path: "/" });
  };

  const onResetIProfile = () => {
    dispatch({ type: pageActions.GET_USER_PROFILE_SUCCESS, iProfile: null });
  };

  return (
    <>
      <header className="header">
        {/* <Topbar /> */}
        <div className="panel">
          <div className="case">
            <div className="panel__wrap row mobile-row i-mid">
              <Link
                className="panel__logo logo"
                to="/"
                onClick={() => onResetIProfile()}
              >
                <img
                  src={require("../../../assets/images/dondi.png")}
                  alt="dondi - 1st Social Media DeFi Protocol"
                />
              </Link>
              <nav className="panel__nav nav">
                <ul>
                  <li className="mobile-hide">
                    {idToken.mode === "auth" ? (
                      <i
                        className="icon icon-eth pointer"
                        title="Authorized user"
                        onClick={() => onHandleUserPrivate()}
                      ></i>
                    ) : (
                      <i
                        className="icon icon-eye pointer"
                        title="View mode"
                        onClick={() => onHandleUserPrivate()}
                      ></i>
                    )}
                  </li>
                  <li className="has-nav">
                    <Link to="/" onClick={() => onResetIProfile()}>
                      Office
                    </Link>
                    <ul>
                      <li>
                        <Link to="/" onClick={() => onResetIProfile()}>
                          Home
                        </Link>
                      </li>
                      <li>
                        <Link to="/partners" onClick={() => onResetIProfile()}>
                          Partners
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/statistics"
                          onClick={() => onResetIProfile()}
                        >
                          Statistics
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <Link to="/how-it-works">How it works</Link>
                  </li>
                  <li>
                    <Link
                      to="/logout"
                      onClick={() => {
                        dispatch(authActions.logout());
                      }}
                    >
                      Logout
                    </Link>
                  </li>
                </ul>
              </nav>
              <div className="panel__btns row i-mid">
                <LangInput />
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
