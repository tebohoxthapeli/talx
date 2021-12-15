import { Label } from "semantic-ui-react";
import { Link } from "react-router-dom";
import React from "react";


import { useQuery } from "@apollo/client";
import { GET_USER_FOLLOWERS, GET_USER_FOLLOWING } from "../graphql/follow";

function FollowLinks({ user_id }) {
  const { data: following } = useQuery(GET_USER_FOLLOWING, {
    variables: { user_id },
  });

  const { data: followers } = useQuery(GET_USER_FOLLOWERS, {
    variables: { user_id },
  });

  return (
    <>
      <Label.Group size="large" color="black">
        <Label
          as={Link}
          to={`/following/${user_id}`}
          basic
          style={{ marginBottom: 0 }}
        >
          Following
          <Label.Detail>
            {following && following.getUserFollowing.length}
          </Label.Detail>
        </Label>

        <Label
          as={Link}
          to={`/followers/${user_id}`}
          basic
          style={{ marginBottom: 0 }}
        >
          Followers
          <Label.Detail>
            {followers && followers.getUserFollowers.length}
          </Label.Detail>
        </Label>
      </Label.Group>
    </>
  );
}

export default FollowLinks;
