import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, connect, useSelector } from "react-redux";
import { BrowserView, MobileView } from "react-device-detect";

import authActions from "../../../redux/auth/actions";

import Modal from "react-modal";
import ErrorMessage from "../../../components/common/ErrorMessage";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "50%",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "500px",
    padding: 0,
    borderRadius: "10px",
  },
};

Modal.setAppElement("#root");

function Signup({ showDialog, match }) {
  const dispatch = useDispatch();
  const uid = useSelector((state) => state.Auth.uid);
  const [uplineAddress, setUplineAddress] = useState(0);

  useEffect(() => {
    if (match.params && match.params.handle) {
      const link = `https://dondi.io/i/${match.params.handle}/`;
      dispatch(authActions.getIdFromAffiliate(link));
    }
  }, [match, dispatch]);

  useEffect(() => {
    if (uid) {
      setUplineAddress(uid);
    }
  }, [uid]);

  useEffect(() => {
    if (showDialog === true) openModal();
  }, [showDialog]);

  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {}

  function closeModal() {
    setIsOpen(false);
    dispatch(authActions.closeDialog());
  }

  const onHandleSignup = () => {
    if (uplineAddress) {
      dispatch(authActions.signUp(uplineAddress));
    } else {
      dispatch(authActions.signUp(1));
    }
  };

  return (
    <>
      <MobileView>
        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <div className="popup-auth">
            <div className="popup-trust_subject">
              <div className="popup-trust_title">
                <div
                  className="close-button"
                  onClick={closeModal}
                  style={{ zIndex: "100" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    version="1"
                    viewBox="0 0 24 24"
                  >
                    <path d="M13 12l5-5-1-1-5 5-5-5-1 1 5 5-5 5 1 1 5-5 5 5 1-1z"></path>
                  </svg>
                </div>
              </div>
              {/* <div className="popup-trust_subject_icon">
                <img
                  src={require("../../../assets/upload/metamask1.svg")}
                  alt=""
                />
              </div>
              <div className="popup-trust_subject_icon">
                <img src={require("../../../assets/upload/shild.png")} alt="" />
              </div> */}
            </div>
            <div className="popup-trust_content">
              <div className="text-center">
                Website <strong style={{ fontWeight: 600 }}>Dondi.io</strong>{" "}
                requires a mobile browser wallet, please ensure you are using a DAPP browser that supports these wallets below: <br />
              </div>
              <div className="text-center">
                <a 
                  href="https://metamask.io" 
                  className="popup-trust_btn">
                  MetaMask
                </a>
              </div>
              <div className="text-center">
                <a
                  href="https://link.trustwallet.com"
                  className="popup-trust_btn"
                >
                  TrustWallet
                </a>
              </div>

              <p className="text-center">
                <span
                  onClick={closeModal}
                  style={{ color: "#333", cursor: "pointer" }}
                >
                  <u>CLOSE THE WINDOW</u>
                </span>
              </p>
            </div>
          </div>
        </Modal>
      </MobileView>
      <BrowserView>
        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <div className="popup-auth">
            <div className="popup-trust_subject">
              <div className="popup-trust_title">
                <div
                  className="close-button"
                  onClick={closeModal}
                  style={{ zIndex: "100" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    version="1"
                    viewBox="0 0 24 24"
                  >
                    <path d="M13 12l5-5-1-1-5 5-5-5-1 1 5 5-5 5 1 1 5-5 5 5 1-1z"></path>
                  </svg>
                </div>
              </div>
              <div className="popup-trust_subject_icon">
                <img
                  src={require("../../../assets/upload/metamask1.svg")}
                  alt=""
                />
              </div>
            </div>
            <div className="popup-trust_content">
              <div className="text-center">
                Website <strong style={{ fontWeight: 600 }}>Dondi.io</strong>{" "}
                requires ETH purse to interact with the smart contract. Click
                the button below to download purse metamask browser <br />
              </div>
              <div className="text-center">
                <a href="https://metamask.io" className="popup-trust_btn">
                  Go metamask.io
                </a>
              </div>
              <p className="text-center">
                <span
                  onClick={closeModal}
                  style={{ color: "#333", cursor: "pointer" }}
                >
                  <u>CLOSE THE WINDOW</u>
                </span>
              </p>
            </div>
          </div>
        </Modal>
      </BrowserView>
      <div className="main-wrap auth">
        <div className="case">
          <ErrorMessage />
          {/* <div className="auth__data row i-mid">
            <a className="auth__logo logo" href="/">
              <img src="upload/logo.svg" alt="" />
            </a>
            <div className="auth__lang lang">
              <div className="lang__current">
                <img src="upload/ru.svg" alt="" />
              </div>
            </div>
          </div> */}
          <div className="auth__blocks">
            <div className="auth__block auth__block_main block">
              <div className="auth__body row">
                <div className="auth__col auth__col_border">
                  <div className="auth__main-title title">
                    Automatic registration
                  </div>
                  <div className="auth__text">
                    To access all the functions of your personal account, use
                    the automatic login
                  </div>
                  <button
                    className="auth__btn btn btn_bg-violet btn_md btn_hover-bg-gray btn_radius"
                    onClick={(e) => onHandleSignup()}
                  >
                    Automatic registration
                  </button>
                </div>
                <div className="auth__col">
                  <div className="auth__title">
                    Check the ID of your invitee. You can change it before
                    proceeding to checkout.
                  </div>
                  <div className="auth__input input input_border-gray input_radius input_md">
                    <input
                      className="input__area"
                      type="text"
                      value={!uplineAddress ? "" : uplineAddress}
                      onChange={(e) => setUplineAddress(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="auth__foot row">
                <div className="auth__col">
                  <div className="auth__sub-title">
                    <Link
                      className="auth__btn btn btn_bg-violet btn_md btn_hover-bg-gray btn_radius"
                      to="/login"
                    >
                      Already a member? Login Here!
                    </Link>
                  </div>
                </div>
                <div className="auth__col">
                  <div className="auth__sub-title">
                    Telegram official chat:&nbsp;&nbsp;&nbsp;
                    <a href="https://t.me/dondichannel">
                      <i className="icon icon-telegram-white icon_xs"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function mapStateToProps(state) {
  return { showDialog: state.Auth.showDialog };
}
export default connect(mapStateToProps)(Signup);
