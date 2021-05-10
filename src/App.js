import React from "react";
import { Provider } from "react-redux";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import PublicRoutes from "./router";

import { store, history } from "./redux/store";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <PublicRoutes history={history} />
        <ToastContainer />
      </div>
    </Provider>
  );
}

export default App;
