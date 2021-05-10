import React from "react";

export default function LangInput() {
  const countryFlagList = [
    "us.svg",
    // "ru.svg",
    // "de.svg",
    // "es.svg",
    // "fr.svg",
    // "it.svg",
    // "pt.svg",
    // "tr.svg",
  ];

  const onHandleChangeLang = () => {
    //
  };

  return (
    <>
      <div className="panel__btn panel__lang lang">
        <div className="lang__current">
          <img src={require("../../../assets/upload/us.svg")} alt="en lang" />
        </div>
        <div className="lang__list">
          {countryFlagList.map((fileName, id) => {
            return (
              <div
                className="lang__item"
                key={id}
                onClick={() => onHandleChangeLang()}
              >
                <img
                  src={require(`../../../assets/upload/${fileName}`)}
                  alt={fileName}
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
