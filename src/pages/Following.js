import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useParams, useNavigate } from "react-router-dom";
import { List, Segment, Header, Loader } from "semantic-ui-react";

// import { useContextMethods } from "../context/methods";
import { useDataLayerValue } from "../context/DataLayer";
import FollowCard from "../components/FollowCard";
import { GET_USER_FOLLOWING } from "../graphql/follow";
import { GET_USER } from "../graphql/user";

function Following() {
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

    const { data, loading } = useQuery(GET_USER_FOLLOWING, {
        variables: { user_id },
    });

    useEffect(() => {
        if (getUserData) {
            if (user_id === current_user) {
                setMsg({
                    postive: "You follow",
                    negative: "You do not follow anybody",
                });
            } else {
                setMsg({
                    postive: `${getUserData.getUser.username} follows`,
                    negative: `${getUserData.getUser.username} does not follow anybody`,
                });
            }
        }
    }, [current_user, user_id, getUserData]);

    return (
        <div className="Following">
            {loading ? (
                <Loader active />
            ) : data.getUserFollowing.length > 0 ? (
                <>
                    <Header as="h2">{msg.postive}</Header>

                    <Segment inverted>
                        <List inverted divided relaxed verticalAlign="middle" size="big">
                            {data.getUserFollowing.map(({ follow_to }) => (
                                <FollowCard key={follow_to._id} user={follow_to} />
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

export default Following;
