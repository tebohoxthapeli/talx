import React, { useEffect, useState } from "react";
import { Route } from "react-router-dom";

// import { useContextMethods } from "../context/methods";
import Home from "../pages/Home";
import Login from "../pages/Login";

function AuthRoute({ element, path }) {
    const [el, setEl] = useState(element);
    // const { user: current_user } = useContextMethods();

    useEffect(() => {
        if (current_user) {
            if (path === "/login" || path === "/register") setEl(<Home />);
        } else {
            if (path !== "/login" || path !== "/register") setEl(<Login />);
        }
    }, [current_user, path]);

    return (
        <>
            <Route path={path} element={el} />
        </>
    );
}

export default AuthRoute;

// Redirect changed to Navigate
// import {Navigate} from "react-router-dom"
// <Navigate replace to="/welcome"/>
// replaced
// <Redirect to = "/welcome"/>

/*
    usage:

    <Route path="/" element={<Navigate replace to="/welcome"/>} />
*/
