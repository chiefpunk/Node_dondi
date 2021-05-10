import React from "react";
import AppRouter from "./AppRouter";

import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";
import Footer from "../../components/layout/Footer";

import Activity from "../../components/common/Activity";

import Notification from "../../components/common/Notification";

export default function App(props) {
  const { url } = props.match;
  return (
    <>
      <Header />

      <main className="main">
        <Activity />
        <div className="page">
          <div className="case">
            <div className="page__wrap row">
              <Sidebar />
              <AppRouter url={url} />
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <Notification />
    </>
  );
}
