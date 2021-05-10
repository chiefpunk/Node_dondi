import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Activity() {
  const dondiInfo = useSelector((state) => state.Auth.dondiInfo);

  const currency = useSelector((state) => state.Page.currency);
  const currencyRates = useSelector((state) => state.Page.currencyRate);

  const [activities, setActivities] = useState(null);

  useEffect(() => {
    if (dondiInfo) {
      let amount = 0;
      if (currencyRates) {
        amount = Math.ceil(
          Number(dondiInfo.earnedAmount) * currencyRates[currency]
        );
      }

      setActivities([
        { name: "All Participants", value: dondiInfo.totalParticipants },
        { name: "Last 24 Hour Joins", value: dondiInfo.joinedInDay },
        {
          name: "Total Earned ETH",
          value: dondiInfo.earnedAmount,
        },
        {
          name: `Total Earned ${currency}`,
          value: amount,
        },
      ]);
    }
  }, [dondiInfo, currencyRates, currency]);

  return (
    <>
      <div className="counts">
        <div className="case">
          <div className="counts__list row">
            {activities &&
              activities.map((activity, id) => {
                return (
                  <div className="counts__item" key={id}>
                    <div className="counts__title">{activity.name}</div>
                    <div className="counts__text">{activity.value}</div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
}
