import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";

import pageActions from "../../redux/page/actions";

const classNames = require("classnames");

export default function Statistics() {
  const dispatch = useDispatch();
  const history = useHistory();
  const statisticsList = useSelector((state) => state.Page.statistics);
  // const currentPageNumber = useSelector(
  //   (state) => state.Page.currentStsPageNumber
  // );

  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(true);

  const [filterProgram, setFilterProgram] = useState("");
  const [filterSlot, setFilterSlot] = useState("");
  const [filterDirection, setFilterDirection] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterHash, setFilterHash] = useState("");

  useEffect(() => {
    if (copied) {
      toast("Copied to clipboard!", { type: toast.TYPE.INFO });
      setCopied(false);
    }
  }, [copied]);

  const onHandleFilterApply = (page = 1) => {
    dispatch(
      pageActions.getStatisticsFilterRequest({
        filterProgram,
        filterSlot,
        filterDirection,
        filterType,
        filterHash,
        page,
      })
    );
  };

  const onHandleFilterReset = (page = 1) => {
    dispatch(
      pageActions.getStatisticsFilterRequest({
        filterProgram: "",
        filterSlot: "",
        filterDirection: "",
        filterType: "",
        filterHash: "",
        page,
      })
    );

    setFilterProgram("");
    setFilterSlot("");
    setFilterDirection("");
    setFilterType("");
    setFilterHash("");
  };

  const onHandleUserMain = (uid) => {
    dispatch(pageActions.getUserProfile(uid));
    history.push("/");
  };

  useEffect(() => {
    onHandleFilterReset();
    // eslint-disable-next-line
  }, []);

  const [paginatedData, setPaginatedData] = useState([]);
  useEffect(() => {
    if (statisticsList) {
      setPaginatedData(
        statisticsList.data
          .slice(0, 25)
          .sort((a, b) => b.timestamp - a.timestamp)
      );
    }
  }, [statisticsList]);

  const handlePageClick = (data) => {
    if (statisticsList) {
      let paginated = statisticsList.data
        .slice(data.selected * 25, (data.selected + 1) * 25)
        .sort((a, b) => b.timestamp - a.timestamp);
      setPaginatedData(paginated);
    }
  };

  return (
    <>
      <div className="page__section" id="statistics">
        <div className="page__block block drop-wrap drop-wrap_open">
          <div className="block__head row i-mid">
            <div className="block__main-title title">Financial statistics</div>
            <div
              className="block__drop drop"
              onClick={() => setVisible(!visible)}
            >
              <div className="drop__title">Filters</div>
              <div className="drop__icon">
                <i className="icon icon-chevron-white icon_md"></i>
              </div>
            </div>
          </div>
          <div className="block__body">
            {visible && (
              <div className="block__filter filter drop-target">
                <div className="filter__list row">
                  <div className="filter__item">
                    <div className="filter__title">Matrix Type</div>
                    <div className="filter__wrap filter__select select select_border-gray select_md">
                      {/* <div className="select__inner">
                      <div className="select__block">
                        <div className="select__text"></div>
                        <div className="select__drop">
                          <i className="icon icon-chevron-gray icon_xs"></i>
                        </div>
                      </div>
                      <div className="select__list">
                        <div className="select__item" data-value="X3">
                          X3
                        </div>
                        <div className="select__item" data-value="X6">
                          X6
                        </div>
                      </div>
                    </div> */}
                      <div className="select__wrap">
                        <select
                          onChange={(e) => setFilterProgram(e.target.value)}
                          value={filterProgram}
                        >
                          <option value="">---</option>
                          <option value="1">x3</option>
                          <option value="2">x6</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="filter__item">
                    <div className="filter__title">Level</div>
                    <div className="filter__wrap filter__select select select_border-gray select_md">
                      {/* <div className="select__inner">
                      <div className="select__block">
                        <div className="select__text"></div>
                        <div className="select__drop">
                          <i className="icon icon-chevron-gray icon_xs"></i>
                        </div>
                      </div>
                      <div className="select__list">
                        <div className="select__item" data-value="1">
                          1
                        </div>
                        <div className="select__item" data-value="2">
                          2
                        </div>
                        <div className="select__item" data-value="3">
                          3
                        </div>
                        <div className="select__item" data-value="4">
                          4
                        </div>
                        <div className="select__item" data-value="5">
                          5
                        </div>
                      </div>
                    </div> */}
                      <div className="select__wrap">
                        <select
                          onChange={(e) => setFilterSlot(e.target.value)}
                          value={filterSlot}
                        >
                          <option value="">---</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                          <option value="7">7</option>
                          <option value="8">8</option>
                          <option value="9">9</option>
                          <option value="10">10</option>
                          <option value="11">11</option>
                          <option value="12">12</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="filter__item">
                    <div className="filter__title">Direction</div>
                    <div className="filter__wrap filter__select select select_border-gray select_md">
                      {/* <div className="select__inner">
                        <div className="select__block">
                          <div className="select__text"></div>
                          <div className="select__drop">
                            <i className="icon icon-chevron-gray icon_xs"></i>
                          </div>
                        </div>
                        <div className="select__list">
                          <div className="select__item" data-value="0">
                            All
                          </div>
                          <div className="select__item" data-value="1">
                            Inbox
                          </div>
                          <div className="select__item" data-value="2">
                            Outgoing
                          </div>
                          <div className="select__item" data-value="3">
                            Presents
                          </div>
                        </div>
                      </div> */}
                      <div className="select__wrap">
                        <select
                          onChange={(e) => setFilterDirection(e.target.value)}
                          value={filterDirection}
                        >
                          <option value="">---</option>
                          <option value="0">Income</option>
                          <option value="1">Outcome</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="filter__item">
                    <div className="filter__title">Transaction Type</div>
                    <div className="filter__wrap filter__select select select_border-gray select_md">
                      {/* <div className="select__inner">
                        <div className="select__block">
                          <div className="select__text"></div>
                          <div className="select__drop">
                            <i className="icon icon-chevron-gray icon_xs"></i>
                          </div>
                        </div>
                        <div className="select__list">
                          <div className="select__item" data-value="1">
                            Sold places
                          </div>
                          <div className="select__item" data-value="2">
                            Sold seats 1
                          </div>
                          <div className="select__item" data-value="3">
                            Sold seats 2
                          </div>
                          <div className="select__item" data-value="4">
                            Sold seats 3
                          </div>
                        </div>
                      </div> */}
                      <div className="select__wrap">
                        <select
                          onChange={(e) => setFilterType(e.target.value)}
                          value={filterType}
                        >
                          <option value="">---</option>
                          <option value="newUserPlaceEvent">Sold places</option>
                          <option value="upgrageEvent">Upgrades</option>
                          <option value="reinvestEvent">Upgrades</option>
                          <option value="missedEthReceive">Reopen</option>
                          <option value="missedEthReceive">Lost profits</option>
                          <option value="leadingPartnerToUpline">
                            Overtaking
                          </option>
                          <option value="sentExtraEthDividend">Gifts</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="filter__item filter__item_md">
                    <div className="filter__title">Hash search</div>
                    <div className="filter__wrap filter__input input input_border-gray input_radius input_md">
                      <input
                        className="input__area"
                        type="text"
                        placeholder="Hash input ..."
                        onChange={(e) => setFilterHash(e.target.value)}
                        value={filterHash}
                      />
                    </div>
                  </div>
                </div>
                <div className="filter__btns row">
                  <button
                    className="filter__btn btn btn_bg-gray btn_md btn_radius btn_hover-bg-gray"
                    onClick={() => onHandleFilterReset()}
                  >
                    Reset
                  </button>
                  <button
                    className="filter__btn btn btn_bg-violet btn_md btn_radius btn_hover-bg-gray"
                    onClick={() => onHandleFilterApply()}
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
            <div className="block__transactions trans">
              <div className="trans__title subtitle">
                LAST TRANSACTION (Total):
                <span className="color-yellow">
                  {" "}
                  {statisticsList ? statisticsList.total : 0}
                </span>
              </div>
              <div className="trans__wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="c">Type</th>
                      <th className="col-blue">ID</th>
                      <th className="c">Program</th>
                      <th className="c">Level</th>
                      <th className="col-turquoise">ETH</th>
                      <th>Hash</th>
                      <th>
                        Date
                        {/* <i className="icon icon icon-chevron-gray icon_xs"></i> */}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData &&
                      paginatedData.map((statistic, id) => {
                        return (
                          <tr key={id}>
                            <td>
                              {statistic.type === "Overtaking" ? (
                                <div
                                  className="designations__color designations__color_pink"
                                  title={"overtaking"}
                                ></div>
                              ) : (
                                <i
                                  className={classNames("icon", {
                                    "icon-wallet-in icon__small":
                                      statistic.type === "Part [Sold places]",
                                    "icon-wallet-out icon__small":
                                      statistic.type ===
                                      "Transit [Sold places]",
                                    "icon-arrow-top-white icon-xs":
                                      statistic.type === "Outbound [Upgrades]",
                                    "icon-reinvest-green":
                                      statistic.type === "Reopen",
                                    "icon-gift": statistic.type === "Gifts",
                                    "icon-minus":
                                      statistic.type === "Lost profits",
                                  })}
                                  title={statistic.type}
                                ></i>
                              )}
                            </td>
                            <td
                              className="pointer"
                              onClick={() => onHandleUserMain(statistic.id)}
                            >
                              {statistic.id}
                            </td>
                            <td>{statistic.matrix === "1" ? "X3" : "X6"}</td>
                            <td>{statistic.level}</td>
                            <td
                              className={classNames({
                                "color-pink": statistic.eth < 0,
                                "color-green2": statistic.eth > 0,
                              })}
                            >
                              {statistic.eth}
                            </td>
                            <td className="cp-wrap">
                              <u className="cp-btn">
                                <CopyToClipboard
                                  text={statistic.transactionHash}
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
                                  href={`https://etherscan.io/tx/${statistic.transactionHash}`}
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
                                value={statistic.transactionHash}
                                readOnly="readonly"
                              />
                            </td>
                            <td>
                              {Intl.DateTimeFormat("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "2-digit",
                                hour: "numeric",
                                minute: "2-digit",
                                second: "2-digit",
                              }).format(statistic.timestamp * 1000)}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
              <div className="trans__pagination pagination">
                <ReactPaginate
                  previousLabel={"Prev"}
                  nextLabel={"Next"}
                  breakLabel={"..."}
                  breakClassName={"break-me"}
                  pageCount={statisticsList ? statisticsList.totalPage : 1}
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
      </div>
    </>
  );
}
