import React from "react";
import { List, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";

import FollowButton from "./FollowButton";

function FollowCard({ user: { _id: user_id, username, about } }) {
  return (
    <List.Item>
      <List.Content floated="right">
        <FollowButton user_id={user_id} />
      </List.Content>

      <Image
        avatar
        src={`https://avatars.dicebear.com/api/identicon/${username}.svg`}
      />

      <List.Content>
        <List.Header as={Link} to={`/profile/${user_id}`}>
          {username}
        </List.Header>
        {about && (
          <List.Description style={{ fontSize: "13px" }}>
            {about}
          </List.Description>
        )}
      </List.Content>
    </List.Item>
  );
}

export default FollowCard;
