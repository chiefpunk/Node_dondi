import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import authAction from "../../../redux/auth/actions";
import pageAction from "../../../redux/page/actions";

import { getToken } from "../../../helpers/utility";

const classNames = require("classnames");

export default function SlotFour({ data, bigBuy, showDialog }) {
  const dispatch = useDispatch();
  const history = useHistory();

  const iProfile = useSelector((state) => state.Page.iProfile);

  const onHandleSlot = () => {
    // go to slot detail
    if (!iProfile) {
      dispatch(
        pageAction.slotDetailRequest({ matrix: 2, level: data.slotNumber })
      );
    } else {
      dispatch(
        pageAction.slotDetailRequest({
          address: iProfile.address,
          matrix: 2,
          level: data.slotNumber,
        })
      );
    }
    // dispatch({ type: pageAction.GET_USER_PROFILE_SUCCESS, iProfile: null });
    history.push("/slot");
  };

  const onHandleChild = (uId) => {
    if (uId) {
      dispatch(
        pageAction.slotDetailRequest({
          address: uId,
          matrix: 2,
          level: data.slotNumber,
        })
      );
      dispatch({ type: pageAction.GET_USER_PROFILE_SUCCESS, iProfile: null });
      history.push("/slot");
    }
  };

  const onHandleBuySlot = (e, matrix, level, price) => {
    e.stopPropagation();
    const currentToken = getToken().get("idToken");
    if (currentToken && currentToken.mode === "view") {
      // alert: you cannot buy
      showDialog(true);
    } else {
      /**
       * matrix = 1, x3 program
       * matrix = 2, x6 program
       */
      dispatch(authAction.buySlotRequest({ matrix, level, price }));
    }
  };
  return (
    <>
      <div
        className={classNames("x4__program", "buy__item", {
          buy__item_selected: data.isActive,
        })}
      >
        <div className="buy__inner">
          <div className="buy__wrap" onClick={() => onHandleSlot()}>
            <div className="buy__number">{data.slotNumber}</div>
            <div className="buy__count">{data.slotBuyPrice}</div>
            {data.slotStatus.status ? (
              <div
                className="buy__label buy__label_alert"
                style={{ right: "30%" }}
              >
                <i
                  className="icon icon-alert-yellow"
                  title="In order not to miss out on profits, please upgrade to the next level"
                ></i>
              </div>
            ) : (
              ""
            )}

            {bigBuy ? (
              <div
                className="buy__label buy__label_buy"
                onClick={(e) =>
                  onHandleBuySlot(
                    e,
                    2,
                    data.slotNumber,
                    data.slotBuyPrice.toString()
                  )
                }
              >
                <i className="icon icon-cart-buy"></i>
              </div>
            ) : (
              ""
            )}

            {!data.isActive && !bigBuy ? (
              <div className="buy__label buy__label_cart">
                <i className="icon icon-cart"></i>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="buy__dots buy__dots_2-2 row">
            {data.childItems && (
              <>
                <div
                  className={classNames("buy__dot", {
                    [data.childItems.left[0].status]:
                      data.childItems.left[0].id,
                  })}
                  title={
                    data.childItems.left[0].id
                      ? `UID: ${data.childItems.left[0].id}`
                      : ""
                  }
                  onClick={() => onHandleChild(data.childItems.left[0].id)}
                ></div>
                <div
                  className={classNames("buy__dot", {
                    [data.childItems.right[0].status]:
                      data.childItems.right[0].id,
                  })}
                  title={
                    data.childItems.right[0].id
                      ? `UID: ${data.childItems.right[0].id}`
                      : ""
                  }
                  onClick={() => onHandleChild(data.childItems.right[0].id)}
                ></div>
                <div
                  className={classNames("buy__dot", {
                    [data.childItems.left[1].status]:
                      data.childItems.left[1].id,
                  })}
                  title={
                    data.childItems.left[1].id
                      ? `UID: ${data.childItems.left[1].id}`
                      : ""
                  }
                  onClick={() => onHandleChild(data.childItems.left[1].id)}
                ></div>
                <div
                  className={classNames("buy__dot", {
                    [data.childItems.left[2].status]:
                      data.childItems.left[2].id,
                  })}
                  title={
                    data.childItems.left[2].id
                      ? `UID: ${data.childItems.left[2].id}`
                      : ""
                  }
                  onClick={() => onHandleChild(data.childItems.left[2].id)}
                ></div>
                <div
                  className={classNames("buy__dot", {
                    [data.childItems.right[1].status]:
                      data.childItems.right[1].id,
                  })}
                  title={
                    data.childItems.right[1].id
                      ? `UID: ${data.childItems.right[1].id}`
                      : ""
                  }
                  onClick={() => onHandleChild(data.childItems.right[1].id)}
                ></div>
                <div
                  className={classNames("buy__dot", {
                    [data.childItems.right[2].status]:
                      data.childItems.right[2].id,
                  })}
                  title={
                    data.childItems.right[2].id
                      ? `UID: ${data.childItems.right[2].id}`
                      : ""
                  }
                  onClick={() => onHandleChild(data.childItems.right[2].id)}
                ></div>
              </>
            )}
            {
              //   data.childItems.left.map((item, id) => {
              //     return (
              //       <div
              //         className={classNames("buy__dot", {
              //           [item.status]: item.address,
              //         })}
              //         key={id}
              //         title={item.id ? `UID: ${item.id}` : ""}
              //       ></div>
              //     );
              //   })}
              // {data.childItems &&
              //   data.childItems.right.map((item, id) => {
              //     return (
              //       <div
              //         className={classNames("buy__dot", {
              //           buy__dot_selected: item.address,
              //         })}
              //         key={id}
              //         title={item.id ? `UID: ${item.id}` : ""}
              //       ></div>
              //     );
              //   })
            }
          </div>
        </div>
        {data.isActive ? (
          <div className="buy__data">
            <div className="buy__data-item">
              <div className="buy__data-count">{data.partnersCount}</div>
              <div className="buy__data-icon">
                <i className="icon icon-partners-blue icon_xs"></i>
              </div>
            </div>
            <div className="buy__data-item">
              <div className="buy__data-count">{data.reinvestCount}</div>
              <div className="buy__data-icon">
                <i className="icon icon-reinvest icon_xs"></i>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}
