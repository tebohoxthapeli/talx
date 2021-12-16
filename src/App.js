import React from "react";
import jwt_decode from "jwt-decode";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "semantic-ui-css/semantic.min.css";
import "./App.css";

import { DataLayer } from "./context/DataLayer";
import { initialState } from "./context/reducer";

import MenuBar from "./components/MenuBar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import SinglePost from "./pages/SinglePost";
import Followers from "./pages/Followers";
import Following from "./pages/Following";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import NotFound from "./pages/NotFound";
import SearchUser from "./components/SearchUser";

function App() {
    const token = localStorage.getItem("jwtToken");

    if (token) {
        const decodedToken = jwt_decode(token);

        // checks if token has expired:
        if (decodedToken.exp * 1000 < Date.now()) {
            localStorage.removeItem("jwtToken");
        } else {
            initialState.user = decodedToken;
        }
    }

    return (
        <div className="App__Container">
            <DataLayer>
                <Router>
                    <MenuBar />

                    <div className="App__Grid">
                        <div className="App__Main">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/profile/:user_id" element={<Profile />} />
                                <Route path="/following/:user_id" element={<Following />} />
                                <Route path="/followers/:user_id" element={<Followers />} />
                                <Route path="/edit/:user_id" element={<EditProfile />} />
                                <Route path="/post/:post_id" element={<SinglePost />} />
                                <Route element={<NotFound />} />
                            </Routes>
                        </div>

                        <div className="App__Grid-right">
                            <SearchUser />
                        </div>
                    </div>
                </Router>
            </DataLayer>
        </div>
    );
}

export default App;
