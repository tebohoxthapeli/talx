import gql from "graphql-tag";

const REGISTER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirm_password: String!
  ) {
    register(
      register_input: {
        username: $username
        email: $email
        password: $password
        confirm_password: $confirm_password
      }
    ) {
      _id
      token
      username
    }
  }
`;

const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      _id
      username
      email
      token
    }
  }
`;

const GET_USER = gql`
  query getUser($user_id: ID!) {
    getUser(user_id: $user_id) {
      _id
      username
      email
      joined_on
      website
      location
      about
    }
  }
`;

const SEARCH_USER = gql`
  query searchUser($username: String!) {
    searchUser(username: $username) {
      _id
      username
      about
    }
  }
`;

const EDIT_USER = gql`
  mutation editUser(
    $username: String!
    $email: String!
    $location: String!
    $website: String!
    $about: String!
  ) {
    editUser(
      fields: {
        username: $username
        email: $email
        location: $location
        website: $website
        about: $about
      }
    ) {
      _id
      token
      username
      email
      joined_on
      website
      location
      about
    }
  }
`;

const DELETE_USER = gql`
  mutation deleteUser($password: String!) {
    deleteUser(password: $password)
  }
`;

export { GET_USER, REGISTER, EDIT_USER, LOGIN, DELETE_USER, SEARCH_USER };
