import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import moment from "moment";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, Label, Image, Button, Grid, Loader } from "semantic-ui-react";

import { useDataLayerValue } from "../context/DataLayer";
import LikeButton from "../components/LikeButton";
import DeleteButton from "../components/DeleteButton";
import CommentForm from "../components/CommentForm";
import CommentCard from "../components/CommentCard";
import MyPopup from "../util/MyPopup";
import { GET_POST } from "../graphql/post";
import { GET_POST_LIKES } from "../graphql/like";
import { GET_POST_COMMENTS } from "../graphql/comment";

function SinglePost() {
    const navigate = useNavigate();
    const { post_id } = useParams();

    const [
        {
            user: { _id: current_user },
        },
    ] = useDataLayerValue();

    useEffect(() => {
        if (!current_user) navigate("/login");
    }, [current_user, navigate]);

    const [singlePost, setSinglePost] = useState({
        _id: "",
        body: "",
        created_at: "",
        posted_by: {
            _id: "",
            username: "",
        },
    });

    const { data: post, loading } = useQuery(GET_POST, {
        variables: { post_id },
    });

    const { data: comments } = useQuery(GET_POST_COMMENTS, {
        variables: { post_id },
    });

    const { data: likes } = useQuery(GET_POST_LIKES, {
        variables: { post_id },
    });

    useEffect(() => {
        post && setSinglePost(post.getPost);
    }, [post]);

    return (
        <div className="SinglePost">
            {loading ? (
                <Loader active />
            ) : (
                <Grid style={{ padding: "0 2rem" }}>
                    <Grid.Row columns={2}>
                        <Grid.Column width={3}>
                            <Image
                                circular
                                size="small"
                                src={`https://avatars.dicebear.com/api/identicon/${singlePost.posted_by.username}.svg`}
                            />
                        </Grid.Column>

                        <Grid.Column width={13}>
                            <Card fluid>
                                <Card.Content>
                                    <MyPopup content="View profile" position="top left">
                                        <Card.Header
                                            as={Link}
                                            to={`/profile/${singlePost.posted_by._id}`}>
                                            {singlePost.posted_by.username}
                                        </Card.Header>
                                    </MyPopup>
                                    <Card.Meta>
                                        {moment(singlePost.created_at).calendar()}
                                    </Card.Meta>
                                    <Card.Description>{singlePost.body}</Card.Description>
                                </Card.Content>

                                <Card.Content extra>
                                    {likes && (
                                        <LikeButton post_id={post_id} likes={likes.getPostLikes} />
                                    )}

                                    {comments && (
                                        <Button as="div" labelPosition="right" disabled>
                                            <Button basic color="orange" icon="comments" />

                                            <Label basic color="orange">
                                                {comments.getPostComments.length}
                                            </Label>
                                        </Button>
                                    )}

                                    {current_user === singlePost.posted_by._id && (
                                        <DeleteButton
                                            post_id={post_id}
                                            callback={() => {
                                                navigate("/"); //{replace: true}
                                            }}
                                        />
                                    )}
                                </Card.Content>
                            </Card>
                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Row>
                        <CommentForm post_id={post_id} />
                    </Grid.Row>

                    {comments &&
                        comments.getPostComments.map((cmt) => (
                            <Grid.Row key={cmt._id}>
                                <CommentCard {...cmt} post_id={post_id} />
                            </Grid.Row>
                        ))}
                </Grid>
            )}
        </div>
    );
}

export default SinglePost;
