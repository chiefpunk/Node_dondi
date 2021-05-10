import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";

import { useCookies } from "react-cookie";
import ReactTooltip from "react-tooltip";

import pageAction from "../../redux/page/actions";

import { DEV_API_PREFIX, PROD_API_PREFIX } from "../../helpers/constant";
const { REACT_APP_BUILD_MODE } = process.env;

const classNames = require("classnames");

export default function SlotDetail() {
  const dispatch = useDispatch();
  const history = useHistory();

  // eslint-disable-next-line
  const [cookies, setCookie] = useCookies(["private"]);

  const profile = useSelector((state) => state.Auth.profile);
  const program = useSelector((state) => state.Page.program);
  const slotDetail = useSelector((state) => state.Page.slotDetail);
  const iProfile = useSelector((state) => state.Page.iProfile);

  const currency = useSelector((state) => state.Page.currency);
  const currencyRate = useSelector((state) => state.Page.currencyRate);

  const [copied, setCopied] = useState(false);
  // const [giftAmount, setGiftAmount] = useState(0);
  // const [missedAmount, setMissedAmount] = useState(0);
  const [giftAndMissed, setGiftAndMissed] = useState({ gift: 0, missed: 0 });
  const [prevNext, setPrevNext] = useState({ prev: 0, next: 0 });

  const levels = [
    "lv1",
    "lv2",
    "lv3",
    "lv4",
    "lv5",
    "lv6",
    "lv7",
    "lv8",
    "lv9",
    "lv10",
    "lv11",
    "lv12",
  ];

  useEffect(() => {
    return () => {
      dispatch({ type: pageAction.INIT_SLOT_DETAIL });
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (copied) {
      toast("Copied to clipboard!", { type: toast.TYPE.INFO });
      setCopied(false);
    }
  }, [copied]);

  useEffect(() => {
    if (slotDetail) {
      const giftMissed = slotDetail.transactions.data.reduce(
        (res, transaction) => {
          let result = {
            gift: res.gift + transaction.type === "gift" ? transaction.eth : 0,
            missed:
              res.missed + transaction.type === "missed" ? transaction.eth : 0,
          };
          return result;
        },
        { gift: 0, missed: 0 }
      );
      setGiftAndMissed(giftMissed);
    }
  }, [slotDetail]);

  useEffect(() => {
    if (program) {
      let next = (program.level % 12) + 1;
      let prev = program.level === 1 ? 12 : program.level - 1;
      setPrevNext({ prev, next });
    }
  }, [program]);

  const [x3Children, setX3Children] = useState(null);
  const [x6Children, setX6Children] = useState(null);

  const [currentChildPartners, setCurrentChildPartners] = useState(null);
  const [currentChildPartnersX6, setCurrentChildPartnersX6] = useState(null);

  useEffect(() => {
    if (profile && program && !iProfile) {
      if (program.matrix === "x3")
        setX3Children(
          profile.x3Matrix[levels[program.level - 1]]["childItems"]
        );
      else if (program.matrix === "x4") {
        setX6Children(
          profile.x6Matrix[levels[program.level - 1]]["childItems"]
        );
      }
    }
    if (iProfile && program) {
      if (program.matrix === "x3")
        setX3Children(
          iProfile.x3Matrix[levels[program.level - 1]]["childItems"]
        );
      else if (program.matrix === "x4") {
        setX6Children(
          iProfile.x6Matrix[levels[program.level - 1]]["childItems"]
        );
      }
    }
  }, [profile, program, levels, iProfile]);

  useEffect(() => {
    async function fetchData() {
      if (x3Children && program) {
        let childPartners = [];

        childPartners.push(
          x3Children[0].address
            ? await getChildPartners(
                x3Children[0].address,
                program.matrix === "x3" ? 1 : 2,
                program.level
              )
            : 0
        );
        childPartners.push(
          x3Children[1].address
            ? await getChildPartners(
                x3Children[1].address,
                program.matrix === "x3" ? 1 : 2,
                program.level
              )
            : 0
        );
        childPartners.push(
          x3Children[2].address
            ? await getChildPartners(
                x3Children[2].address,
                program.matrix === "x3" ? 1 : 2,
                program.level
              )
            : 0
        );
        setCurrentChildPartners(childPartners);
      }

      if (x6Children && program) {
        let left = [];
        let right = [];

        left.push(
          x6Children.left[0].address
            ? await getChildPartners(
                x6Children.left[0].address,
                program.matrix === "x3" ? 1 : 2,
                program.level
              )
            : 0
        );
        left.push(
          x6Children.left[1].address
            ? await getChildPartners(
                x6Children.left[1].address,
                program.matrix === "x3" ? 1 : 2,
                program.level
              )
            : 0
        );
        left.push(
          x6Children.left[2].address
            ? await getChildPartners(
                x6Children.left[2].address,
                program.matrix === "x3" ? 1 : 2,
                program.level
              )
            : 0
        );

        right.push(
          x6Children.right[0].address
            ? await getChildPartners(
                x6Children.right[0].address,
                program.matrix === "x3" ? 1 : 2,
                program.level
              )
            : 0
        );
        right.push(
          x6Children.right[1].address
            ? await getChildPartners(
                x6Children.right[1].address,
                program.matrix === "x3" ? 1 : 2,
                program.level
              )
            : 0
        );
        right.push(
          x6Children.right[2].address
            ? await getChildPartners(
                x6Children.right[2].address,
                program.matrix === "x3" ? 1 : 2,
                program.level
              )
            : 0
        );
        setCurrentChildPartnersX6({ left, right });
      }
    }
    fetchData();
  }, [x3Children, x6Children, program]);

  const [paginatedData, setPaginatedData] = useState([]);
  useEffect(() => {
    if (slotDetail) {
      setPaginatedData(
        slotDetail.transactions.data
          .slice(0, 25)
          .sort((a, b) => b.date - a.date)
      );
    }
  }, [slotDetail]);

  const handlePageClick = (data) => {
    if (slotDetail) {
      let paginated = slotDetail.transactions.data
        .slice(data.selected * 25, (data.selected + 1) * 25)
        .sort((a, b) => b.date - a.date);
      setPaginatedData(paginated);
    }
  };

  const onHandleRedirect = (address = null, matrix, level) => {
    // address === null, current user
    // address != null, selected user
    if (address && address !== "0") {
      dispatch(
        pageAction.slotDetailRequest({
          address,
          matrix: matrix === "x3" ? 1 : 2,
          level,
        })
      );
      dispatch(pageAction.getUserProfile(address));
      setHistorySlots(null);
      setHistorySlotsX6(null);
    }
  };

  const onHandleUserMain = (uid) => {
    dispatch(pageAction.getUserProfile(uid));
    history.push("/");
  };

  const toFixedConverter = (number, precision) => {
    return number.toFixed(precision);
  };

  // const getIdFromAddress = async (address) => {
  //   let apiPrefix = "";

  //   if (REACT_APP_BUILD_MODE === "development") {
  //     apiPrefix = DEV_API_PREFIX;
  //   } else if (REACT_APP_BUILD_MODE === "production") {
  //     apiPrefix = PROD_API_PREFIX;
  //   }

  //   let response = await fetch(apiPrefix + "/profile?address=" + address);

  //   const data = await response.json();

  //   if (data.code === "200") {
  //     return data.value.id;
  //   } else return Math.floor(Math.random() * 10);
  // };

  const lastStatus = (transaction) => {
    if (transaction.type === "reinvest") {
      return <td className="color-green">Reopen</td>;
    }
    if (transaction.type === "lost") {
      return <td className="color-red">Missed</td>;
    }
    if (transaction.type === "higher") {
      return (
        <td className="color-green" style={{ color: "#3ab39a" }}>
          Higher
        </td>
      );
    }
    if (
      transaction.type === "partner" ||
      transaction.type === "bottom" ||
      transaction.type === "gifts"
    ) {
      return (
        <td>
          {`${transaction.eth}/${parseInt(
            transaction.eth * currencyRate[currency]
          )} ${currency}`}
        </td>
      );
    }
  };

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

  // const getIdFromAddress = (address) => {
  //   let apiPrefix = "";
  //   if (REACT_APP_BUILD_MODE === "development") {
  //     apiPrefix = DEV_API_PREFIX;
  //   } else if (REACT_APP_BUILD_MODE === "production") {
  //     apiPrefix = PROD_API_PREFIX;
  //   }
  //   fetch(apiPrefix + "/users?address=" + address)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if (data.code === "200") {
  //         return data.value.id;
  //       } else {
  //         return 0;
  //       }
  //     });
  // };

  const [historySlots, setHistorySlots] = useState(null); // number:0, uIdList:[]

  const onHandleHistory = async (arrow) => {
    if (slotDetail) {
      const historyList = slotDetail.history;
      const historyLength = historyList.length - 1;
      let number = historySlots ? historySlots.number : 0;
      if (historySlots) {
        if (arrow === "up") {
          if (number < historyLength) number++;
          else number = 0;
        } else if (arrow === "down") {
          if (number > 0) number--;
          else number = historyLength;
        }
      }
      let uIdList = [];
      uIdList.push(
        historyList[number].pos1.address
          ? await getIdFromAddress(historyList[number].pos1.address)
          : 0
      );
      uIdList.push(
        historyList[number].pos2.address
          ? await getIdFromAddress(historyList[number].pos2.address)
          : 0
      );
      uIdList.push(
        historyList[number].pos3.address
          ? await getIdFromAddress(historyList[number].pos3.address)
          : 0
      );

      let childPartners = [];

      childPartners.push(
        historyList[number].pos1.address
          ? await getChildPartners(
              historyList[number].pos1.address,
              program.matrix === "x3" ? 1 : 2,
              program.level
            )
          : 0
      );
      childPartners.push(
        historyList[number].pos2.address
          ? await getChildPartners(
              historyList[number].pos2.address,
              program.matrix === "x3" ? 1 : 2,
              program.level
            )
          : 0
      );
      childPartners.push(
        historyList[number].pos3.address
          ? await getChildPartners(
              historyList[number].pos3.address,
              program.matrix === "x3" ? 1 : 2,
              program.level
            )
          : 0
      );

      setHistorySlots({ number, uIdList, childPartners });
    }
  };

  const [historySlotsX6, setHistorySlotsX6] = useState(null); // number:0, left:[], right:[]
  const onHandleHistoryX6 = async (arrow) => {
    if (slotDetail) {
      const historyList = slotDetail.history;
      const historyLength = historyList.length - 1;
      let number = historySlotsX6 ? historySlotsX6.number : 0;
      if (historySlotsX6) {
        if (arrow === "up") {
          if (number < historyLength) number++;
          else number = 0;
        } else if (arrow === "down") {
          if (number > 0) number--;
          else number = historyLength;
        }
      }

      let left = [],
        right = [];

      left.push(
        historyList[number].pos1.address
          ? await getIdFromAddress(historyList[number].pos1.address)
          : 0
      );
      left.push(
        historyList[number].pos3.address
          ? await getIdFromAddress(historyList[number].pos3.address)
          : 0
      );
      left.push(
        historyList[number].pos4.address
          ? await getIdFromAddress(historyList[number].pos4.address)
          : 0
      );

      right.push(
        historyList[number].pos2.address
          ? await getIdFromAddress(historyList[number].pos2.address)
          : 0
      );
      right.push(
        historyList[number].pos5.address
          ? await getIdFromAddress(historyList[number].pos5.address)
          : 0
      );
      right.push(
        historyList[number].pos6.address
          ? await getIdFromAddress(historyList[number].pos6.address)
          : 0
      );
      console.log({ number, left, right });

      let leftPartners = [];
      let rightPartners = [];

      leftPartners.push(
        historyList[number].pos1.address
          ? await getChildPartners(
              historyList[number].pos1.address,
              program.matrix === "x3" ? 1 : 2,
              program.level
            )
          : 0
      );
      leftPartners.push(
        historyList[number].pos2.address
          ? await getChildPartners(
              historyList[number].pos2.address,
              program.matrix === "x3" ? 1 : 2,
              program.level
            )
          : 0
      );
      leftPartners.push(
        historyList[number].pos3.address
          ? await getChildPartners(
              historyList[number].pos3.address,
              program.matrix === "x3" ? 1 : 2,
              program.level
            )
          : 0
      );

      rightPartners.push(
        historyList[number].pos4.address
          ? await getChildPartners(
              historyList[number].pos4.address,
              program.matrix === "x3" ? 1 : 2,
              program.level
            )
          : 0
      );
      rightPartners.push(
        historyList[number].pos5.address
          ? await getChildPartners(
              historyList[number].pos5.address,
              program.matrix === "x3" ? 1 : 2,
              program.level
            )
          : 0
      );
      rightPartners.push(
        historyList[number].pos6.address
          ? await getChildPartners(
              historyList[number].pos6.address,
              program.matrix === "x3" ? 1 : 2,
              program.level
            )
          : 0
      );

      setHistorySlotsX6({ number, left, right, leftPartners, rightPartners });
    }
  };

  const getChildPartners = async (address, matrix, level) => {
    let apiPrefix = "";
    if (REACT_APP_BUILD_MODE === "development") {
      apiPrefix = DEV_API_PREFIX;
    } else if (REACT_APP_BUILD_MODE === "production") {
      apiPrefix = PROD_API_PREFIX;
    }
    let response = await fetch(
      `${apiPrefix}/getreinvestpartnerscnt?address=${address}&matrix=${matrix}&level=${level}`
    );
    const data = await response.json();
    if (data.code === "200") {
      return [data.value.partnersCount, data.value.reinvestCount];
    } else return 0;
  };

  // const currentChildPartners = async (hover = false, address) => {
  //   const partnersData = await getChildPartners(
  //     address,
  //     program.matrix === "x3" ? 1 : 2,
  //     program.level
  //   );
  //   if (hover) {
  //     //
  //   } else {
  //     return (
  //       <div className="slot_x3_detail_partners">
  //         <i className="icon icon-partners-blue icon_xs"></i>
  //         &nbsp;&nbsp;
  //         {partnersData[0]}
  //       </div>
  //     );
  //   }
  // };

  return (
    <>
      <div className="page__section" id="slot__detail">
        <div className="page__block block upgrage">
          <div className="block__body">
            <div className="upgrage__logo">
              {program && program.matrix === "x3" ? (
                <img
                  src={require("../../assets/images/Dondi_X3.png")}
                  alt="program x3"
                />
              ) : (
                ""
              )}
              {program && program.matrix === "x4" ? (
                <img
                  src={require("../../assets/images/Dondi_X6.png")}
                  alt="program x6"
                />
              ) : (
                ""
              )}
            </div>
            <div className="upgrage__wrap">
              <div className="upgrage__inner">
                <div
                  className="upgrage__lvl"
                  onClick={() =>
                    onHandleRedirect(
                      slotDetail &&
                        slotDetail.rootInfo.referrer.address !==
                          "0x0000000000000000000000000000000000000000"
                        ? slotDetail.rootInfo.referrer.id
                        : "",
                      program.matrix,
                      program.level
                    )
                  }
                >
                  {slotDetail &&
                    slotDetail.rootInfo.referrer.address !==
                      "0x0000000000000000000000000000000000000000" && (
                      <>
                        <i className="icon icon-arrow-top-gray"></i>
                        <var>
                          ID
                          {slotDetail.rootInfo.referrer.id}
                        </var>
                      </>
                    )}
                </div>
                <div className="upgrage__wallet wallet">
                  <div className="wallet__number">
                    {program ? program.level : ""}
                  </div>
                  <div className="wallet__text">
                    {slotDetail && (
                      <div
                        className="wallet__id"
                        onClick={() => onHandleUserMain(slotDetail.rootInfo.id)}
                      >
                        ID{" "}
                        {cookies.private === "false" || !cookies.private
                          ? slotDetail.rootInfo.id
                          : "***"}
                      </div>
                    )}
                    <div className="wallet__eth">
                      <i className="icon icon-wallet"></i>{" "}
                      {slotDetail ? slotDetail.balance : ""} ETH
                    </div>
                    <div className="wallet__count">
                      {currencyRate && slotDetail
                        ? toFixedConverter(
                            slotDetail.balance * currencyRate[currency],
                            0
                          )
                        : 0}{" "}
                      {currency}
                    </div>
                  </div>
                </div>
                {program && program.matrix === "x4" ? (
                  <div className="upgrage__dots upgrage__dots_2-3 row">
                    {x6Children && !historySlotsX6 && (
                      <>
                        <div
                          className={classNames("upgrage__dot pointer", {
                            [x6Children["left"][0]["status"]]:
                              x6Children["left"][0]["id"],
                          })}
                          onClick={() =>
                            onHandleRedirect(
                              x6Children["left"][0]["id"],
                              program.matrix,
                              program.level
                            )
                          }
                          data-tip
                          data-for={`x6CurrentInfo-left0`}
                        >
                          <div className="upgrage__dot-up">
                            <i className="icon icon-arrow-top-white"></i>
                          </div>
                          <div className="upgrage__dot-count">
                            <i className="icon icon-user"></i>
                            <var>
                              {x6Children ? x6Children["left"][0]["id"] : ""}
                            </var>
                          </div>
                          <ReactTooltip id={`x6CurrentInfo-left0`}>
                            <div style={{ color: "white" }}>
                              <i className="icon icon-partners-blue icon_xs"></i>
                              &nbsp;&nbsp;
                              <span>
                                {currentChildPartnersX6
                                  ? currentChildPartnersX6.left[0][0]
                                  : 0}
                              </span>
                              <br />
                              <br />
                              <i className="icon icon-reinvest icon_xs"></i>
                              &nbsp;&nbsp;
                              <span>
                                {currentChildPartnersX6
                                  ? currentChildPartnersX6.left[0][1]
                                  : 0}
                              </span>
                            </div>
                          </ReactTooltip>
                        </div>
                        <div
                          className={classNames("upgrage__dot pointer", {
                            [x6Children["right"][0]["status"]]:
                              x6Children["right"][0]["id"],
                          })}
                          onClick={() =>
                            onHandleRedirect(
                              x6Children["right"][0]["id"],
                              program.matrix,
                              program.level
                            )
                          }
                          data-tip
                          data-for={`x6CurrentInfo-right0`}
                        >
                          <div className="upgrage__dot-up">
                            <i className="icon icon-arrow-top-white"></i>
                          </div>
                          <div className="upgrage__dot-count">
                            <i className="icon icon-user"></i>
                            <var>
                              {x6Children ? x6Children["right"][0]["id"] : ""}
                            </var>
                          </div>
                          <ReactTooltip id={`x6CurrentInfo-right0`}>
                            <div style={{ color: "white" }}>
                              <i className="icon icon-partners-blue icon_xs"></i>
                              &nbsp;&nbsp;
                              <span>
                                {currentChildPartnersX6
                                  ? currentChildPartnersX6.right[0][0]
                                  : 0}
                              </span>
                              <br />
                              <br />
                              <i className="icon icon-reinvest icon_xs"></i>
                              &nbsp;&nbsp;
                              <span>
                                {currentChildPartnersX6
                                  ? currentChildPartnersX6.right[0][1]
                                  : 0}
                              </span>
                            </div>
                          </ReactTooltip>
                        </div>
                        <div
                          className={classNames("upgrage__dot pointer", {
                            [x6Children["left"][1]["status"]]:
                              x6Children["left"][1]["id"],
                          })}
                          onClick={() =>
                            onHandleRedirect(
                              x6Children["left"][1]["id"],
                              program.matrix,
                              program.level
                            )
                          }
                          data-tip
                          data-for={`x6CurrentInfo-left1`}
                        >
                          <div className="upgrage__dot-count">
                            <i className="icon icon-user"></i>
                            <var>
                              {x6Children ? x6Children["left"][1]["id"] : ""}
                            </var>
                          </div>
                          <ReactTooltip id={`x6CurrentInfo-left1`}>
                            <div style={{ color: "white" }}>
                              <i className="icon icon-partners-blue icon_xs"></i>
                              &nbsp;&nbsp;
                              <span>
                                {currentChildPartnersX6
                                  ? currentChildPartnersX6.left[1][0]
                                  : 0}
                              </span>
                              <br />
                              <br />
                              <i className="icon icon-reinvest icon_xs"></i>
                              &nbsp;&nbsp;
                              <span>
                                {currentChildPartnersX6
                                  ? currentChildPartnersX6.left[1][1]
                                  : 0}
                              </span>
                            </div>
                          </ReactTooltip>
                        </div>
                        <div
                          className={classNames("upgrage__dot pointer", {
                            [x6Children["left"][2]["status"]]:
                              x6Children["left"][2]["id"],
                          })}
                          onClick={() =>
                            onHandleRedirect(
                              x6Children["left"][2]["id"],
                              program.matrix,
                              program.level
                            )
                          }
                          data-tip
                          data-for={`x6CurrentInfo-left2`}
                        >
                          <div className="upgrage__dot-count">
                            <i className="icon icon-user"></i>
                            <var>
                              {x6Children ? x6Children["left"][2]["id"] : ""}
                            </var>
                          </div>
                          <ReactTooltip id={`x6CurrentInfo-left2`}>
                            <div style={{ color: "white" }}>
                              <i className="icon icon-partners-blue icon_xs"></i>
                              &nbsp;&nbsp;
                              <span>
                                {currentChildPartnersX6
                                  ? currentChildPartnersX6.left[2][0]
                                  : 0}
                              </span>
                              <br />
                              <br />
                              <i className="icon icon-reinvest icon_xs"></i>
                              &nbsp;&nbsp;
                              <span>
                                {currentChildPartnersX6
                                  ? currentChildPartnersX6.left[2][1]
                                  : 0}
                              </span>
                            </div>
                          </ReactTooltip>
                        </div>
                        <div
                          className={classNames("upgrage__dot pointer", {
                            [x6Children["right"][1]["status"]]:
                              x6Children["right"][1]["id"],
                          })}
                          onClick={() =>
                            onHandleRedirect(
                              x6Children["right"][1]["id"],
                              program.matrix,
                              program.level
                            )
                          }
                          data-tip
                          data-for={`x6CurrentInfo-right1`}
                        >
                          <div className="upgrage__dot-count">
                            <i className="icon icon-user"></i>
                            <var>
                              {x6Children ? x6Children["right"][1]["id"] : ""}
                            </var>
                          </div>
                          <ReactTooltip id={`x6CurrentInfo-right1`}>
                            <div style={{ color: "white" }}>
                              <i className="icon icon-partners-blue icon_xs"></i>
                              &nbsp;&nbsp;
                              <span>
                                {currentChildPartnersX6
                                  ? currentChildPartnersX6.right[1][0]
                                  : 0}
                              </span>
                              <br />
                              <br />
                              <i className="icon icon-reinvest icon_xs"></i>
                              &nbsp;&nbsp;
                              <span>
                                {currentChildPartnersX6
                                  ? currentChildPartnersX6.right[1][1]
                                  : 0}
                              </span>
                            </div>
                          </ReactTooltip>
                        </div>
                        <div
                          className={classNames("upgrage__dot pointer", {
                            [x6Children["right"][2]["status"]]:
                              x6Children["right"][2]["id"],
                          })}
                          onClick={() =>
                            onHandleRedirect(
                              x6Children["right"][2]["id"],
                              program.matrix,
                              program.level
                            )
                          }
                          data-tip
                          data-for={`x6CurrentInfo-right2`}
                        >
                          <div className="upgrage__dot-count">
                            <i className="icon icon-user"></i>
                            <var>
                              {x6Children ? x6Children["right"][2]["id"] : ""}
                            </var>
                          </div>
                          <ReactTooltip id={`x6CurrentInfo-right2`}>
                            <div style={{ color: "white" }}>
                              <i className="icon icon-partners-blue icon_xs"></i>
                              &nbsp;&nbsp;
                              <span>
                                {currentChildPartnersX6
                                  ? currentChildPartnersX6.right[2][0]
                                  : 0}
                              </span>
                              <br />
                              <br />
                              <i className="icon icon-reinvest icon_xs"></i>
                              &nbsp;&nbsp;
                              <span>
                                {currentChildPartnersX6
                                  ? currentChildPartnersX6.right[2][1]
                                  : 0}
                              </span>
                            </div>
                          </ReactTooltip>
                        </div>
                      </>
                    )}
                    {historySlotsX6 && (
                      <>
                        <div
                          className={classNames("upgrage__dot pointer", {
                            upgrage__dot_selected: historySlotsX6.left[0],
                          })}
                          onClick={() =>
                            onHandleRedirect(
                              historySlotsX6.left[0],
                              program.matrix,
                              program.level
                            )
                          }
                          data-tip
                          data-for={`x6HistoryInfo-left0`}
                        >
                          <div className="upgrage__dot-up">
                            <i className="icon icon-arrow-top-white"></i>
                          </div>
                          <div className="upgrage__dot-count">
                            <i className="icon icon-user"></i>
                            <var>
                              {historySlotsX6.left[0]
                                ? historySlotsX6.left[0]
                                : ""}
                            </var>
                          </div>
                          <ReactTooltip id={`x6HistoryInfo-left0`}>
                            <>
                              <i className="icon icon-partners-blue icon_xs"></i>
                              &nbsp;&nbsp;
                              {historySlotsX6.leftPartners[0]
                                ? historySlotsX6.leftPartners[0][0]
                                : 0}
                              <br />
                              <br />
                              <i className="icon icon-reinvest icon_xs"></i>
                              &nbsp;&nbsp;
                              {historySlotsX6.leftPartners[0]
                                ? historySlotsX6.leftPartners[0][1]
                                : 0}
                            </>
                          </ReactTooltip>
                        </div>
                        <div
                          className={classNames("upgrage__dot pointer", {
                            upgrage__dot_selected: historySlotsX6.right[0],
                          })}
                          onClick={() =>
                            onHandleRedirect(
                              historySlotsX6.right[0],
                              program.matrix,
                              program.level
                            )
                          }
                          data-tip
                          data-for={`x6HistoryInfo-right0`}
                        >
                          <div className="upgrage__dot-up">
                            <i className="icon icon-arrow-top-white"></i>
                          </div>
                          <div className="upgrage__dot-count">
                            <i className="icon icon-user"></i>
                            <var>
                              {historySlotsX6.right[0]
                                ? historySlotsX6.right[0]
                                : ""}
                            </var>
                          </div>
                          <ReactTooltip id={`x6HistoryInfo-right0`}>
                            <>
                              <i className="icon icon-partners-blue icon_xs"></i>
                              &nbsp;&nbsp;
                              {historySlotsX6.rightPartners[0]
                                ? historySlotsX6.rightPartners[0][0]
                                : 0}
                              <br />
                              <br />
                              <i className="icon icon-reinvest icon_xs"></i>
                              &nbsp;&nbsp;
                              {historySlotsX6.rightPartners[0]
                                ? historySlotsX6.rightPartners[0][1]
                                : 0}
                            </>
                          </ReactTooltip>
                        </div>
                        <div
                          className={classNames("upgrage__dot pointer", {
                            upgrage__dot_selected: historySlotsX6.left[1],
                          })}
                          onClick={() =>
                            onHandleRedirect(
                              historySlotsX6.left[1],
                              program.matrix,
                              program.level
                            )
                          }
                          data-tip
                          data-for={`x6HistoryInfo-left1`}
                        >
                          <div className="upgrage__dot-count">
                            <i className="icon icon-user"></i>
                            <var>
                              {historySlotsX6.left[1]
                                ? historySlotsX6.left[1]
                                : ""}
                            </var>
                          </div>
                          <ReactTooltip id={`x6HistoryInfo-left1`}>
                            <>
                              <i className="icon icon-partners-blue icon_xs"></i>
                              &nbsp;&nbsp;
                              {historySlotsX6.leftPartners[1]
                                ? historySlotsX6.leftPartners[1][0]
                                : 0}
                              <br />
                              <br />
                              <i className="icon icon-reinvest icon_xs"></i>
                              &nbsp;&nbsp;
                              {historySlotsX6.leftPartners[1]
                                ? historySlotsX6.leftPartners[1][1]
                                : 0}
                            </>
                          </ReactTooltip>
                        </div>
                        <div
                          className={classNames("upgrage__dot pointer", {
                            upgrage__dot_selected: historySlotsX6.left[2],
                          })}
                          onClick={() =>
                            onHandleRedirect(
                              historySlotsX6.left[2],
                              program.matrix,
                              program.level
                            )
                          }
                          data-tip
                          data-for={`x6HistoryInfo-left2`}
                        >
                          <div className="upgrage__dot-count">
                            <i className="icon icon-user"></i>
                            <var>
                              {historySlotsX6.left[2]
                                ? historySlotsX6.left[2]
                                : ""}
                            </var>
                          </div>
                          <ReactTooltip id={`x6HistoryInfo-left2`}>
                            <>
                              <i className="icon icon-partners-blue icon_xs"></i>
                              &nbsp;&nbsp;
                              {historySlotsX6.leftPartners[2]
                                ? historySlotsX6.leftPartners[2][0]
                                : 0}
                              <br />
                              <br />
                              <i className="icon icon-reinvest icon_xs"></i>
                              &nbsp;&nbsp;
                              {historySlotsX6.leftPartners[2]
                                ? historySlotsX6.leftPartners[2][1]
                                : 0}
                            </>
                          </ReactTooltip>
                        </div>
                        <div
                          className={classNames("upgrage__dot pointer", {
                            upgrage__dot_selected: historySlotsX6.right[1],
                          })}
                          onClick={() =>
                            onHandleRedirect(
                              historySlotsX6.right[1],
                              program.matrix,
                              program.level
                            )
                          }
                          data-tip
                          data-for={`x6HistoryInfo-right1`}
                        >
                          <div className="upgrage__dot-count">
                            <i className="icon icon-user"></i>
                            <var>
                              {historySlotsX6.right[1]
                                ? historySlotsX6.right[1]
                                : ""}
                            </var>
                          </div>
                          <ReactTooltip id={`x6HistoryInfo-right1`}>
                            <>
                              <i className="icon icon-partners-blue icon_xs"></i>
                              &nbsp;&nbsp;
                              {historySlotsX6.rightPartners[1]
                                ? historySlotsX6.rightPartners[1][0]
                                : 0}
                              <br />
                              <br />
                              <i className="icon icon-reinvest icon_xs"></i>
                              &nbsp;&nbsp;
                              {historySlotsX6.rightPartners[1]
                                ? historySlotsX6.rightPartners[1][1]
                                : 0}
                            </>
                          </ReactTooltip>
                        </div>
                        <div
                          className={classNames("upgrage__dot pointer", {
                            upgrage__dot_selected: historySlotsX6.right[2],
                          })}
                          onClick={() =>
                            onHandleRedirect(
                              historySlotsX6.right[2],
                              program.matrix,
                              program.level
                            )
                          }
                          data-tip
                          data-for={`x6HistoryInfo-right2`}
                        >
                          <div className="upgrage__dot-count">
                            <i className="icon icon-user"></i>
                            <var>
                              {historySlotsX6.right[2]
                                ? historySlotsX6.right[2]
                                : ""}
                            </var>
                          </div>
                          <ReactTooltip id={`x6HistoryInfo-right2`}>
                            <>
                              <i className="icon icon-partners-blue icon_xs"></i>
                              &nbsp;&nbsp;
                              {historySlotsX6.rightPartners[2]
                                ? historySlotsX6.rightPartners[2][0]
                                : 0}
                              <br />
                              <br />
                              <i className="icon icon-reinvest icon_xs"></i>
                              &nbsp;&nbsp;
                              {historySlotsX6.rightPartners[2]
                                ? historySlotsX6.rightPartners[2][1]
                                : 0}
                            </>
                          </ReactTooltip>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="buy__dots buy__dots_3 row">
                    {x3Children &&
                      !historySlots &&
                      x3Children.map((child, id) => {
                        return (
                          <div
                            key={id}
                            className={classNames("buy__dot", {
                              buy__dot_partner: child.status === "partner",
                              buy__dot_ahead: child.status === "ahead",
                            })}
                            onClick={() =>
                              onHandleRedirect(
                                child.id,
                                program.matrix,
                                program.level
                              )
                            }
                            data-tip
                            data-for={`currentInfo${id}`}
                          >
                            <div className="upgrage__dot-count">
                              <i className="icon icon-user"></i>
                              <var>{child.id}</var>
                            </div>
                            <div className="slot_x3_detail_partners">
                              <i className="icon icon-partners-blue icon_xs"></i>
                              &nbsp;&nbsp;
                              {currentChildPartners
                                ? currentChildPartners[id][0]
                                  ? currentChildPartners[id][0]
                                  : 0
                                : 0}
                            </div>
                            <ReactTooltip id={`currentInfo${id}`}>
                              <div style={{ color: "white" }}>
                                <i className="icon icon-partners-blue icon_xs"></i>
                                &nbsp;&nbsp;
                                <span>
                                  {currentChildPartners
                                    ? currentChildPartners[id][0]
                                    : 0}
                                </span>
                                <br />
                                <br />
                                <i className="icon icon-reinvest icon_xs"></i>
                                &nbsp;&nbsp;
                                <span>
                                  {currentChildPartners
                                    ? currentChildPartners[id][1]
                                    : 0}
                                </span>
                              </div>
                            </ReactTooltip>
                          </div>
                        );
                      })}
                    {historySlots &&
                      historySlots.uIdList.map((uId, id) => {
                        return (
                          <div
                            key={id}
                            className={classNames("buy__dot", {
                              buy__dot_selected: uId,
                              upgrage__dot_selected: uId,
                            })}
                            onClick={() =>
                              onHandleRedirect(
                                uId,
                                program.matrix,
                                program.level
                              )
                            }
                            data-tip
                            data-for={`childInfo${id}`}
                          >
                            <div className="upgrage__dot-count">
                              <i className="icon icon-user"></i>
                              <var>{uId}</var>
                            </div>
                            <div className="slot_x3_detail_partners">
                              <i className="icon icon-partners-blue icon_xs"></i>
                              &nbsp;&nbsp;
                              {historySlots.childPartners[id]
                                ? historySlots.childPartners[id][0]
                                : 0}
                            </div>
                            <ReactTooltip id={`childInfo${id}`}>
                              <>
                                <i className="icon icon-partners-blue icon_xs"></i>
                                &nbsp;&nbsp;
                                {historySlots.childPartners[id]
                                  ? historySlots.childPartners[id][0]
                                  : 0}
                                <br />
                                <br />
                                <i className="icon icon-reinvest icon_xs"></i>
                                &nbsp;&nbsp;
                                {historySlots.childPartners[id]
                                  ? historySlots.childPartners[id][1]
                                  : 0}
                              </>
                            </ReactTooltip>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
              <div className="upgrage__data">
                <div className="upgrage__settings">
                  {program && program.matrix === "x3" && (
                    <div className="upgrage__slider">
                      <div
                        className="history__arrow_up pointer"
                        onClick={() => onHandleHistory("up")}
                      >
                        ▲
                      </div>
                      <div className="upgrage__slider-list">
                        <div className="upgrage__slider-item">HISTORY</div>
                      </div>
                      <div
                        className="history__arrow_down pointer"
                        onClick={() => onHandleHistory("down")}
                      >
                        ▼
                      </div>
                      <div className="upgrage__slider-arrows"></div>
                    </div>
                  )}
                  {program && program.matrix === "x4" && (
                    <div className="upgrage__slider">
                      <div
                        className="history__arrow_up pointer"
                        onClick={() => onHandleHistoryX6("up")}
                      >
                        ▲
                      </div>
                      <div className="upgrage__slider-list">
                        <div className="upgrage__slider-item">HISTORY</div>
                      </div>
                      <div
                        className="history__arrow_down pointer"
                        onClick={() => onHandleHistoryX6("down")}
                      >
                        ▼
                      </div>
                      <div className="upgrage__slider-arrows"></div>
                    </div>
                  )}
                  <div className="upgrage__count">
                    <i className="icon icon-reinvest icon_xs"></i>
                    <var>
                      {historySlots && program.matrix === "x3"
                        ? `${historySlots.number + 1}/`
                        : ""}
                      {historySlotsX6 && program.matrix === "x4"
                        ? `${historySlotsX6.number + 1}/`
                        : ""}
                      {slotDetail ? slotDetail.history.length : ""}
                    </var>
                  </div>
                </div>
                <div className="upgrage__counts">
                  <div className="upgrage__counts-item">
                    <div className="upgrage__counts-icon">
                      <i className="icon icon-partners-blue icon_xs"></i>
                    </div>
                    <div className="upgrage__counts-number">
                      {slotDetail ? slotDetail.partnersCount : ""}
                    </div>
                  </div>
                  <div className="upgrage__counts-item">
                    <div className="upgrage__counts-icon">
                      <i className="icon icon-gift icon_sm"></i>
                    </div>
                    <div className="upgrage__counts-number">
                      {giftAndMissed ? giftAndMissed.gift : ""}
                    </div>
                  </div>
                  <div className="upgrage__counts-item">
                    <div className="upgrage__counts-icon">
                      <i className="icon icon-minus"></i>
                    </div>
                    <div className="upgrage__counts-number">
                      {giftAndMissed ? giftAndMissed.missed : ""}
                    </div>
                  </div>
                </div>
              </div>
              <div className="upgrage__arrows">
                <div
                  className="upgrage__arrow upgrage__arrow_prev btn btn_border-gray btn_md btn_radius icon_xs"
                  onClick={() =>
                    onHandleRedirect(
                      iProfile ? iProfile.address : profile.address,
                      program.matrix,
                      prevNext.prev
                    )
                  }
                >
                  <i className="icon icon-chevron-gray left"></i>
                  <var>{prevNext.prev}</var>
                </div>
                <div
                  className="upgrage__arrow upgrage__arrow_next btn btn_border-gray btn_md btn_radius icon_xs"
                  onClick={() =>
                    onHandleRedirect(
                      iProfile ? iProfile.address : profile.address,
                      program.matrix,
                      prevNext.next
                    )
                  }
                >
                  <var>{prevNext.next}</var>
                  <i className="icon icon-chevron-gray right"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="block__foot">
            <div className="buy__designations designations row">
              <div className="designations__col">
                <div className="designations__item">
                  <div className="designations__color designations__color_blue"></div>
                  <div className="designations__title">
                    PARTNER INVITED BY YOU
                  </div>
                </div>
                {program && program.matrix === "x4" && (
                  <div className="designations__item">
                    <div className="designations__color designations__color_blue-light"></div>
                    <div className="designations__title">BOTTOM OVERFLOW</div>
                  </div>
                )}
              </div>
              <div className="designations__col">
                {program && program.matrix === "x4" && (
                  <div className="designations__item">
                    <div className="designations__color designations__color_blue-dark"></div>
                    <div className="designations__title">OVERFLOW FROM UP</div>
                  </div>
                )}
                <div className="designations__item">
                  <div className="designations__color designations__color_pink"></div>
                  <div className="designations__title">
                    PARTNER WHO IS AHEAD OF HIS INVITER
                  </div>
                </div>
              </div>
              {program && program.matrix === "x4" && (
                <div className="designations__col">
                  <div className="designations__item designations__item_zero"></div>
                  <div className="designations__item">
                    <div className="designations__color designations__color_violet">
                      <i className="icon icon-arrow-top-white icon-xs"></i>
                    </div>
                    <div className="designations__title">
                      PAYMENT TO THE HIGHER
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="page__block block stat">
          <div className="block__body">
            <div className="stat__wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th className="c">Type</th>
                    <th>
                      Date
                      {/* <i className="icon icon icon-chevron-gray icon_xs"></i> */}
                    </th>
                    <th className="col-blue">ID</th>
                    <th>Wallet</th>
                    <th>ETH/{currency}</th>
                    {/* <th className="c">USD</th> */}
                  </tr>
                </thead>
                <tbody>
                  {paginatedData &&
                    paginatedData.map((transaction, id) => {
                      return (
                        <tr key={id}>
                          <td>
                            {transaction.type === "partner" ||
                            transaction.type === "bottom" ||
                            transaction.type === "ahead" ? (
                              <div
                                className={classNames("designations__color", {
                                  designations__color_blue:
                                    transaction.type === "partner",
                                  "designations__color_blue-light":
                                    transaction.type === "bottom",
                                  designations__color_pink:
                                    transaction.type === "ahead",
                                })}
                              ></div>
                            ) : (
                              <i
                                className={classNames("icon", {
                                  "icon-reinvest-green":
                                    transaction.type === "reinvest",
                                  "icon-gift": transaction.type === "gifts",
                                  "icon-minus": transaction.type === "lost",
                                  "icon-arrow-top-white":
                                    transaction.type === "higher",
                                })}
                                title={transaction.type}
                              ></i>
                            )}
                          </td>
                          <td>
                            {Intl.DateTimeFormat("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "2-digit",
                              hour: "numeric",
                              minute: "2-digit",
                              second: "2-digit",
                            }).format(transaction.date * 1000)}
                          </td>
                          <td
                            className="col-blue pointer"
                            onClick={() => onHandleUserMain(transaction.id)}
                          >
                            {transaction.id}
                          </td>
                          <td className="cp-wrap">
                            <u className="cp-btn">
                              <CopyToClipboard
                                text={transaction.address}
                                onCopy={() => setCopied(true)}
                              >
                                <span>
                                  <i className="icon icon-copy-gray icon_xs"></i>
                                  <i className="icon icon-copy-white icon_xs"></i>
                                </span>
                              </CopyToClipboard>
                            </u>
                            <u>
                              <a
                                href={`https://etherscan.io/tx/${transaction.transactionHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <i className="icon icon-link-gray icon_xs"></i>
                                <i className="icon icon-link-white icon_xs"></i>
                              </a>
                            </u>
                            <input
                              className="inpt cp-target"
                              type="text"
                              value={transaction.address}
                              readOnly="readonly"
                            />
                          </td>
                          {lastStatus(transaction)}
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
            <div className="stat__pagination pagination">
              <ReactPaginate
                previousLabel={"Prev"}
                nextLabel={"Next"}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={
                  slotDetail ? slotDetail.transactions.totalCount / 25 : 1
                }
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={(e) => handlePageClick(e)}
                containerClassName={"pagination"}
                subContainerClassName={"pages pagination"}
                activeClassName={"active"}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
