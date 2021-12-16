import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Loader } from "semantic-ui-react";

import { useDataLayerValue } from "../context/DataLayer";
import EditProfileSend from "../components/EditProfileSend";
import { GET_USER } from "../graphql/user";

function EditProfile() {
    const navigate = useNavigate();
    const [
        {
            user: { _id: current_user },
        },
    ] = useDataLayerValue();

    const userRef = useRef();

    useEffect(() => {
        if (!current_user) navigate("/login");
    }, [current_user, navigate]);

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
