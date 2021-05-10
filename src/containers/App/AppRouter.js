import React from "react";
import { Route } from "react-router-dom";

import Home from "../Home";
import Partners from "../Partners";
import Statistics from "../Statistics";
import Guide from "../Guide";
import SlotDetail from "../SlotDetail";

export default function AppRouter(props) {
  const { url } = props;
  const routes = [
    {
      path: "",
      component: Home,
    },
    {
      path: "partners",
      component: Partners,
    },
    {
      path: "statistics",
      component: Statistics,
    },
    {
      path: "how-it-works",
      component: Guide,
    },
    {
      path: "slot",
      component: SlotDetail,
    },
  ];
  return (
    <>
      {routes.map((singleRoute) => {
        const { path, exact, ...otherProps } = singleRoute;
        return (
          <Route
            exact={exact === false ? false : true}
            key={path}
            path={`${url}${path}`}
            {...otherProps}
          />
        );
      })}
    </>
  );
}
