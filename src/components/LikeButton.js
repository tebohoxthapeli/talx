import React, { useState, useEffect } from "react";
import { Label, Button } from "semantic-ui-react";
import { useMutation } from "@apollo/client";

import MyPopup from "../util/MyPopup";
import { TOGGLE_LIKE, GET_POST_LIKES } from "../graphql/like";
import { useDataLayerValue } from "../context/DataLayer";

function LikeButton({ post_id, likes }) {
    const [
        {
            user: { _id: current_user },
        },
    ] = useDataLayerValue();

    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        if (likes.find(({ liked_by }) => liked_by._id === current_user)) {
            setIsLiked(true);
        } else setIsLiked(false);
    }, [likes, current_user]);

    const [toggleLike] = useMutation(TOGGLE_LIKE, {
        variables: { post_id },

        refetchQueries: [
            {
                query: GET_POST_LIKES,
                variables: { post_id },
            },
        ],
    });

    const likeButton = isLiked ? (
        <Button color="orange" icon="heart" />
    ) : (
        <Button color="orange" basic icon="heart outline" />
    );

    return (
        <>
            <MyPopup content={isLiked ? "Unlike post" : "Like post"} position="top center">
                <Button
                    as="div"
                    labelPosition="right"
                    onClick={() => {
                        setIsLiked(!isLiked);
                        toggleLike();
                    }}>
                    {likeButton}
                    <Label basic color="orange">
                        {likes.length}
                    </Label>
                </Button>
            </MyPopup>
        </>
    );
}

export default LikeButton;
