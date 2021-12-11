import React from "react";
import { Route, Redirect } from "react-router-dom";

import { useContextMethods } from "../context/methods";

function AuthRoute({ component: Component, path }) {
  if (useContextMethods().user) {
    return (
      <Route path={path}>
        {path === "/login" || path === "/register" ? (
          <Redirect to="/" />
        ) : (
          <Component />
        )}
      </Route>
    );
  } else {
    return (
      <Route path={path}>
        {path === "/login" || path === "/register" ? (
          <Component />
        ) : (
          <Redirect to="/login" />
        )}
      </Route>
    );
  }
}

export default AuthRoute;
