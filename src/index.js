import React from "react";
import ReactDOM from "react-dom";

import "./assets/template/styles/css/style.css"; // main styles
import "./assets/styles/styles.scss"; // custom styles
import "./assets/template/styles/css/responsive.css"; // responsive

import App from "./App";
import * as serviceWorker from "./serviceWorker";

import { CookiesProvider } from "react-cookie";

import JavascriptTimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

JavascriptTimeAgo.addLocale(en);

ReactDOM.render(
  <React.StrictMode>
    <CookiesProvider>
      <App />
    </CookiesProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
