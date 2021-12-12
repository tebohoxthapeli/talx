import { useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { List, Segment, Header, Loader } from "semantic-ui-react";
import { useParams } from "react-router-dom";

import FollowCard from "../components/FollowCard";
import { useContextMethods } from "../context/methods";

import { GET_USER_FOLLOWERS } from "../graphql/follow";
import { GET_USER } from "../graphql/user";

function Followers() {
  const { user_id } = useParams();

  const {
    user: { _id: current_user },
  } = useContextMethods();

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
