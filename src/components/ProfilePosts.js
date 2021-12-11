import React, { useState, useEffect } from "react";
import { Grid, Header, Transition, Loader } from "semantic-ui-react";

import PostCard from "./PostCard";
import { useContextMethods } from "../context/methods";

import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { GET_ALL_POSTS, GET_USER_POSTS } from "../graphql/post";
import { GET_USER_FOLLOWING } from "../graphql/follow";

function ProfilePosts({ user_id }) {
  const {
    user: { _id: current_user },
  } = useContextMethods();

  const { data: userFollowingData } = useQuery(GET_USER_FOLLOWING, {
    variables: { user_id: current_user },
  });

  const [getAllPosts, { data: allPostsData, loading: allPostsLoading }] =
    useLazyQuery(GET_ALL_POSTS);

  const [getUserPosts, { data: userPostsData, loading: userPostsLoading }] =
    useLazyQuery(GET_USER_POSTS, {
      variables: { user_id },
    });

  const [isFollowingOrOwn, setIsFollowingOrOwn] = useState(false);

  useEffect(() => {
    if (current_user === user_id) {
      setIsFollowingOrOwn(true);
    } else {
      if (userFollowingData) {
        setIsFollowingOrOwn(
          userFollowingData.getUserFollowing.find(
            ({ follow_to }) => follow_to._id === user_id
          )
            ? true
            : false
        );
      }
    }
  }, [userFollowingData, user_id, current_user]);

  useEffect(() => {
    isFollowingOrOwn ? getAllPosts() : getUserPosts();
  }, [isFollowingOrOwn, getAllPosts, getUserPosts]);

  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    if (allPostsData) {
      setUserPosts(
        allPostsData.getAllPosts.filter(
          ({ posted_by }) => posted_by._id === user_id
        )
      );
    }
  }, [allPostsData, user_id]);

  useEffect(() => {
    if (userPostsData) {
      setUserPosts(userPostsData.getUserPosts);
    }
  }, [userPostsData]);

  return (
    <div className="ProfilePosts" style={{ marginTop: "2rem" }}>
      {allPostsLoading || userPostsLoading ? (
        <Loader active />
      ) : userPosts.length > 0 ? (
        <Grid padded>
          <Grid.Row>
            <Header as="h2">Posts</Header>
          </Grid.Row>

          <Transition.Group>
            {userPosts.map((post) => (
              <Grid.Row key={post._id}>
                <PostCard {...post} onProfilePage={true} />
              </Grid.Row>
            ))}
          </Transition.Group>
        </Grid>
      ) : (
        <Grid padded>
          <Grid.Row centered>
            <Header as="h2">Currently no posts</Header>
          </Grid.Row>
        </Grid>
      )}
    </div>
  );
}

export default ProfilePosts;
