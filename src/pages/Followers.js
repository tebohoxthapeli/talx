import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { List, Segment, Header, Loader } from "semantic-ui-react";
import { useParams, useNavigate } from "react-router-dom";

// import { useContextMethods } from "../context/methods";
import { useDataLayerValue } from "../context/DataLayer";
import FollowCard from "../components/FollowCard";
import { GET_USER_FOLLOWERS } from "../graphql/follow";
import { GET_USER } from "../graphql/user";

function Followers() {
    const { user_id } = useParams();
    const navigate = useNavigate();

    // const {
    //     user: { _id: current_user },
    // } = useContextMethods();

    const [
        {
            user: { _id: current_user },
        },
    ] = useDataLayerValue();

    useEffect(() => {
        if (!current_user) navigate("/login");
    }, [current_user, navigate]);

    const [msg, setMsg] = useState({
        postive: "",
        negative: "",
    });

    const { data: getUserData } = useQuery(GET_USER, {
        variables: { user_id },
    });

    const { data, loading } = useQuery(GET_USER_FOLLOWERS, {
        variables: { user_id },
    });

    useEffect(() => {
        if (getUserData) {
            if (user_id === current_user) {
                setMsg({
                    postive: "Your followers",
                    negative: "You are not followed by anybody",
                });
            } else {
                setMsg({
                    postive: `${getUserData.getUser.username}'s followers`,
                    negative: `${getUserData.getUser.username} is not followed by anybody`,
                });
            }
        }
    }, [current_user, user_id, getUserData]);

    return (
        <div className="Followers">
            {loading ? (
                <Loader active />
            ) : data.getUserFollowers.length > 0 ? (
                <>
                    <Header as="h2">{msg.postive}</Header>

                    <Segment inverted>
                        <List inverted divided relaxed verticalAlign="middle" size="big">
                            {data.getUserFollowers.map(({ follow_from }) => (
                                <FollowCard key={follow_from._id} user={follow_from} />
                            ))}
                        </List>
                    </Segment>
                </>
            ) : (
                <Header as="h2">{msg.negative}</Header>
            )}
        </div>
    );
}

export default Followers;
