import { useQuery } from "@apollo/client";
import { Loader } from "semantic-ui-react";
import React from "react"

import { useContextMethods } from "../context/methods";
import EditProfileSend from "../components/EditProfileSend";

import { GET_USER } from "../graphql/user";

function EditProfile() {
  const {
    user: { _id: current_user },
  } = useContextMethods();

  const { data, loading } = useQuery(GET_USER, {
    variables: { user_id: current_user },
  });

  return (
    <div className="EditProfile">
      {loading ? <Loader active /> : <EditProfileSend user={data.getUser} />}
    </div>
  );
}

export default EditProfile;
