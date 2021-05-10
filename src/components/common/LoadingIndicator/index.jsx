import React from "react";

export default function LoadingIndicator({ show }) {
  return show ? (
    <>
      <div className="pageloading" aria-label="page-loading">
        <div className="cube1"></div>
        <div className="cube2"></div>
      </div>
    </>
  ) : (
    <></>
  );
}
