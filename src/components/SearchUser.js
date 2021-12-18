import React, { useState } from "react";
import { Input, Button, Header, Grid, Image, Form } from "semantic-ui-react";
import { Link } from "react-router-dom";

import { useLazyQuery } from "@apollo/client";
import { SEARCH_USER } from "../graphql/user";

export default function SearchUser() {
    const [username, setUsername] = useState("");
    const [errors, setErrors] = useState({
        notFound: "",
    });

    const [searchUser, { data, loading, error }] = useLazyQuery(SEARCH_USER, {
        variables: { username },
        onError(apolloError) {
            setErrors(apolloError.graphQLErrors[0].extensions.errors);
        },
    });

    const handleSubmit = () => {
        setErrors({
            notFound: "",
        });
        searchUser();
        document.activeElement.blur();
    };

    const resultStyle = {
        border: "1px solid #706e6d",
        borderRadius: "0.28571429rem",
        paddingLeft: "1rem",
        paddingRight: "1rem",
        marginTop: "1.5rem",
        marginLeft: "1.5rem",
        marginRight: "1.5rem",
    };

    return (
        <div className="SearchUser">
            <Grid padded>
                <Grid.Row centered>
                    <Header as="h2">Find people you know</Header>
                </Grid.Row>

                <Grid.Row centered>
                    <Form onSubmit={handleSubmit} style={{ display: "flex", alignItems: "center" }}>
                        <Input
                            type="text"
                            placeholder="Enter username..."
                            action
                            autoComplete="off"
                            spellCheck="false"
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                        />

                        <Button
                            className="searchBtn"
                            loading={loading ? true : false}
                            icon="search"
                            type="submit"
                        />
                    </Form>
                </Grid.Row>

                {data && (
                    <Grid.Row style={resultStyle}>
                        <Link to={`/profile/${data.searchUser._id}`}>
                            <Header
                                as="h3"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                }}>
                                <Image
                                    circular
                                    src={`https://avatars.dicebear.com/api/identicon/${username}.svg`}
                                />
                                {username}
                            </Header>
                            {data.searchUser.about && (
                                <p style={{ color: "white" }}>{`${data.searchUser.about}`}</p>
                            )}
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
