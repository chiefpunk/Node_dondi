import React, { useEffect } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";
import { useSelector, useDispatch } from "react-redux";

import authActions from "./redux/auth/actions";

import App from "./containers/App/App";
import Login from "./containers/Auth/Login";
import Signup from "./containers/Auth/Signup";

const RestrictedRoute = ({ component: Component, isLoggedIn, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        return isLoggedIn ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
            }}
          />
        );
      }}
    />
  );
};

const PublicRoutes = ({ history }) => {
  const idToken = useSelector((state) => state.Auth.idToken);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authActions.checkAuthorization());
  }, [dispatch]);

  return (
    <ConnectedRouter history={history}>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Signup} />
        <Route path="/register/i/:handle" component={Signup} />
        <RestrictedRoute
          path=""
          component={App}
          isLoggedIn={idToken ? true : false}
        />
      </Switch>
    </ConnectedRouter>
  );
};

export default PublicRoutes;
