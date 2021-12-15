import React from "react";
import { Route } from "react-router-dom";

import { useContextMethods } from "../context/methods";
import Home from "../pages/Home";
import Login from "../pages/Login";

function AuthRoute({ component: Component, path }) {
    if (useContextMethods().user) {
        return (
            <Route path={path}>
                {path === "/login" || path === "/register" ? (
                    <Home />
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
                    <Login />
                )}
            </Route>
        );
    }
}

export default AuthRoute;
