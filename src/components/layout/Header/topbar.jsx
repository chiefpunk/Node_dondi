import React from "react";
import { useSelector } from "react-redux";

export default function Topbar() {
  const idToken = useSelector((state) => state.Auth.idToken);
  const userProfile = useSelector((state) => state.Auth.profile);

  return (
    <>
      <div className="autorization">
        <div className="case">
          <div className="autorization__user au row i-mid mid">
            <div className="au__icon">
              <i className="icon icon-eth"></i>
            </div>
            <div className="au__name">
              {idToken.mode === "auth" ? "Authorized user" : "View mode"}
            </div>
            <div className="au__token">{userProfile.address}</div>
          </div>
        </div>
      </div>
    </>
  );
}
