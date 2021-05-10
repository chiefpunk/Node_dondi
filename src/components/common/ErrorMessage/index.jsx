import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import authActions from "../../../redux/auth/actions";
function ErrorMessage() {
  const dispatch = useDispatch();
  const errorMessage = useSelector((state) => state.Auth.errorMessage);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (errorMessage) {
      setShowMessage(true);
    }
  }, [errorMessage]);

  const handleClose = () => {
    dispatch({ type: authActions.UPDATE_ERROR_MESSAGE, payload: null });
    setShowMessage(false);
  };

  return (
    <>
      {showMessage && (
        <div className="auth__alerts alerts" id="error_message">
          {errorMessage.type === "success" && (
            <div className="alert alert_green">
              <div className="alert__wrap row i-mid">
                <div className="alert__icon">
                  <i className="icon icon-check"></i>
                </div>
                <div className="alert__text">
                  <div className="alert__title">{errorMessage.message}</div>
                  <div className="alert__desc">{errorMessage.description}</div>
                </div>
              </div>
              <div className="alert__close" onClick={() => handleClose()}>
                <i className="icon icon-x"></i>
              </div>
            </div>
          )}
          {errorMessage.type === "warn" && (
            <div className="alert alert_orange">
              <div className="alert__wrap row i-mid">
                <div className="alert__icon">
                  <i className="icon icon-alert"></i>
                </div>
                <div className="alert__text">
                  <div className="alert__title">{errorMessage.message}</div>
                  <div className="alert__desc">{errorMessage.description}</div>
                </div>
              </div>
              <div className="alert__close" onClick={() => handleClose()}>
                <i className="icon icon-x"></i>
              </div>
            </div>
          )}
          {errorMessage.type === "normal" && (
            <div className="alert alert_violet">
              <div className="alert__wrap row i-mid">
                <div className="alert__icon">
                  <i className="icon icon-bell-violet"></i>
                </div>
                <div className="alert__text">
                  <div className="alert__title">{errorMessage.message}</div>
                  <div className="alert__desc">{errorMessage.description}</div>
                </div>
              </div>
              <div className="alert__close" onClick={() => handleClose()}>
                <i className="icon icon-x"></i>
              </div>
            </div>
          )}
          {errorMessage.type === "red" && (
            <div className="alert alert_red">
              <div className="alert__wrap row i-mid">
                <div className="alert__icon">
                  <i className="icon icon-crest"></i>
                </div>
                <div className="alert__text">
                  <div className="alert__title">{errorMessage.message}</div>
                  <div className="alert__desc">{errorMessage.description}</div>
                </div>
              </div>
              <div className="alert__close" onClick={() => handleClose()}>
                <i className="icon icon-x"></i>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default ErrorMessage;
