import { useState, useEffect } from "react";
import { Button } from "semantic-ui-react";

import { useContextMethods } from "../context/methods";

import { useMutation, useQuery } from "@apollo/client";
import { TOGGLE_FOLLOW, GET_USER_FOLLOWING } from "../graphql/follow";
// import { GET_ALL_POSTS } from "../graphql/post";

function FollowButton({ user_id }) {
  // ---- CURRENT USER -----
  const {
    user: { _id: current_user },
  } = useContextMethods();

  // ----- CURRENT USER FOLLOWING -----
  const { data: currentUserData } = useQuery(GET_USER_FOLLOWING, {
    variables: { user_id: current_user },
  });

  const [isCurrentUserFollowing, setIsCurrentUserFollowing] = useState(false);

  useEffect(() => {
    currentUserData &&
      setIsCurrentUserFollowing(
        currentUserData.getUserFollowing.find(
          ({ follow_to }) => follow_to._id === user_id
        )
          ? true
          : false
      );
  }, [currentUserData, user_id]);

  const [toggleFollow] = useMutation(TOGGLE_FOLLOW, {
    variables: { user_id },
    refetchQueries: ["getUserFollowing", "getAllPosts"],
    // refetchQueries: [
    //   {
    //     query: GET_USER_FOLLOWING,
    //     variables: { user_id: current_user },
    //   },
    //   {
    //     query: GET_ALL_POSTS,
    //   },
    // ],
    onError(apolloError) {
      console.log(apolloError.message);
    },
  });

  return (
    <>
      {user_id !== current_user && (
        <Button
          style={{ width: "7rem" }}
          content={`${isCurrentUserFollowing ? "Unfollow" : "Follow"}`}
          inverted
          color={`${isCurrentUserFollowing ? "red" : "green"}`}
          onClick={toggleFollow}
        />
      )}
    </>
  );
}

export default FollowButton;
