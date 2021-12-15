import App from "./App";
import React from "react";

import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

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
    cache: new InMemoryCache(),
});

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
