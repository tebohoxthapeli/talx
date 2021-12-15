import { useState, useEffect } from "react";
import React from "react";

import { Input, Button, Header, Grid, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";

import { useLazyQuery } from "@apollo/client";
import { SEARCH_USER } from "../graphql/user";

function SearchUser() {
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState({
    notFound: "",
  });

  useEffect(() => {
    console.log(errors);
    console.log("username:" + username);
  });

  const [searchUser, { data, loading, error }] = useLazyQuery(SEARCH_USER, {
    variables: { username },

    onError(apolloError) {
      setErrors(apolloError.graphQLErrors[0].extensions.errors);
    },
  });

  return (
    <div className="SearchUser">
      <Grid padded>
        <Grid.Row centered>
          <Header as="h2">Find people you know</Header>
        </Grid.Row>

        <Grid.Row centered>
          <Input
            type="text"
            placeholder="Enter username..."
            action
            autoComplete="off"
            spellCheck="false"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          >
            <input />

            <Button
              loading={loading ? true : false}
              icon="search"
              type="submit"
              onClick={() => {
                setErrors({
                  notFound: "",
                });
                searchUser();
              }}
            />
          </Input>
        </Grid.Row>

        {data && (
          <Grid.Row
            style={{
              border: "1px solid #f98404",
              borderRadius: "0.28571429rem",
              paddingLeft: "1rem",
              paddingRight: "1rem",
            }}
          >
            <Link to={`/profile/${data.searchUser._id}`}>
              <Header
                as="h3"
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Image
                  circular
                  src={`https://avatars.dicebear.com/api/identicon/${username}.svg`}
                />
                {username}
              </Header>
              <p style={{ color: "white" }}>{`${data.searchUser.about}`}</p>
            </Link>
          </Grid.Row>
        )}

        {error && (
          <Grid.Row centered>
            <Header as="h2" style={{ color: "#f98404" }}>
              {`${errors.notFound} :(`}
            </Header>
          </Grid.Row>
        )}
      </Grid>
    </div>
  );
}

export default SearchUser;
