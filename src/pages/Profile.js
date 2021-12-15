import { useQuery } from "@apollo/client";
import React from "react";

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Image,
  Grid,
  List,
  Segment,
  Header,
  Button,
  Loader,
} from "semantic-ui-react";
import moment from "moment";

import ProfilePosts from "../components/ProfilePosts";
import FollowButton from "../components/FollowButton";
import FollowLinks from "../components/FollowLinks";
import { useContextMethods } from "../context/methods";

import { GET_USER } from "../graphql/user";

function Profile() {
  const [user, setUser] = useState({
    username: "",
    joined_on: "",
    location: "",
    website: "",
    about: "",
  });

  const {
    user: { _id: current_user },
  } = useContextMethods();

  const { user_id } = useParams();
  const { data, loading } = useQuery(GET_USER, {
    variables: { user_id },
  });

  useEffect(() => {
    data && setUser(data.getUser);
  }, [data]);

  return (
    <div className="Profile">
      {loading ? (
        <Loader active />
      ) : (
        <>
          <Grid verticalAlign="middle">
            <Grid.Row color="black" columns="equal" style={{ padding: "1rem" }}>
              <Grid.Column>
                <Image
                  src={`https://avatars.dicebear.com/api/identicon/${user.username}.svg`}
                  size="small"
                />
              </Grid.Column>

              <Grid.Column>
                <Header as="h3" color="orange">
                  {user.username}
                </Header>
                <List>
                  <List.Item
                    icon="calendar alternate outline"
                    content={`Joined on ${moment(user.joined_on).format(
                      "MMMM Do YYYY"
                    )}`}
                  />
                  {user.location && (
                    <List.Item icon="compass outline" content={user.location} />
                  )}

                  {user.website && (
                    <List.Item icon="globe" content={user.website} />
                  )}
                </List>
              </Grid.Column>

              <Grid.Column textAlign="center">
                {current_user === user_id ? (
                  <Button
                    as={Link}
                    to={`/edit/${current_user}`}
                    content="Edit"
                    icon="edit outline"
                    labelPosition="right"
                    inverted
                    basic
                    color="grey"
                  />
                ) : (
                  <FollowButton user_id={user_id} />
                )}
              </Grid.Column>
            </Grid.Row>

            <Grid.Row style={{ padding: 0 }}>
              <Grid.Column>
                {user.about && <Segment inverted>{user.about}</Segment>}

                <Segment inverted>
                  <FollowLinks user_id={user_id} />
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>

          <ProfilePosts user_id={user_id} />
        </>
      )}
    </div>
  );
}

export default Profile;
