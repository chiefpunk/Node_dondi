import React from "react";

export default function VisitLink(props) {
  return (
    <>
      <div className="aside__block block">
        <div className="block__body">
          <div className="block__data row">
            <div className="block__title subtitle">{props.name}</div>
          </div>
          <div className="block__copy copy cp-wrap">
            <div className="copy__input input input_border-gray input_md input_color-violet input_radius input_fz-sm input_padding-more">
              <input
                className="input__area cp-target"
                type="text"
                value={props.text}
                readOnly="readonly"
              />
            </div>

            <a
              href={props.link}
              target="_blank"
              rel="noopener noreferrer"
              className="copy__btn btn btn_bg-violet btn_md btn_radius btn_hover-bg-gray cp-btn"
            >
              <u>
                <i className="icon icon-link-white icon_xs"></i>
                <i className="icon icon-link-gray icon_xs"></i>
              </u>
              Visit
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
