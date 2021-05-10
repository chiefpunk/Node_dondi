import React from "react";
import Modal from "react-modal";
import { useDispatch } from "react-redux";

import authActions from "../../../redux/auth/actions";

const customStyles = {
  content: {
    position: "unset",
    padding: "0",
  },
};

Modal.setAppElement("#root");

export default function ModalBox({ showDialog, setShowDialog }) {
  const dispatch = useDispatch();

  const onHandleLogin = () => {
    setShowDialog(false);
    dispatch(authActions.login());
  };

  const closeModal = () => {
    setShowDialog(false);
  };

  return (
    <div id="modal__box">
      <Modal
        isOpen={showDialog}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Authorize"
      >
        <div className="popup popup_sm popup_show" id="popup-auth">
          <div className="popup__wrap">
            <div className="popup__close cls-btn" onClick={closeModal}>
              <i className="icon icon-x"></i>
            </div>
            <div className="popup__inner">
              <div className="popup__title">
                Purchase in view mode is not available! Please log in with your
                Ethereum wallet
              </div>
              <button
                className="popup__btn btn btn_bg-violet btn_md btn_radius btn_hover-bg-gray"
                onClick={onHandleLogin}
                style={{ width: "100%" }}
              >
                Login
              </button>
            </div>
          </div>
          <div className="popup__bg cls-btn" onClick={closeModal}></div>
        </div>
      </Modal>
    </div>
  );
}
