import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";

import pageActions from "../../redux/page/actions";

export default function Partners() {
  const dispatch = useDispatch();
  const history = useHistory();

  // const userProfile = useSelector((state) => state.Auth.userProfile);
  const partnersList = useSelector((state) => state.Page.partners);
  // const currentPageNumber = useSelector(
  //   (state) => state.Page.currentPtnPageNumber
  // );

  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(true);

  const [filterProgram, setFilterProgram] = useState("");
  const [filterSlot, setFilterSlot] = useState("");
  const [filterId, setFilterId] = useState("");

  useEffect(() => {
    if (copied) {
      toast("Copied to clipboard!", { type: toast.TYPE.INFO });
      setCopied(false);
    }
  }, [copied]);

  const onHandleFilterApply = (page = 1) => {
    dispatch(
      pageActions.getPartnersFilterRequest({
        filterProgram,
        filterSlot,
        filterId,
        page,
      })
    );
  };

  const onHandleFilterReset = (page = 1) => {
    dispatch(
      pageActions.getPartnersFilterRequest({
        filterProgram: "",
        filterSlot: "",
        filterId: "",
        page,
      })
    );

    setFilterProgram("");
    setFilterSlot("");
    setFilterId("");
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
    if (partnersList) {
      setPaginatedData(
        partnersList.data.slice(0, 25).sort((a, b) => b.timestamp - a.timestamp)
      );
    }
  }, [partnersList]);

  const handlePageClick = (data) => {
    if (partnersList) {
      let paginated = partnersList.data
        .slice(data.selected * 25, (data.selected + 1) * 25)
        .sort((a, b) => b.timestamp - a.timestamp);
      setPaginatedData(paginated);
    }
  };

  return (
    <>
      {/* <Helmet>
        <meta charSet="utf-8" />
        <title>Partners - Dondi Decentralized Matrix</title>
      </Helmet> */}
      <div className="page__section" id="partners">
        <div className="page__block block drop-wrap drop-wrap_open">
          <div className="block__head row i-mid">
            <div className="block__main-title title">Partners</div>
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
                    <div className="filter__title">Program</div>
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
                    <div className="filter__title">Platform</div>
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
                    <div className="filter__title">Search by ID | Wallet</div>
                    <div className="filter__wrap filter__input input input_border-gray input_radius input_md">
                      {/* <input
                        className="input__area"
                        type="text"
                        placeholder="Enter ID / Wallet..."
                      /> */}
                      <input
                        type="text"
                        placeholder="Enter ID / Wallet..."
                        onChange={(e) => setFilterId(e.target.value)}
                        value={filterId}
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
            <div className="block__partners partners">
              {/* <div className="partners__title subtitle">AFFILIATE LINK</div>
              <div className="partners__copy row cp-wrap">
                <div className="partners__copy-input input input_border-gray input_md input_radius input_color-violet">
                  <div className="input__wrap">
                    <input
                      className="input__area cp-target"
                      type="text"
                      value={
                        userProfile
                          ? userProfile.affiliateLink
                          : "https://dondi.io/i/***"/
                      }
                      readOnly="readonly"
                    /> */}
              {/* <div className="input__icon">
                      <div className="icon icon-question-gray"></div>
                      <div className="icon icon-question-white"></div>
                    </div> */}
              {/* </div>
                </div>
                <CopyToClipboard
                  text={
                    userProfile
                      ? userProfile.affiliateLink
                      : "https://dondi.io/i/***"/
                  }
                  onCopy={() => setCopied(true)}
                > */}
              {/* <span className="partners__copy-btn btn btn_bg-violet btn_md btn_radius btn_hover-bg-gray cp-btn">
                    <u>
                      <i className="icon icon-copy-white icon_md"></i>
                      <i className="icon icon-copy-gray icon_md"></i>
                    </u>
                  </span>
                </CopyToClipboard>
              </div>
              <div className="partners__data">
                <ul>
                  <li>
                    <u>Referrals by link:</u>
                    <i>410</i>
                  </li>
                  <li>
                    <u>Number of registrations:</u>
                    <i>194</i>
                  </li>
                  <li>
                    <u>Registrations per week:</u>
                    <i>9</i>
                  </li>
                  <li>
                    <u>Registrations in 24 hours:</u>
                    <i>2</i>
                  </li>
                  <li>
                    <u>Partners in the structure:</u>
                    <i>26679</i>
                  </li>
                </ul>
              </div> */}
              <div className="partners__list pl">
                <div className="pl__wrap">
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="col-blue">ID</th>
                        <th>Registration date</th>
                        <th>Wallet</th>
                        <th className="c">X3</th>
                        <th className="c">x6</th>
                        <th className="col-turquoise">Profit</th>
                        <th className="c">Partners</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedData &&
                        paginatedData.map((partner, id) => {
                          return (
                            <tr key={id}>
                              <td
                                className="pointer"
                                onClick={() => onHandleUserMain(partner.id)}
                              >
                                {partner.id}
                              </td>
                              <td>
                                {Intl.DateTimeFormat("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "2-digit",
                                  hour: "numeric",
                                  minute: "2-digit",
                                  second: "2-digit",
                                }).format(partner.timestamp * 1000)}
                              </td>
                              <td className="cp-wrap">
                                <u className="cp-btn">
                                  <CopyToClipboard
                                    text={partner.wallet}
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
                                    href={`https://etherscan.io/address/${partner.wallet}`}
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
                                  value={partner.wallet}
                                  readOnly="readonly"
                                />
                              </td>
                              <td>{partner.x3}</td>
                              <td>{partner.x6}</td>
                              <td>
                                <i className="icon icon-eth-color"></i>
                                {partner.profit}
                              </td>
                              <td>
                                {partner.partners}
                                <i className="icon icon-partners-blue icon_xs"></i>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
                <div className="pl__pagination pagination">
                  <ReactPaginate
                    previousLabel={"Prev"}
                    nextLabel={"Next"}
                    breakLabel={"..."}
                    breakClassName={"break-me"}
                    pageCount={partnersList ? partnersList.totalPage : 1}
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
      </div>
    </>
  );
}
