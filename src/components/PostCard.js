import React from "react";
import { Card, Label, Image, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import moment from "moment";
import { useQuery } from "@apollo/client";

// import { useContextMethods } from "../context/methods";
import { useDataLayerValue } from "../context/DataLayer";
import LikeButton from "./LikeButton";
import DeleteButton from "./DeleteButton";
import MyPopup from "../util/MyPopup";
import { GET_POST_LIKES } from "../graphql/like";
import { GET_POST_COMMENTS } from "../graphql/comment";

import "../styles/card.css";

function PostCard({ _id: post_id, body, created_at, posted_by, onProfilePage }) {
    // const {
    //     user: { _id: user_id },
    // } = useContextMethods();

    const [
        {
            user: { _id: user_id },
        },
    ] = useDataLayerValue();

    const { data: likes } = useQuery(GET_POST_LIKES, {
        variables: { post_id },
    });

    const { data: comments } = useQuery(GET_POST_COMMENTS, {
        variables: { post_id },
    });

    return (
        <Card fluid color="black">
            <Card.Content>
                <Image
                    circular
                    floated="right"
                    size="mini"
                    src={`https://avatars.dicebear.com/api/identicon/${posted_by.username}.svg`}
                />

                {onProfilePage ? (
                    <Card.Header>{posted_by.username}</Card.Header>
                ) : (
                    <MyPopup content="View profile" position="top left">
                        <Card.Header as={Link} to={`/profile/${posted_by._id}`}>
                            {posted_by.username}
                        </Card.Header>
                    </MyPopup>
                )}

                <MyPopup content="View post and comments" position="right center">
                    <Card.Meta as={Link} to={`/post/${post_id}`}>
                        {moment(created_at).fromNow()}
                    </Card.Meta>
                </MyPopup>

                <Card.Description>{body}</Card.Description>
            </Card.Content>

            <Card.Content extra>
                {likes && <LikeButton post_id={post_id} likes={likes.getPostLikes} />}

                {comments && (
                    <MyPopup content="Comment on post" position="top center">
                        <Button labelPosition="right" as={Link} to={`/post/${post_id}`}>
                            <Button basic icon="comments" color="orange" />

                            <Label basic color="orange">
                                {comments.getPostComments.length}
                            </Label>
                        </Button>
                    </MyPopup>
                )}

                {user_id === posted_by._id && <DeleteButton user_id={user_id} post_id={post_id} />}
            </Card.Content>
        </Card>
    );
}

export default PostCard;
