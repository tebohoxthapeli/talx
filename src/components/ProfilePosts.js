import React from "react";
import { Grid, Header, Transition, Loader } from "semantic-ui-react";
import { useQuery } from "@apollo/client";

import PostCard from "./PostCard";
import { GET_USER_POSTS } from "../graphql/post";

export default function ProfilePosts({ user_id }) {
    const { data, loading } = useQuery(GET_USER_POSTS, {
        variables: { user_id },
    });
    
    return (
        <div className="ProfilePosts" style={{ marginTop: "2rem" }}>
            {loading ? (
                <Loader active />
            ) : data.getUserPosts.length > 0 ? (
                <Grid padded>
                    <Grid.Row>
                        <Header as="h2">Posts</Header>
                    </Grid.Row>

                    <Transition.Group>
                        {data.getUserPosts.map((post) => (
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
