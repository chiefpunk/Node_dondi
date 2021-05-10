import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";

export default function LinkCopy({ name, link, text, affiliate = false }) {
  const [copied, setCopied] = useState(false);
  const profile = useSelector((state) => state.Auth.profile);

  useEffect(() => {
    if (copied) {
      toast("Copied to clipboard!", { type: toast.TYPE.INFO });
      setCopied(false);
    }
  }, [copied]);

  // useEffect(() => {
  //   if (affiliate) {
  //     dispatch(AuthAction.getAffiliate());
  //   }
  // }, [affiliate, dispatch]);

  return (
    <>
      <div className="aside__block block">
        <div className="block__body">
          <div className="block__data row">
            <div className="block__title subtitle">{name}</div>
            <div className="block__count subtitle">
              {profile ? profile.partnersCount : 0}{" "}
              <i className="icon icon-partners-blue icon_xs"></i>
            </div>
            <div className="block__count table">
              {link && (
                <u>
                  <a href={link} target="_blank" rel="noopener noreferrer">
                    <i className="icon icon-link-gray icon_xs"></i>
                    <i className="icon icon-link-white icon_xs"></i>
                  </a>
                </u>
              )}
            </div>
          </div>
          <div className="block__copy copy cp-wrap">
            <div className="copy__input input input_border-gray input_md input_color-violet input_radius input_fz-sm input_padding-more">
              <input
                className="input__area cp-target"
                type="text"
                value={text}
                readOnly="readonly"
              />
            </div>

            <CopyToClipboard text={text} onCopy={() => setCopied(true)}>
              <span className="copy__btn btn btn_bg-violet btn_md btn_radius btn_hover-bg-gray cp-btn">
                <u>
                  <i className="icon icon-copy-white icon_md"></i>
                  <i className="icon icon-copy-gray icon_md"></i>
                </u>
                Copy
              </span>
            </CopyToClipboard>
          </div>
        </div>
      </div>
    </>
  );
}
