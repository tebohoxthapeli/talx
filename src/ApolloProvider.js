import React from "react";
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import App from "./App";

const httpLink = createHttpLink({
    uri: "http://localhost:5000",
});

const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = localStorage.getItem("jwtToken");
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        },
    };
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    getPost: {
                        read(_, { args, toReference }) {
                            return toReference({
                                __typename: "Post",
                                post_id: args.post_id,
                            });
                        },
                    },
                    getUserPosts: {
                        read(_, { args, toReference }) {
                            return toReference({
                                __typename: "Post",
                                id: args.user_id,
                            });
                        },
                    },
                },
            },
        },
    }),
});

export { client };

// const authLink = setContext(() => {
//   const token = localStorage.getItem("jwtToken");
//   return {
//     headers: {
//       Authorization: token ? `Bearer ${token}` : "",
//     },
//   };
// });

export default (
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
);
