import React from "react";
import moment from "moment";
import { Card, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";

import { useContextMethods } from "../context/methods";

import DeleteButton from "./DeleteButton";
import MyPopup from "../util/MyPopup";

function CommentCard({
  _id: comment_id,
  body,
  created_at,
  commented_by,
  post_id,
}) {
  const {
    user: { _id: current_user },
  } = useContextMethods();

  return (
    <div className="CommentCard" style={{ width: "100%" }}>
      <Card fluid>
        <Card.Content>
          <Image
            circular
            floated="left"
            size="mini"
            src={`https://avatars.dicebear.com/api/identicon/${commented_by.username}.svg`}
          />

          {current_user === commented_by._id && (
            <DeleteButton comment_id={comment_id} post_id={post_id} />
          )}

          <MyPopup content="View profile" position="top left">
            <Card.Header as={Link} to={`/profile/${commented_by._id}`}>
              {commented_by.username}
            </Card.Header>
          </MyPopup>

          <Card.Meta>{moment(created_at).fromNow()}</Card.Meta>
          <Card.Description>{body}</Card.Description>
        </Card.Content>
      </Card>
    </div>
  );
}

export default CommentCard;
