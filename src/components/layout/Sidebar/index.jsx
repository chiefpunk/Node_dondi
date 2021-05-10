import React from "react";
import { useSelector } from "react-redux";
import { useCookies } from "react-cookie";

import UserCard from "./userCard";
import LinkCopy from "./linkCopy";
import VisitLink from "./visitLink";

import { PROD_SMARTCONTRACT_ADDRESS } from "../../../helpers/constant";

export default function Sidebar() {
  const userProfile = useSelector((state) => state.Auth.profile);
  // eslint-disable-next-line
  const [cookies, setCookie] = useCookies(["private"]);

  return (
    <aside className="page__aside aside">
      <UserCard />

      {userProfile ? (
        <>
          <LinkCopy
            name="Affiliate link"
            // text={userProfile.affiliateLink}
            text={
              cookies.private === "false" || !cookies.private
                ? userProfile.affiliateLink
                : "https://dondi.io/i/***/"
            }
            affiliate
          />
          {/* <LinkCopy
            name="Smart contract"
            text={userProfile.x3Matrix.lv1[0]}
            link={`https://etherscan.io/address/${userProfile.x3Matrix.lv1[0]}`}
          /> */}
          <VisitLink
            name="Smart contract"
            text={PROD_SMARTCONTRACT_ADDRESS}
            link={`https://etherscan.io/address/${PROD_SMARTCONTRACT_ADDRESS}`}
          />
        </>
      ) : (
        ""
      )}
    </aside>
  );
}
