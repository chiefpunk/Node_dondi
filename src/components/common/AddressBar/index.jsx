import React from "react";

export default function AddressBar({ name, address }) {
  return (
    <>
      <div className="page__buy block buy">
        <div className="block__body buy__body table">
          <div className="block__data row">
            <div className="block__title subtitle">{name} :</div>
          </div>
          <div className="block__copy copy cp-wrap address-bar">
            <a
              href={`https://etherscan.io/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="cp-btn"
            >
              {address} &nbsp;&nbsp;&nbsp;
              <u>
                <i className="icon icon-link-white icon_xs"></i>
                <i className="icon icon-link-gray icon_xs"></i>
              </u>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
